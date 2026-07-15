import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/utils/supabase';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Proteger la ruta - solo administradores deberían poder correr esto, pero para esta migración 
    // validaremos que estén configuradas las variables de R2
    if (!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
      return NextResponse.json({ error: 'Faltan credenciales de R2' }, { status: 500 });
    }

    const S3 = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      },
    });

    const supabase = getServiceSupabase();
    const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL!;
    const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) throw error;

    let migratedCount = 0;
    const logs: string[] = [];

    for (const article of articles) {
      let updated = false;
      const updates: any = {};

      const fields = ['imageUrl', 'audioUrl', 'cdImageUrl', 'cover'];
      
      for (const field of fields) {
        if (article[field] && article[field].includes('supabase.co')) {
          try {
            const url = article[field];
            const filename = url.split('/').pop()?.split('?')[0]; // Limpiar query params si hay
            
            if (!filename) continue;

            logs.push(`Migrando ${filename} de la columna ${field} (Articulo: ${article.title})`);
            
            // 1. Descargar de Supabase
            const res = await fetch(url);
            if (!res.ok) {
              logs.push(`Error descargando ${url}`);
              continue;
            }
            
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            // 2. Subir a R2
            await S3.send(new PutObjectCommand({
              Bucket: BUCKET_NAME,
              Key: filename,
              Body: buffer,
              ContentType: res.headers.get('content-type') || 'application/octet-stream',
            }));

            // 3. Preparar actualización DB
            updates[field] = `${R2_PUBLIC_URL}/${filename}`;
            updated = true;
            migratedCount++;
          } catch (e: any) {
            logs.push(`Error procesando archivo en ${article.title}: ${e.message}`);
          }
        }
      }

      // Reemplazar URLs dentro del contenido HTML si existen
      if (article.content && article.content.includes('supabase.co')) {
        try {
          let newContent = article.content;
          const regex = /https:\/\/[a-zA-Z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/articles\/([a-zA-Z0-9_.-]+)/g;
          
          const matches = [...newContent.matchAll(regex)];
          for (const match of matches) {
            const fullUrl = match[0];
            const filename = match[1];
            
            logs.push(`Migrando imagen embebida en contenido: ${filename}`);
            const res = await fetch(fullUrl);
            if (res.ok) {
              const arrayBuffer = await res.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              
              await S3.send(new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: filename,
                Body: buffer,
                ContentType: res.headers.get('content-type') || 'image/jpeg',
              }));

              newContent = newContent.replace(fullUrl, `${R2_PUBLIC_URL}/${filename}`);
              updates.content = newContent;
              updated = true;
              migratedCount++;
            }
          }
        } catch (e: any) {
           logs.push(`Error procesando contenido HTML en ${article.title}: ${e.message}`);
        }
      }

      // 4. Actualizar Base de Datos
      if (updated) {
        await supabase.from('articles').update(updates).eq('id', article.id);
        logs.push(`✓ Base de datos actualizada para: ${article.title}`);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Migración completada. Archivos migrados: ${migratedCount}`, 
      logs 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
