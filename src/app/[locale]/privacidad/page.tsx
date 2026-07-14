import React from 'react';

export default function PrivacidadPage() {
  return (
    <main className="pt-[120px] pb-24 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto min-h-screen">
      <div className="border-l-4 border-primary-container pl-6 mb-12">
        <h1 className="text-headline-xl font-headline-xl uppercase text-on-surface">Política de Privacidad</h1>
      </div>
      
      <div className="prose prose-invert prose-p:text-on-surface-variant prose-headings:text-on-surface max-w-none space-y-6">
        <p className="font-label-technical text-primary uppercase tracking-widest text-xs mb-8">Última actualización: Julio 2026</p>

        <h3 className="font-headline-sm uppercase text-xl font-bold mt-8 mb-4">1. Recopilación de Información (El Comunicador)</h3>
        <p>En <strong>EL METAL ES VIDA</strong> respetamos profundamente tu privacidad. Solo recopilamos tu dirección de correo electrónico cuando la proporcionas voluntariamente para desbloquear "Archivos Sonoros Desclasificados" o suscribirte a nuestra Legión.</p>

        <h3 className="font-headline-sm uppercase text-xl font-bold mt-8 mb-4">2. Uso de la Información</h3>
        <p>La información recopilada se utilizará exclusivamente para:</p>
        <ul className="list-disc pl-6 space-y-2 text-on-surface-variant">
          <li>Enviarte el acceso a los registros sonoros prometidos.</li>
          <li>Notificarte sobre nuevos expedientes técnicos, actualizaciones del taller o noticias relevantes del archivo.</li>
          <li>Administrar tu pertenencia al Club/Legión.</li>
        </ul>
        <p className="mt-4 border-l-2 border-primary pl-4 text-on-surface"><strong>Jamás venderemos, alquilaremos ni compartiremos tu base de datos de correos electrónicos con terceros</strong> corporativos, agencias de marketing o spammers. Tu información permanece estrictamente encriptada y resguardada en nuestros sistemas.</p>

        <h3 className="font-headline-sm uppercase text-xl font-bold mt-8 mb-4">3. Cookies y Rastreo Analítico</h3>
        <p>El Sitio utiliza tecnologías de rastreo estándar (como Cookies) para entender cómo interactúas con nuestro archivo, medir el tráfico de la web (Analytics) y rastrear el origen de las compras mediante enlaces de afiliados. Puedes configurar tu navegador para bloquear estas cookies en cualquier momento, aunque podría afectar algunas funciones dinámicas del sitio (como guardar el estado de "CD seleccionado").</p>

        <h3 className="font-headline-sm uppercase text-xl font-bold mt-8 mb-4">4. Contenido Incrustado de Terceros</h3>
        <p>Los artículos en este sitio pueden incluir contenido incrustado (por ejemplo, videos de YouTube, reproductores de Spotify, publicaciones en redes sociales). El contenido incrustado de otras webs se comporta exactamente de la misma manera que si el visitante hubiera visitado la otra web, la cual puede recopilar datos sobre ti y usar cookies de terceros. No tenemos control sobre sus políticas de privacidad.</p>
      </div>
    </main>
  );
}
