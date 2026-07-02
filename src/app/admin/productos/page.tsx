"use client";
import React from 'react';

export default function ProductosPage() {
  const dummyProducts: any[] = []; // Empty array as requested

  return (
    <main className="p-8 flex-1 flex flex-col h-full bg-[radial-gradient(circle,#5a413d_1px,transparent_1px)]" style={{ backgroundSize: '32px 32px' }}>
      <div className="space-y-8 max-w-7xl mx-auto w-full bg-surface/90 p-4 backdrop-blur-sm">
        {/* Page Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight">Catálogo de Inventario</h2>
            <p className="font-mono-technical text-mono-technical text-on-surface-variant">DIRECTORIO: /SISTEMA/TIENDA/PRODUCTOS</p>
          </div>
          <button className="bg-primary-container text-on-surface font-label-sm text-label-sm uppercase tracking-widest px-8 py-4 border border-primary-container hover:bg-transparent hover:text-primary transition-all duration-200 active:scale-95 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            Añadir Producto
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-8 border-b border-outline-variant/20 pb-4">
          <div>
            <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Alerta_Stock_Bajo</p>
            <p className="font-headline-md text-headline-md text-primary">0 Ítems</p>
          </div>
          <div className="h-10 w-px bg-outline-variant/20"></div>
          <div>
            <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">SKUs_Activos</p>
            <p className="font-headline-md text-headline-md text-on-surface">0</p>
          </div>
          <div className="h-10 w-px bg-outline-variant/20"></div>
          <div>
            <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Ingresos_24H</p>
            <p className="font-headline-md text-headline-md text-on-surface">$0.00</p>
          </div>
          <div className="h-10 w-px bg-outline-variant/20"></div>
          <div>
            <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Archivados</p>
            <p className="font-headline-md text-headline-md text-on-surface-variant">0</p>
          </div>
        </div>

        {/* Main List Table */}
        <div className="border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/40">
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Nombre Producto</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Categoría</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Precio</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Stock</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Estado</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {dummyProducts.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant font-mono-technical uppercase">NO HAY PRODUCTOS EN LA BASE DE DATOS</td></tr>
                ) : (
                  dummyProducts.map((product, idx) => (
                    <tr key={idx} className="hover:bg-surface-variant/10 transition-colors group">
                      {/* ... rows ... */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination / Footer */}
          <div className="px-6 py-4 bg-surface-container flex justify-between items-center border-t border-outline-variant/20">
            <p className="font-mono-technical text-[11px] text-on-surface-variant uppercase">CARGA_SISTEMA: 0.02s // MOSTRANDO 0 RESULTADOS</p>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center border border-outline-variant/20 hover:bg-primary-container hover:text-on-surface transition-colors active:scale-90" disabled>
                <span className="material-symbols-outlined text-xs">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-primary-container text-on-surface font-mono-technical text-xs">1</button>
              <button className="w-8 h-8 flex items-center justify-center border border-outline-variant/20 hover:bg-primary-container hover:text-on-surface transition-colors active:scale-90" disabled>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
