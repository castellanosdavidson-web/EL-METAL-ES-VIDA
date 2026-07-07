import { NextResponse } from 'next/server';
import { getServiceSupabase, supabase } from '@/utils/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase.storage.from('articles').download('posts.json');
    if (error) throw error;
    
    const text = await data.text();
    const posts = JSON.parse(text || '[]');
    
    // Devolver los artículos (ordenados del más reciente al más antiguo)
    return NextResponse.json(posts.reverse());
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Falta token de autenticación' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Acceso Denegado (Token inválido)' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const desc = formData.get('desc') as string;
    const category = formData.get('category') as string;
    const readTime = formData.get('readTime') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const image = formData.get('image') as File;

    const serviceSupabase = getServiceSupabase();

    let imageUrl = '';
    if (image && image.name) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await serviceSupabase.storage
        .from('articles')
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = serviceSupabase.storage
        .from('articles')
        .getPublicUrl(fileName);
        
      imageUrl = publicUrlData.publicUrl;
    }

    // Download existing posts
    const { data: fileData, error: downloadError } = await serviceSupabase.storage
      .from('articles')
      .download('posts.json');

    let posts = [];
    if (!downloadError && fileData) {
      const text = await fileData.text();
      posts = JSON.parse(text || '[]');
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newPost = {
      id: Date.now().toString(),
      title,
      slug: slug + '-' + Date.now().toString().slice(-4),
      desc: desc || '',
      youtubeUrl: youtubeUrl || '',
      category,
      readTime: readTime || '',
      imageUrl,
      createdAt: new Date().toISOString()
    };

    posts.push(newPost);

    // Upload updated posts
    const { error: updateError } = await serviceSupabase.storage
      .from('articles')
      .upload('posts.json', JSON.stringify(posts), {
        upsert: true,
        contentType: 'application/json'
      });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    console.error('Error saving article:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Falta token de autenticación' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Acceso Denegado (Token inválido)' }, { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const desc = formData.get('desc') as string;
    const category = formData.get('category') as string;
    const readTime = formData.get('readTime') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const image = formData.get('image') as File | null;

    const serviceSupabase = getServiceSupabase();

    // Obtener los artículos existentes
    const { data: fileData, error: downloadError } = await serviceSupabase.storage
      .from('articles')
      .download('posts.json');

    if (downloadError || !fileData) {
      throw new Error('No se pudo descargar la base de datos de artículos.');
    }

    const text = await fileData.text();
    let posts = JSON.parse(text || '[]');

    const postIndex = posts.findIndex((p: any) => p.id.toString() === id.toString());
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
    }

    let imageUrl = posts[postIndex].imageUrl;

    if (image && image.name && image.size > 0) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await serviceSupabase.storage
        .from('articles')
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = serviceSupabase.storage
        .from('articles')
        .getPublicUrl(fileName);
        
      imageUrl = publicUrlData.publicUrl;
    }

    let slug = posts[postIndex].slug;
    if (!slug) {
      slug = (title || posts[postIndex].title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + id.toString().slice(-4);
    }

    // Actualizar el post
    posts[postIndex] = {
      ...posts[postIndex],
      title: title || posts[postIndex].title,
      slug: slug,
      desc: desc !== null ? desc : posts[postIndex].desc,
      youtubeUrl: youtubeUrl !== null ? youtubeUrl : (posts[postIndex].youtubeUrl || ''),
      category: category || posts[postIndex].category,
      readTime: readTime !== null ? readTime : posts[postIndex].readTime,
      imageUrl: imageUrl,
      updatedAt: new Date().toISOString()
    };

    // Subir nuevamente los posts
    const { error: updateError } = await serviceSupabase.storage
      .from('articles')
      .upload('posts.json', JSON.stringify(posts), {
        upsert: true,
        contentType: 'application/json'
      });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, post: posts[postIndex] });
  } catch (error: any) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Falta token de autenticación' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Acceso Denegado (Token inválido)' }, { status: 401 });
    }

    const { id, is_hidden } = await request.json();

    const serviceSupabase = getServiceSupabase();

    const { data: fileData, error: downloadError } = await serviceSupabase.storage
      .from('articles')
      .download('posts.json');

    if (downloadError || !fileData) {
      throw new Error('No se pudo descargar la base de datos de artículos.');
    }

    const text = await fileData.text();
    let posts = JSON.parse(text || '[]');

    const postIndex = posts.findIndex((p: any) => p.id.toString() === id.toString());
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
    }

    posts[postIndex].is_hidden = is_hidden;

    const { error: updateError } = await serviceSupabase.storage
      .from('articles')
      .upload('posts.json', JSON.stringify(posts), {
        upsert: true,
        contentType: 'application/json'
      });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Falta token de autenticación' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Acceso Denegado (Token inválido)' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const serviceSupabase = getServiceSupabase();

    const { data: fileData, error: downloadError } = await serviceSupabase.storage
      .from('articles')
      .download('posts.json');

    if (downloadError || !fileData) {
      throw new Error('No se pudo descargar la base de datos de artículos.');
    }

    const text = await fileData.text();
    let posts = JSON.parse(text || '[]');

    posts = posts.filter((p: any) => p.id.toString() !== id.toString());

    const { error: updateError } = await serviceSupabase.storage
      .from('articles')
      .upload('posts.json', JSON.stringify(posts), {
        upsert: true,
        contentType: 'application/json'
      });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
