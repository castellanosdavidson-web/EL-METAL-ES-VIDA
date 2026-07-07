import { NextResponse } from 'next/server';
import { getServiceSupabase, supabase } from '@/utils/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Verificar la autenticación
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Acceso denegado. Falta token.' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Acceso denegado. Token inválido.' }, { status: 401 });
    }

    // 2. Obtener el archivo
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
    }

    const serviceSupabase = getServiceSupabase();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_editor.${fileExt}`;

    // 3. Subir usando la cuenta de servicio (service role) que tiene bypass RLS
    const { error: uploadError } = await serviceSupabase.storage
      .from('articles')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // 4. Obtener URL pública
    const { data: publicUrlData } = serviceSupabase.storage
      .from('articles')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error: any) {
    console.error('Error in API upload:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
