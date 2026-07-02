import { NextResponse } from 'next/server';
import { getServiceSupabase, supabase } from '@/utils/supabase';

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
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const readTime = formData.get('readTime') as string;
    const image = formData.get('image') as File;
    const password = formData.get('password') as string;

    if (password !== 'metaladmin') {
      return NextResponse.json({ error: 'Acceso Denegado' }, { status: 401 });
    }

    const serviceSupabase = getServiceSupabase();

    let imageUrl = '';
    if (image) {
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

    const newPost = {
      id: Date.now().toString(),
      title,
      category,
      readTime,
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
