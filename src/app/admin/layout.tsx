"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessionUser, setSessionUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else {
        setSessionUser(session?.user);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else {
        setSessionUser(session?.user);
      }
    });

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
        <div className="p-gutter flex flex-col gap-base">
          <h1 className="font-headline-md text-headline-md text-primary tracking-tighter uppercase font-bold mt-4">METAL_ARCHIVE</h1>
          <div className="flex items-center gap-stack-tight mt-stack-loose">
            <div className="w-10 h-10 bg-primary-container rounded-sm flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-white">person</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface">OPERATOR_01</p>
              <p className="text-[10px] uppercase tracking-tighter text-on-surface-variant opacity-60">Administrador de Sistema</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 mt-stack-loose flex flex-col">
          <Link className={getLinkClass('/admin')} href="/admin">
            <span className="material-symbols-outlined" style={pathname === '/admin' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Dashboard</span>
          </Link>
          <Link className={getLinkClass('/admin/articulos')} href="/admin/articulos">
            <span className="material-symbols-outlined" style={pathname.includes('/articulos') ? { fontVariationSettings: "'FILL' 1" } : {}}>article</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Artículos</span>
          </Link>
          <Link className={getLinkClass('/admin/productos')} href="/admin/productos">
            <span className="material-symbols-outlined" style={pathname.includes('/productos') ? { fontVariationSettings: "'FILL' 1" } : {}}>inventory_2</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Productos</span>
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
        <header className="sticky top-0 z-40 flex justify-between items-center w-full px-gutter bg-background border-b border-outline-variant/20 h-16">
          <div className="flex items-center gap-gutter">
            <span className="material-symbols-outlined text-primary ml-4">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-on-surface-variant font-mono-technical text-mono-technical w-64 uppercase tracking-widest outline-none" placeholder="BUSCAR_EN_ARCHIVO..." type="text"/>
          </div>
          <div className="flex items-center gap-gutter pr-gutter">
            <span className="font-mono-technical text-mono-technical text-primary">v2.4.0_CORE</span>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
