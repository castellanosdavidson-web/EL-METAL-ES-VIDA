import { NextResponse } from 'next/server';
import { getServiceSupabase, supabase } from '@/utils/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Acceso denegado. Falta token.' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Acceso denegado. Token inválido.' }, { status: 401 });
    }

    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json({ error: 'Falta fileName' }, { status: 400 });
    }

    const serviceSupabase = getServiceSupabase();
    
    // Create signed upload URL
    const { data, error } = await serviceSupabase.storage
      .from('articles')
      .createSignedUploadUrl(fileName);

    if (error) {
      throw error;
    }

    return NextResponse.json({ signedUrl: data.signedUrl, token: data.token, path: data.path });
  } catch (error: any) {
    console.error('Error in signed-url API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
