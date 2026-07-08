import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/utils/supabase';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Falta email' }, { status: 400 });
    }

    const serviceSupabase = getServiceSupabase();

    const { error } = await serviceSupabase
      .from('subscribers')
      .upsert([{ email }], { onConflict: 'email' });

    if (error && error.code !== '23505') { // Also handle unique constraint just in case onConflict is missing
      console.error('Error insertando email:', error);
      return NextResponse.json({ error: 'Error guardando email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error en POST /api/subscribers:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Proteger ruta con Supabase Auth (igual que articles)
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Falta token de autenticación' }, { status: 401 });
    }

    const serviceSupabase = getServiceSupabase();
    const { data: { user }, error: authError } = await serviceSupabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Acceso Denegado (Token inválido)' }, { status: 401 });
    }

    const { data, error } = await serviceSupabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Error obteniendo suscriptores' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
