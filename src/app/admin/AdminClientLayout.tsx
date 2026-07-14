"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessionUser, setSessionUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const [adminName, setAdminName] = React.useState('DAVIDSON SCJ');
  const [avatarUrl, setAvatarUrl] = React.useState('');

  React.useEffect(() => {
    const ADMIN_EMAIL = 'elmetalesvidalml@gmail.com';

    const checkAdminSession = async (session: any) => {
      if (!session) {
        if (pathname !== '/admin/login') router.push('/admin/login');
        else setLoading(false);
      } else {
        const isSuperAdmin = session.user?.email === ADMIN_EMAIL;
        const isRoleAdmin = session.user?.app_metadata?.role === 'admin';
        
        if (!isSuperAdmin && !isRoleAdmin) {
          // If neither super admin nor role admin, sign out and redirect to login
          await supabase.auth.signOut();
          router.push('/admin/login?error=unauthorized');
        } else {
          setSessionUser(session.user);
          setLoading(false);
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdminSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAdminSession(session);
    });

    // Cargar perfil dinámico
    const storedName = localStorage.getItem('admin_name');
    if (storedName) setAdminName(storedName);
    
    const { data } = supabase.storage.from('articles').getPublicUrl('avatar.png');
    if (data && data.publicUrl) {
      setAvatarUrl(data.publicUrl + '?t=' + Date.now());
    }

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push('/');
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    if (isActive) {
      return "flex items-center gap-stack-tight bg-primary text-on-primary font-bold px-4 py-3 border-l-4 border-on-primary-fixed-variant";
    }
    return "flex items-center gap-stack-tight text-on-surface-variant hover:bg-surface-variant/30 px-4 py-3 border-l-4 border-transparent hover:text-primary transition-all";
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-primary font-mono-technical animate-pulse">VERIFICANDO_ACCESO...</div>;
  }

  return (
    <div className="bg-background min-h-screen text-on-surface font-body-md overflow-x-hidden flex">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-screen flex flex-col border-r border-outline-variant/20 bg-surface-dim w-64 z-50">
        <div className="p-4 flex flex-col gap-2 border-b border-outline-variant/10">
          <h1 className="font-mono-technical text-[10px] tracking-widest text-primary/60 uppercase">System console // ARCHIVE</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center overflow-hidden border border-outline-variant/30">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <span className="material-symbols-outlined text-white text-base">person</span>
              )}
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface leading-none">{adminName}</p>
              <p className="text-[8.5px] uppercase tracking-tighter text-on-surface-variant opacity-60 mt-0.5">Admin de Sistema</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 mt-4 flex flex-col">
          <Link className={getLinkClass('/admin')} href="/admin">
            <span className="material-symbols-outlined" style={pathname === '/admin' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Dashboard</span>
          </Link>
          <Link className={getLinkClass('/admin/articulos')} href="/admin/articulos">
            <span className="material-symbols-outlined" style={pathname.includes('/articulos') ? { fontVariationSettings: "'FILL' 1" } : {}}>article</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Artículos</span>
          </Link>
          <Link className={getLinkClass('/admin/bandas')} href="/admin/bandas">
            <span className="material-symbols-outlined" style={pathname.includes('/bandas') ? { fontVariationSettings: "'FILL' 1" } : {}}>groups</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Bandas</span>
          </Link>
          <Link className={getLinkClass('/admin/coleccion')} href="/admin/coleccion">
            <span className="material-symbols-outlined" style={pathname.includes('/coleccion') ? { fontVariationSettings: "'FILL' 1" } : {}}>album</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Lanzamientos</span>
          </Link>
          <Link className={getLinkClass('/admin/taller')} href="/admin/taller">
            <span className="material-symbols-outlined" style={pathname.includes('/taller') ? { fontVariationSettings: "'FILL' 1" } : {}}>build</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Taller</span>
          </Link>
          <Link className={getLinkClass('/admin/productos')} href="/admin/productos">
            <span className="material-symbols-outlined" style={pathname.includes('/productos') ? { fontVariationSettings: "'FILL' 1" } : {}}>shopping_cart</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Afiliados</span>
          </Link>

          <Link className={getLinkClass('/admin/usuarios')} href="/admin/usuarios">
            <span className="material-symbols-outlined" style={pathname.includes('/usuarios') ? { fontVariationSettings: "'FILL' 1" } : {}}>group</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Usuarios</span>
          </Link>
          <Link className={getLinkClass('/admin/ajustes')} href="/admin/ajustes">
            <span className="material-symbols-outlined" style={pathname.includes('/ajustes') ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Ajustes</span>
          </Link>
        </nav>
        <div className="mt-auto border-t border-outline-variant/10 p-gutter flex flex-col gap-base">
          <button onClick={handleLogout} className="flex items-center gap-stack-tight text-on-surface-variant hover:text-error px-2 py-1 font-label-sm text-label-sm uppercase transition-all mb-4">
            <span className="material-symbols-outlined">logout</span>
            Salir al Inicio
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <div className="ml-64 w-full flex-1 flex flex-col max-w-[calc(100vw-16rem)] min-h-screen">
        {/* TopNavBar */}
        <header className="sticky top-0 z-40 flex flex-col justify-center w-full px-gutter bg-background border-b border-outline-variant/20 h-24">
          <div className="w-full flex justify-between items-center mb-2">
            <img src="/LOGO 2.png" alt="El Metal Es Vida Logo" className="h-6 object-contain ml-4 opacity-80" />
            <div className="flex items-center gap-gutter pr-gutter">
              <span className="font-mono-technical text-[10px] text-primary">v2.4.0_CORE</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary ml-4 text-sm">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-on-surface-variant font-mono-technical text-xs w-64 uppercase tracking-widest outline-none" placeholder="BUSCAR_EN_ARCHIVO..." type="text"/>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
