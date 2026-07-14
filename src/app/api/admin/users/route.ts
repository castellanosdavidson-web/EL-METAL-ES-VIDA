import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/utils/supabase';

const ADMIN_EMAIL = 'elmetalesvidalml@gmail.com';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = getServiceSupabase();

    // Verificar quién hace la petición
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Verificar que el usuario que hace la petición es administrador
    const isSuperAdmin = user.email === ADMIN_EMAIL;
    const isRoleAdmin = user.app_metadata?.role === 'admin';
    if (!isSuperAdmin && !isRoleAdmin) {
      return NextResponse.json({ error: 'No tienes permisos para crear administradores' }, { status: 403 });
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: 'Email o contraseña inválidos (mínimo 6 caracteres)' }, { status: 400 });
    }

    // Crear el nuevo usuario con rol de admin y saltarse la verificación de correo
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      app_metadata: { role: 'admin' }
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: newUser.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
