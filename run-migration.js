const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

require('dotenv').config({ path: '.env.local' });

async function run() {
  const S3 = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });

  const BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  console.log('Downloading posts.json from Supabase...');
  const postsRes = await fetch(`${SUPABASE_URL}/storage/v1/object/public/articles/posts.json`);
  if (postsRes.ok) {
    const data = await postsRes.arrayBuffer();
    await S3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: 'posts.json',
      Body: Buffer.from(data),
      ContentType: 'application/json'
    }));
    console.log('Migrated posts.json');
  }

  console.log('Downloading site-settings.json from Supabase...');
  const settingsRes = await fetch(`${SUPABASE_URL}/storage/v1/object/public/articles/site-settings.json`);
  if (settingsRes.ok) {
    const data = await settingsRes.arrayBuffer();
    await S3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: 'site-settings.json',
      Body: Buffer.from(data),
      ContentType: 'application/json'
    }));
    console.log('Migrated site-settings.json');
  }

  const images = ['logo.png', 'cover.png', 'avatar.png'];
  for (const img of images) {
    console.log(`Downloading ${img} from Supabase...`);
    const imgRes = await fetch(`${SUPABASE_URL}/storage/v1/object/public/articles/${img}`);
    if (imgRes.ok) {
      const data = await imgRes.arrayBuffer();
      await S3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: img,
        Body: Buffer.from(data),
        ContentType: imgRes.headers.get('content-type') || 'image/png'
      }));
      console.log(`Migrated ${img}`);
    }
  }
}

run().catch(console.error);
