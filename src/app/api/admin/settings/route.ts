import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.storage
      .from('articles')
      .download('site-settings.json');

    if (error || !data) {
      return NextResponse.json({ defaultRadio: 'wacken' }); // Default settings
    }

    const text = await data.text();
    const settings = JSON.parse(text || '{}');
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ defaultRadio: 'wacken' });
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
    const { data: existingData } = await supabase.storage.from('articles').download('site-settings.json');
    if (existingData) {
      try {
        currentSettings = JSON.parse(await existingData.text());
      } catch (e) {}
    }

    const newSettings = { ...currentSettings, ...body };

    const { error: uploadError } = await supabase.storage
      .from('articles')
      .upload('site-settings.json', JSON.stringify(newSettings), {
        cacheControl: '0',
        upsert: true,
        contentType: 'application/json'
      });

    if (uploadError) throw uploadError;

    return NextResponse.json({ success: true, settings: newSettings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
