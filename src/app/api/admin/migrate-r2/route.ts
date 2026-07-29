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

      // Migrar galleryImages
      if (post.galleryImages && Array.isArray(post.galleryImages)) {
        for (let i = 0; i < post.galleryImages.length; i++) {
          if (post.galleryImages[i] && post.galleryImages[i].includes('supabase.co')) {
            try {
              const url = post.galleryImages[i];
              const filename = url.split('/').pop()?.split('?')[0]; 
              if (!filename) continue;

              logs.push(`Migrando imagen de galería de ${post.title}: ${filename}`);
              const res = await fetch(url);
              if (res.ok) {
                const arrayBuffer = await res.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                await S3.send(new PutObjectCommand({
                  Bucket: BUCKET_NAME,
                  Key: filename,
                  Body: buffer,
                  ContentType: res.headers.get('content-type') || 'image/jpeg',
                }));
                post.galleryImages[i] = `${R2_PUBLIC_URL}/${filename}`;
                postUpdated = true;
                migratedCount++;
              }
            } catch (e: any) {
              logs.push(`Error procesando galería en ${post.title}: ${e.message}`);
            }
          }
        }
      }

      if (postUpdated) {
        dbUpdated = true;
      }
    }

    // 3. Subir posts.json a R2 (Siempre, para asegurar que la base de datos principal viva en R2 a partir de ahora)
    logs.push('Guardando archivo posts.json en Cloudflare R2...');
    try {
      await S3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: 'posts.json',
        Body: Buffer.from(JSON.stringify(posts)),
        ContentType: 'application/json',
      }));
      logs.push('posts.json subido exitosamente a R2.');
      dbUpdated = true; // Forzamos true ya que lo migramos de todas formas
    } catch (e: any) {
      logs.push(`Error guardando posts.json en R2: ${e.message}`);
    }

    // 4. Migrar site-settings.json a R2
    logs.push('Migrando site-settings.json a R2...');
    const { data: settingsData, error: settingsError } = await supabase.storage.from('articles').download('site-settings.json');
    if (!settingsError && settingsData) {
      try {
        const settingsText = await settingsData.text();
        await S3.send(new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: 'site-settings.json',
          Body: Buffer.from(settingsText),
          ContentType: 'application/json',
        }));
        logs.push('site-settings.json subido exitosamente a R2.');
        migratedCount++;
      } catch (e: any) {
        logs.push(`Error guardando site-settings.json en R2: ${e.message}`);
      }
    } else {
      logs.push('No se encontró site-settings.json en Supabase para migrar.');
    }

    // 5. Migrar imágenes de administrador (logo.png, cover.png, avatar.png)
    const adminImages = ['logo.png', 'cover.png', 'avatar.png'];
    for (const img of adminImages) {
      logs.push(`Migrando ${img} a R2...`);
      const { data: imgData, error: imgError } = await supabase.storage.from('articles').download(img);
      if (!imgError && imgData) {
        try {
          const imgBuffer = await imgData.arrayBuffer();
          await S3.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: img,
            Body: Buffer.from(imgBuffer),
            ContentType: imgData.type || 'image/png',
          }));
          logs.push(`${img} subido exitosamente a R2.`);
          migratedCount++;
        } catch (e: any) {
          logs.push(`Error guardando ${img} en R2: ${e.message}`);
        }
      } else {
        logs.push(`No se encontró ${img} en Supabase.`);
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
