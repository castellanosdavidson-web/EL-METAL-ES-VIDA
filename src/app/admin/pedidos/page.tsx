"use client";
import React, { useState, useEffect } from 'react';

export default function PedidosPage() {
  const dummyOrders = [
    {
      id: "MC-8921-X",
      customer: "Elias Thorne",
      email: "ethorne@central.node",
      initials: "ED",
      date: "2023.10.24 / 14:02",
      total: "$1,299.00",
      status: "ENVIADO",
      statusColor: "text-primary bg-primary/10"
    },
    {
      id: "MC-7734-L",
      customer: "Aria Vance",
      email: "vance.aria@void.net",
      initials: "AV",
      date: "2023.10.24 / 13:45",
      total: "$842.20",
      status: "PENDIENTE",
      statusColor: "text-secondary bg-secondary/10"
    },
    {
      id: "MC-0192-M",
      customer: "Julian Kross",
      email: "kross_j@sector7.mil",
      initials: "JK",
      date: "2023.10.23 / 22:10",
      total: "$3,105.50",
      status: "CANCELADO",
      statusColor: "text-on-surface-variant/50 bg-outline/5"
    },
    {
      id: "MC-9901-B",
      customer: "Sarah Miller",
      email: "smiller@core.sys",
      initials: "SM",
      date: "2023.10.23 / 18:55",
      total: "$499.99",
      status: "ENVIADO",
      statusColor: "text-primary bg-primary/10"
    },
    {
      id: "MC-6612-Q",
      customer: "David Wu",
      email: "wu.david@tech.hq",
      initials: "DW",
      date: "2023.10.23 / 15:30",
      total: "$210.00",
      status: "PENDIENTE",
      statusColor: "text-secondary bg-secondary/10"
    }
  ];

  const [logs, setLogs] = useState([
    { time: "14:55:02", msg: "El sistema marcó el pedido #MC-8921-X como [ENVIADO] por admin_01" },
    { time: "14:52:18", msg: "Pago verificado para el pedido #MC-7734-L (Total: $842.20)" },
    { time: "14:48:45", msg: "Reposición de stock detectada para Item_Code: VOID_CORE_V2" },
    { time: "14:45:11", msg: "La usuaria Sarah Miller actualizó su dirección de envío para #MC-9901-B" }
  ]);

  useEffect(() => {
    const newLogsMsgs = [
      "Sincronizando clúster de base de datos... [OK]",
      "Pedido #MC-2201 entrante desde SECTOR_9",
      "Protocolos de encriptación verificados para TRANS_ID: 99x8",
      "Conexión de pasarela iniciada para ventas_globales",
      "Procesando solicitud de reembolso para #MC-0012-R"
    ];

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const randomMsg = newLogsMsgs[Math.floor(Math.random() * newLogsMsgs.length)];
      
      setLogs(prev => {
        const newLogArray = [{ time: timeStr, msg: randomMsg }, ...prev];
        if (newLogArray.length > 6) return newLogArray.slice(0, 6);
        return newLogArray;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-8 flex-1 flex flex-col h-full">
      <div className="space-y-8 max-w-7xl mx-auto w-full">
        {/* Order Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter border-b border-outline-variant/10 pb-4">
          <div>
            <h2 className="font-display-lg text-display-lg uppercase tracking-tight text-on-surface">Nexus_Pedidos</h2>
            <p className="font-mono-technical text-mono-technical text-on-surface-variant opacity-60 uppercase">Archivo de transacciones activas / Despacho de sector global</p>
          </div>
          <div className="flex gap-4">
            <button className="border border-outline-variant/20 px-4 py-2 flex items-center gap-2 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
              <span className="font-label-sm text-label-sm uppercase">Filtros</span>
            </button>
            <button className="bg-primary-container text-on-surface px-6 py-2 font-label-sm text-label-sm uppercase tracking-widest font-bold hover:bg-inverse-primary transition-all active:scale-95 border border-primary-container">
              Exportar_Reporte
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
          <div className="border border-outline-variant/20 bg-surface-container-lowest p-6 flex flex-col justify-between h-24">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Ingresos_Totales</span>
            <span className="font-headline-lg text-headline-lg text-on-surface">$12,492.00</span>
          </div>
          <div className="border border-outline-variant/20 bg-surface-container-lowest p-6 flex flex-col justify-between h-24">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Envíos_Pendientes</span>
            <span className="font-headline-lg text-headline-lg text-primary">14</span>
          </div>
          <div className="border border-outline-variant/20 bg-surface-container-lowest p-6 flex flex-col justify-between h-24">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Tasa_Crecimiento</span>
            <span className="font-headline-lg text-headline-lg text-on-surface">+22.4%</span>
          </div>
          <div className="border border-outline-variant/20 bg-surface-container-lowest p-6 flex flex-col justify-between h-24">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Salud_Sistema</span>
            <span className="font-headline-lg text-headline-lg text-on-surface uppercase">Óptima</span>
          </div>
        </div>

        {/* Orders Table Container */}
        <div className="border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container">
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase text-on-surface-variant tracking-widest">ID_Pedido</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase text-on-surface-variant tracking-widest">Cliente</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase text-on-surface-variant tracking-widest">Fecha</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase text-on-surface-variant tracking-widest">Total</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase text-on-surface-variant tracking-widest">Estado</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase text-on-surface-variant tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {dummyOrders.map(order => (
                  <tr key={order.id} className="hover:bg-surface-variant/20 transition-colors group">
                    <td className="px-6 py-5 font-mono-technical text-mono-technical text-primary font-bold">#{order.id}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 border border-outline-variant/20 bg-surface flex items-center justify-center font-bold text-on-surface-variant">{order.initials}</div>
                        <div>
                          <div className="font-body-md text-on-surface font-semibold">{order.customer}</div>
                          <div className="text-[11px] text-on-surface-variant uppercase">{order.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-mono-technical text-mono-technical text-on-surface-variant">{order.date}</td>
                    <td className="px-6 py-5 font-mono-technical text-mono-technical text-on-surface font-bold">{order.total}</td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-1 border border-outline-variant/20 text-[10px] font-bold uppercase tracking-widest ${order.statusColor}`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="border border-outline-variant/20 p-2 hover:bg-surface-variant hover:text-on-surface text-on-surface-variant transition-colors active:scale-90" title="Ver Detalles">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button className="border border-outline-variant/20 p-2 hover:bg-primary hover:text-white text-on-surface-variant transition-colors active:scale-90" title="Marcar Enviado">
                          <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer / Pagination */}
          <div className="px-6 py-4 border-t border-outline-variant/20 flex justify-between items-center bg-surface-container">
            <span className="font-mono-technical text-mono-technical text-on-surface-variant uppercase">Mostrando_Registros [01-05] de 124</span>
            <div className="flex gap-2">
              <button className="border border-outline-variant/20 w-10 h-10 flex items-center justify-center hover:bg-surface-variant transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="border border-outline-variant/20 w-10 h-10 flex items-center justify-center bg-primary-container text-on-surface">
                <span className="font-mono-technical">01</span>
              </button>
              <button className="border border-outline-variant/20 w-10 h-10 flex items-center justify-center hover:bg-surface-variant transition-colors">
                <span className="font-mono-technical">02</span>
              </button>
              <button className="border border-outline-variant/20 w-10 h-10 flex items-center justify-center hover:bg-surface-variant transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Technical Logs & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-8">
          <div className="md:col-span-2 border border-outline-variant/20 bg-surface-container-lowest p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface">Registro_Actividad_Pedidos</h3>
              <span className="text-[10px] text-primary uppercase font-bold px-2 py-0.5 bg-primary/10">Actualización_En_Vivo</span>
            </div>
            <div className="space-y-3 font-mono-technical text-[11px] uppercase text-on-surface-variant">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                  <span className="text-primary/50 shrink-0">{log.time}</span>
                  <span>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border border-outline-variant/20 bg-primary-container p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface mb-2">Acción_Urgente_Requerida</h3>
              <p className="text-on-surface/80 font-body-md leading-tight">3 pedidos de alta prioridad exceden la latencia de 48h. Se recomienda intervención manual.</p>
            </div>
            <button className="mt-4 w-full bg-white text-on-primary font-label-sm text-label-sm uppercase tracking-widest font-bold py-3 hover:bg-on-surface-variant transition-colors active:scale-95">
              Inicializar_Protocolo_Alfa
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
