"use client";
import React from 'react';

export default function ProductosPage() {
  const dummyProducts = [
    {
      id: "APP-DV-2024-01",
      name: "VANGUARD_DENIM_MK2",
      category: "Indumentaria",
      price: "$245.00",
      stock: 24,
      status: "ACTIVO",
      statusColor: "text-primary",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChvy83ptK0tbZ-wrvDTyJvZdcm6j-h-fhfO2GLsaFNCLqnwpOiXp5vr75bP0p9g1P7OMc5jbX_aCDn07EBrdMyIaUfEQ6NlZrdZLj39D4w4a2p2GHPCYCIb1gNLYXbglEejo2cFo3dwNuRTzCHE15TcfbVzTrUai0G9a-fuAyF18PulsieUmFCOrEqn8VLaKjT1R85XmMIQnLEdHEPDgbkFCN2jmnxxcve4d7jh4EqJZ2LlJmHMvZqJaNi_FWX0SR55Nq2zjaqpA"
    },
    {
      id: "COL-VIN-9902",
      name: "CORE_RITUAL_LP",
      category: "Coleccionables",
      price: "$42.99",
      stock: 4,
      status: "STOCK BAJO",
      statusColor: "text-error",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsA54KwJL0uWd-RJID-wC7qFtnv4Z5SYyIGkKsz5fx-UQCqNFB9EClYqT33yzIvWp_zqfL2gYOzMgcuBSrFgVPYiSaJeCLCL5G_qhtFCzcyyz9k_yO7IT6MJyPG6gb7ndKQqh90McHPFZKWkUmY0oSgcp9Jq8cryMheJv61uZtEmrK9LOcdh4BS3pVX3QDY3Dhm9zvnlCKZ4_pKjU5B_Qwwr9ukpZpZaYiLaYtRJkYKz_knzx9C15T93g49zVlNZ3LAoKxcujo7g"
    },
    {
      id: "APP-PTCH-004",
      name: "SIGIL_PATCH_BUNDLE",
      category: "Indumentaria",
      price: "$15.00",
      stock: 156,
      status: "ACTIVO",
      statusColor: "text-primary",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSL7bfh6J2YrCl0TKCZBOGBHuf9qg2O9SfE-wXULSkjOzI8VR3f9J7KaWuaJ-2iYeVWU9vQTlyQC5EmiY1iXNI0j8b14KGyv15xwjzYaD5L3Jxq8VdVxgDBt_kIeA2NT30OaO0EMyt8XX_Hg0YUZVVnOrvBJwUTAZD0jPW53_VD6-s8alKWZhDLXfJyHIQrqHBhlf3N80sJTVccBAvzchDTCjhTBx-9h9DK6L12AT7MQawIxPt6B5uvIVFkOVH0bWjGXytXJ_tHw"
    },
    {
      id: "HRD-AMP-012",
      name: "SONIC_CRUSHER_X1",
      category: "Hardware",
      price: "$1,499.00",
      stock: 2,
      status: "PRE-ORDEN",
      statusColor: "text-primary",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhZCMK4xpinN9Wnw39xMS9jv6dJTUPlJ1kY8dbyBQDBDnI1WRGCn2jRxOyJY2OJWNncmCOMT3EgfJnSNQCjon9Jer9ALUjl1Z5sZHv8zc_iuIRVuepDebRI-rGsTX9Iu3EyRSyEERqRs7bitMlLd6iTEvvTpyH7UXOcx7gy63LuZS5-IlEYuFth9JQYqjBfbaLwgaRBPueq7cl1w7n1kd2v7fS7kRM3KSJSZ_gb35u6VLeDNM12GW8q29k0IIZ01QPxISikhiMjg"
    }
  ];

  return (
    <main className="p-8 flex-1 flex flex-col h-full">
      <div className="space-y-8 max-w-7xl mx-auto w-full">
        {/* Context Bar */}
        <div className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg uppercase tracking-tighter text-on-surface">Archivo_Inventario</h2>
            <p className="font-mono-technical text-mono-technical text-on-surface-variant opacity-60">CATÁLOGO_SYNC: ACTIVO // UNIDADES_TOTALES: 1,284</p>
          </div>
          <button className="bg-primary-container px-8 py-4 font-label-sm text-label-sm uppercase tracking-widest text-white flex items-center gap-3 hover:bg-inverse-primary transition-colors active:translate-y-[1px]">
            <span className="material-symbols-outlined text-lg">add_box</span>
            Añadir Producto
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-masonry-gap">
          <div className="border border-outline-variant/20 p-4 bg-surface-container-low">
            <p className="font-label-sm text-[10px] text-on-surface-variant uppercase mb-1">Alerta_Stock_Bajo</p>
            <p className="font-headline-md text-headline-md text-primary">12 Ítems</p>
          </div>
          <div className="border border-outline-variant/20 p-4 bg-surface-container-low">
            <p className="font-label-sm text-[10px] text-on-surface-variant uppercase mb-1">SKUs_Activos</p>
            <p className="font-headline-md text-headline-md text-on-surface">342</p>
          </div>
          <div className="border border-outline-variant/20 p-4 bg-surface-container-low border-l-4 border-l-primary-container">
            <p className="font-label-sm text-[10px] text-on-surface-variant uppercase mb-1">Ingresos_24H</p>
            <p className="font-headline-md text-headline-md text-on-surface">$14,290.42</p>
          </div>
          <div className="border border-outline-variant/20 p-4 bg-surface-container-low">
            <p className="font-label-sm text-[10px] text-on-surface-variant uppercase mb-1">Archivados</p>
            <p className="font-headline-md text-headline-md text-on-surface-variant">18</p>
          </div>
        </div>

        {/* Product Data Table */}
        <div className="border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant/30">
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase text-on-surface-variant">Nombre Producto</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase text-on-surface-variant">Categoría</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase text-on-surface-variant">Precio</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase text-on-surface-variant">Stock</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase text-on-surface-variant">Estado</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase text-on-surface-variant text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="font-mono-technical text-mono-technical">
                {dummyProducts.map((product) => (
                  <tr key={product.id} className="border-b border-outline-variant/10 hover:bg-surface-variant/20 transition-colors group">
                    <td className="px-6 py-5 flex items-center gap-4">
                      <div className="w-12 h-12 border border-outline-variant/20 shrink-0 overflow-hidden bg-surface-container">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <div>
                        <p className="text-on-surface font-bold">{product.name}</p>
                        <p className="text-[10px] text-on-surface-variant opacity-50">SKU: {product.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 border border-outline-variant/20 text-[10px] uppercase text-on-surface-variant bg-surface-variant/30">{product.category}</span>
                    </td>
                    <td className="px-6 py-5 text-on-surface">{product.price}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${product.stock < 10 ? 'bg-error animate-pulse' : 'bg-primary'}`}></span>
                        <span className={product.stock < 10 ? 'text-error font-bold' : ''}>{product.stock} UNIDADES</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`${product.statusColor} font-bold`}>{product.status}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-3">
                        <button className="material-symbols-outlined text-on-surface-variant hover:text-primary p-2 border border-outline-variant/20 transition-colors">edit</button>
                        <button className="material-symbols-outlined text-on-surface-variant hover:text-primary p-2 border border-outline-variant/20 transition-colors">inventory</button>
                        <button className="material-symbols-outlined text-on-surface-variant hover:text-error p-2 border border-outline-variant/20 transition-colors">delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="px-6 py-4 flex justify-between items-center font-mono-technical text-mono-technical bg-surface-container border-t border-outline-variant/20">
            <p className="text-on-surface-variant text-[12px]">CARGA_SISTEMA: 0.02s // MOSTRANDO 1-4 DE 342 RESULTADOS</p>
            <div className="flex gap-2">
              <button className="p-2 border border-outline-variant/20 text-on-surface-variant hover:text-primary hover:bg-surface-variant/20 flex items-center"><span className="material-symbols-outlined">chevron_left</span></button>
              <button className="px-4 py-2 border border-primary-container bg-primary-container text-white">01</button>
              <button className="px-4 py-2 border border-outline-variant/20 text-on-surface-variant hover:text-primary hover:bg-surface-variant/20">02</button>
              <button className="px-4 py-2 border border-outline-variant/20 text-on-surface-variant hover:text-primary hover:bg-surface-variant/20">03</button>
              <button className="p-2 border border-outline-variant/20 text-on-surface-variant hover:text-primary hover:bg-surface-variant/20 flex items-center"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
