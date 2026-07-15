import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/utils/supabase';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
      return NextResponse.json({ error: 'Faltan credenciales de R2 en las variables de entorno' }, { status: 500 });
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

    // 1. Descargar posts.json (la base de datos real de artículos)
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('articles')
      .download('posts.json');

    if (downloadError || !fileData) {
      return NextResponse.json({ error: 'No se pudo encontrar posts.json en Supabase' }, { status: 500 });
    }

    const text = await fileData.text();
    const posts = JSON.parse(text || '[]');
    let migratedCount = 0;
    let dbUpdated = false;
    const logs: string[] = [];

    // 2. Iterar sobre todos los artículos
    for (const post of posts) {
      let postUpdated = false;
      const fields = ['imageUrl', 'audioUrl', 'cdImageUrl'];
      
      for (const field of fields) {
        if (post[field] && post[field].includes('supabase.co')) {
          try {
            const url = post[field];
            const filename = url.split('/').pop()?.split('?')[0]; 
            
            if (!filename) continue;

            logs.push(`Migrando ${filename} de ${post.title}`);
            
            const res = await fetch(url);
            if (!res.ok) {
              logs.push(`Error descargando ${url}`);
              continue;
            }
            
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            await S3.send(new PutObjectCommand({
              Bucket: BUCKET_NAME,
              Key: filename,
              Body: buffer,
              ContentType: res.headers.get('content-type') || 'application/octet-stream',
            }));

            post[field] = `${R2_PUBLIC_URL}/${filename}`;
            postUpdated = true;
            migratedCount++;
          } catch (e: any) {
            logs.push(`Error procesando archivo en ${post.title}: ${e.message}`);
          }
        }
      }

      // Migrar imágenes incrustadas en las descripciones
      const descFields = ['desc', 'desc_en', 'desc_pt'];
      for (const dField of descFields) {
        if (post[dField] && post[dField].includes('supabase.co')) {
           try {
            let newContent = post[dField];
            const regex = /https:\/\/[a-zA-Z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/articles\/([a-zA-Z0-9_.-]+)/g;
            
            const matches = [...newContent.matchAll(regex)];
            for (const match of matches) {
              const fullUrl = match[0];
              const filename = match[1];
              
              logs.push(`Migrando imagen en contenido de ${post.title}: ${filename}`);
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
                post[dField] = newContent;
                postUpdated = true;
                migratedCount++;
              }
            }
          } catch (e: any) {
             logs.push(`Error procesando HTML en ${post.title}: ${e.message}`);
          }
        }
      }

      if (postUpdated) {
        dbUpdated = true;
      }
    }

    // 3. Si hubo cambios, subir posts.json actualizado a Supabase Storage
    if (dbUpdated) {
      logs.push('Guardando archivo posts.json actualizado...');
      const { error: updateError } = await supabase.storage
        .from('articles')
        .upload('posts.json', JSON.stringify(posts), {
          upsert: true,
          contentType: 'application/json'
        });

      if (updateError) {
        logs.push(`Error guardando posts.json: ${updateError.message}`);
      } else {
        logs.push('posts.json actualizado exitosamente.');
      }
    } else {
       logs.push('No se encontraron archivos de Supabase para migrar.');
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
