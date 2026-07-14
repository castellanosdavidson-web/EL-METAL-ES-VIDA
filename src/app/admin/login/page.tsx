"use client";
import React, { useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/admin');
      }
    });
  }, [router]);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // Iniciar sesión
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage(`Error al ingresar: ${error.message}`);
    } else {
      // Redirigir al panel si es exitoso
      router.push('/admin');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-[88px] flex items-center justify-center bg-background px-4">
      <div className="border border-outline-variant p-8 flex flex-col items-center gap-6 bg-surface-container max-w-md w-full shadow-2xl">
        <div className="flex flex-col items-center text-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary text-4xl mb-2">admin_panel_settings</span>
          <h1 className="font-headline-lg uppercase text-on-surface">Panel Central</h1>
          <p className="font-body-md text-on-surface-variant">
            Ingresa con tu correo y contraseña.
          </p>
        </div>
        
        {message && (
          <div className="w-full bg-primary-container/20 border border-primary text-primary p-3 text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="w-full flex flex-col gap-4">
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background border border-outline-variant p-4 text-on-surface outline-none focus:border-primary transition-colors"
          />
          <div className="relative w-full">
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-outline-variant p-4 pr-12 text-on-surface outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary px-6 py-4 uppercase font-label-technical font-bold flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined">login</span>
            {loading ? 'PROCESANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>

      </div>
    </main>
  );
}
