"use client";
import React, { useState } from 'react';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('¡Artículo subido con éxito!');
        form.reset();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow pt-[100px] pb-stack-loose px-margin-mobile flex flex-col gap-stack-loose w-full max-w-3xl mx-auto">
      <div className="border border-outline-variant bg-surface-container-low p-8 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface uppercase mb-2">Panel Maestro</h1>
        <p className="font-mono-technical text-mono-technical text-on-surface-variant mb-6">PROTOCOLO DE SUBIDA DE ARCHIVOS</p>
        
        {message && (
          <div className={`p-4 mb-6 border ${message.includes('Error') ? 'border-error text-error' : 'border-primary text-primary'} font-label-sm uppercase`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Clave de Acceso</label>
            <input type="password" name="password" required className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical" placeholder="Contraseña de admin" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Título del Artículo</label>
            <input type="text" name="title" required className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-headline-md" placeholder="Ej: Mecánica del Blast Beat" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Categoría</label>
              <select name="category" className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical">
                <option value="Documental Histórico">Documental Histórico</option>
                <option value="Análisis Técnico">Análisis Técnico</option>
                <option value="Ciencia Sonora">Ciencia Sonora</option>
                <option value="Equipamiento">Equipamiento</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Tiempo de Lectura</label>
              <input type="text" name="readTime" required className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical" placeholder="Ej: 12 Minutos" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Imagen de Portada</label>
            <input type="file" name="image" accept="image/*" required className="bg-surface border border-outline-variant p-3 text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-surface hover:file:bg-inverse-primary" />
          </div>

          <button type="submit" disabled={loading} className="mt-4 bg-primary-container text-on-surface py-4 uppercase font-label-sm font-bold tracking-widest hover:bg-inverse-primary transition-colors disabled:opacity-50">
            {loading ? 'SUBIENDO DATOS...' : 'INJECTAR ARTÍCULO A LA MATRIZ'}
          </button>
        </form>
      </div>
    </main>
  );
}
