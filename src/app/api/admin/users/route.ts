import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/utils/supabase';

const ADMIN_EMAIL = 'elmetalesvidalml@gmail.com';

async function checkAdminAuth(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return { error: 'No autorizado', status: 401 };

  const token = authHeader.replace('Bearer ', '');
  const supabase = getServiceSupabase();

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return { error: 'Token inválido', status: 401 };

  const isSuperAdmin = user.email === ADMIN_EMAIL;
  const isRoleAdmin = user.app_metadata?.role === 'admin';
  if (!isSuperAdmin && !isRoleAdmin) {
    return { error: 'No tienes permisos', status: 403 };
  }

  return { supabase, user };
}

export async function GET(request: Request) {
  try {
    const auth = await checkAdminAuth(request);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { supabase } = auth;
    const { data: { users }, error } = await supabase!.auth.admin.listUsers();
    
    if (error) throw error;

    // Filter only those who have app_metadata.role === 'admin'
    const adminUsers = users.filter((u: any) => u.app_metadata?.role === 'admin' && u.email !== ADMIN_EMAIL);
    
    return NextResponse.json({ success: true, users: adminUsers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await checkAdminAuth(request);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: 'Email o contraseña inválidos (mínimo 6 caracteres)' }, { status: 400 });
    }

    const { supabase } = auth;
    const { data: newUser, error: createError } = await supabase!.auth.admin.createUser({
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

export async function PATCH(request: Request) {
  try {
    const auth = await checkAdminAuth(request);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await request.json();
    const { id, password } = body;

    if (!id || !password || password.length < 6) {
      return NextResponse.json({ error: 'ID o contraseña inválidos (mínimo 6 caracteres)' }, { status: 400 });
    }

    const { supabase } = auth;
    
    // Prevent updating the super admin
    const { data: userToUpdate } = await supabase!.auth.admin.getUserById(id);
    if (userToUpdate.user?.email === ADMIN_EMAIL) {
      return NextResponse.json({ error: 'No se puede modificar al SuperAdmin' }, { status: 403 });
    }

    const { data: updatedUser, error: updateError } = await supabase!.auth.admin.updateUserById(id, {
      password: password
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: updatedUser.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await checkAdminAuth(request);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const { supabase } = auth;
    
    // Prevent deleting the super admin
    const { data: userToDelete } = await supabase!.auth.admin.getUserById(id);
    if (userToDelete.user?.email === ADMIN_EMAIL) {
      return NextResponse.json({ error: 'No se puede eliminar al SuperAdmin' }, { status: 403 });
    }

    const { error: deleteError } = await supabase!.auth.admin.deleteUser(id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
