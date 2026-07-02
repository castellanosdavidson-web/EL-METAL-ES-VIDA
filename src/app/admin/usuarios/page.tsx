"use client";
import React from 'react';

export default function UsuariosPage() {
  const dummyUsers = [
    {
      id: "K_VALENTINE_88",
      email: "val.k@neuralmail.io",
      tier: "Backstage",
      tierColor: "bg-primary-container/20 border-primary text-primary",
      joinDate: "2023.11.12"
    },
    {
      id: "VOID_STRIDER",
      email: "strider@void.tech",
      tier: "Vinyl",
      tierColor: "bg-secondary-container/20 border-secondary text-secondary",
      joinDate: "2024.01.05"
    },
    {
      id: "CYBER_PUNK_X",
      email: "x@underground.net",
      tier: "Cassette",
      tierColor: "bg-outline-variant/20 border-outline text-outline",
      joinDate: "2024.02.28"
    },
    {
      id: "NEON_GHOST",
      email: "ghost@neon.sys",
      tier: "Backstage",
      tierColor: "bg-primary-container/20 border-primary text-primary",
      joinDate: "2023.12.30"
    }
  ];

  return (
    <main className="p-8 flex-1 flex flex-col h-full">
      <div className="space-y-8 max-w-7xl mx-auto w-full">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/10 pb-4">
          <div>
            <h2 className="font-display-lg text-display-lg text-on-surface leading-tight mb-2 uppercase tracking-tight">La Legión</h2>
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-primary-container"></span>
              <p className="font-mono-technical text-mono-technical text-primary uppercase tracking-widest">Archivo de Personal Registrado // TOTAL_CUENTA: 12,402</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 border border-outline-variant/30 text-on-surface font-label-sm uppercase tracking-widest hover:bg-surface-variant/40 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Exportar_CSV
            </button>
            <button className="px-6 py-3 bg-primary-container text-on-primary font-label-sm uppercase tracking-widest hover:bg-inverse-primary transition-all active:scale-95 flex items-center gap-2 border border-primary-container">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Registrar_Nuevo
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-masonry-gap">
          <div className="border border-outline-variant/20 p-6 bg-surface-container-lowest">
            <p className="font-label-sm text-on-surface-variant uppercase mb-2">Activos_Ahora</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">1,204</p>
            <div className="w-full bg-outline-variant/20 h-1 mt-4">
              <div className="bg-primary h-full w-[65%]"></div>
            </div>
          </div>
          <div className="border border-outline-variant/20 p-6 bg-surface-container-lowest">
            <p className="font-label-sm text-on-surface-variant uppercase mb-2">Nivel_Backstage</p>
            <p className="font-headline-lg text-headline-lg text-primary">842</p>
            <p className="font-mono-technical text-[10px] text-outline mt-2">+12% vs ciclo anterior</p>
          </div>
          <div className="border border-outline-variant/20 p-6 bg-surface-container-lowest">
            <p className="font-label-sm text-on-surface-variant uppercase mb-2">Nivel_Vinyl</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">3,120</p>
            <p className="font-mono-technical text-[10px] text-outline mt-2">+4% vs ciclo anterior</p>
          </div>
          <div className="border border-outline-variant/20 p-6 bg-surface-container-lowest">
            <p className="font-label-sm text-on-surface-variant uppercase mb-2">Nivel_Cassette</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">8,440</p>
            <p className="font-mono-technical text-[10px] text-outline mt-2">-2% vs ciclo anterior</p>
          </div>
        </div>

        {/* USERS TABLE CONTAINER */}
        <div className="border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
          <div className="bg-surface-variant/30 p-4 border-b border-outline-variant/20 flex justify-between items-center">
            <div className="flex gap-4">
              <button className="font-label-sm uppercase text-primary border-b-2 border-primary pb-1">Todos_Los_Miembros</button>
              <button className="font-label-sm uppercase text-on-surface-variant hover:text-on-surface transition-colors pb-1">Suspendidos</button>
              <button className="font-label-sm uppercase text-on-surface-variant hover:text-on-surface transition-colors pb-1">Auth_Pendiente</button>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">filter_list</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-highest/50">
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20">Nombre de Usuario</th>
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20">Email</th>
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20">Nivel de Membresía</th>
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20">Fecha de Ingreso</th>
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {dummyUsers.map((user, idx) => (
                  <tr key={idx} className="hover:bg-surface-variant/20 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-container border border-outline-variant/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">person</span>
                        </div>
                        <span className="font-mono-technical text-on-surface font-bold uppercase tracking-tight">{user.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-on-surface-variant font-mono-technical">{user.email}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 border font-label-sm uppercase text-[10px] ${user.tierColor}`}>{user.tier}</span>
                    </td>
                    <td className="px-6 py-5 text-on-surface-variant font-mono-technical">{user.joinDate}</td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="w-8 h-8 flex items-center justify-center border border-outline-variant/20 text-on-surface-variant hover:text-primary transition-all" title="Mensaje">
                          <span className="material-symbols-outlined text-[18px]">mail</span>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center border border-outline-variant/20 text-on-surface-variant hover:text-on-surface transition-all" title="Editar">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center border border-outline-variant/20 text-on-surface-variant hover:text-error hover:border-error transition-all" title="Bloquear">
                          <span className="material-symbols-outlined text-[18px]">block</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* TABLE FOOTER / PAGINATION */}
          <div className="bg-surface-container p-4 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-mono-technical text-[12px] text-on-surface-variant">MOSTRANDO_ENTRADAS: 1-4_DE_12402</p>
            <div className="flex gap-2">
              <button className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-20" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 border border-primary text-primary flex items-center justify-center bg-primary-container/10">1</button>
              <button className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">2</button>
              <button className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">3</button>
              <span className="flex items-center px-2 text-on-surface-variant">...</span>
              <button className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">1240</button>
              <button className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY LOG */}
        <div className="mt-8">
          <h3 className="font-label-sm text-on-surface uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">history</span>
            Log_Auditoría_Seguridad
          </h3>
          <div className="space-y-2">
            <div className="p-4 border border-outline-variant/20 bg-surface-container-lowest flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                <p className="font-mono-technical text-sm"><span className="text-primary">ADMIN_01</span> emitió PERMANENT_BAN a <span className="text-on-surface font-bold">LURKER_99</span></p>
              </div>
              <p className="font-mono-technical text-[10px] text-on-surface-variant">08:42:12_UTC</p>
            </div>
            <div className="p-4 border border-outline-variant/20 bg-surface-container-lowest flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="font-mono-technical text-sm"><span className="text-primary">SISTEMA</span> actualizó a <span className="text-on-surface font-bold">VOID_STRIDER</span> a VINYL_TIER</p>
              </div>
              <p className="font-mono-technical text-[10px] text-on-surface-variant">07:15:00_UTC</p>
            </div>
            <div className="p-4 border border-outline-variant/20 bg-surface-container-lowest flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <p className="font-mono-technical text-sm"><span className="text-primary">ADMIN_03</span> modificó el perfil de <span className="text-on-surface font-bold">NEON_GHOST</span></p>
              </div>
              <p className="font-mono-technical text-[10px] text-on-surface-variant">06:58:33_UTC</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
