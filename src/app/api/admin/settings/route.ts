import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const S3 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    const res = await fetch(`${process.env.CLOUDFLARE_R2_PUBLIC_URL}/site-settings.json`, { cache: 'no-store' });

    if (!res.ok) {
      return NextResponse.json({ defaultRadio: 'wacken' }); // Default settings
    }

    const text = await res.text();
    const settings = JSON.parse(text || '{}');
    settings.r2Url = process.env.CLOUDFLARE_R2_PUBLIC_URL;
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ defaultRadio: 'wacken', r2Url: process.env.CLOUDFLARE_R2_PUBLIC_URL });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate session
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First fetch existing settings to merge
    let currentSettings = {};
    const res = await fetch(`${process.env.CLOUDFLARE_R2_PUBLIC_URL}/site-settings.json`, { cache: 'no-store' });
    if (res.ok) {
      try {
        currentSettings = JSON.parse(await res.text());
      } catch (e) {}
    }

    const newSettings = { ...currentSettings, ...body };

    await S3.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: 'site-settings.json',
      Body: Buffer.from(JSON.stringify(newSettings)),
      ContentType: 'application/json'
    }));

    return NextResponse.json({ success: true, settings: newSettings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
