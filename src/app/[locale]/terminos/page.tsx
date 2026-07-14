import React from 'react';

export default function TerminosPage() {
  return (
    <main className="pt-[120px] pb-24 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto min-h-screen">
      <div className="border-l-4 border-primary-container pl-6 mb-12">
        <h1 className="text-headline-xl font-headline-xl uppercase text-on-surface">Términos y Condiciones de Uso</h1>
      </div>
      
      <div className="prose prose-invert prose-p:text-on-surface-variant prose-headings:text-on-surface max-w-none space-y-6">
        <p className="font-label-technical text-primary uppercase tracking-widest text-xs mb-8">Última actualización: Julio 2026</p>

        <h3 className="font-headline-sm uppercase text-xl font-bold mt-8 mb-4">1. Naturaleza del Sitio y Exención de Responsabilidad de Contenidos</h3>
        <p><strong>EL METAL ES VIDA</strong> ("el Sitio") es un archivo técnico, educativo e informativo dedicado a la reseña, análisis y divulgación de cultura musical, equipamiento de audio y software. </p>
        <p className="border-l-2 border-primary pl-4 text-on-surface">El Sitio <strong>no aloja, no distribuye, ni almacena</strong> en sus servidores ningún tipo de software de terceros, plugins comerciales (VST, AU, AAX), archivos de instalación, ni obras musicales protegidas por derechos de autor de terceros con fines de piratería. Todos los enlaces proporcionados en nuestros artículos y en la sección del "Taller" redirigen exclusivamente a los sitios web oficiales de los desarrolladores o a distribuidores autorizados.</p>

        <h3 className="font-headline-sm uppercase text-xl font-bold mt-8 mb-4">2. Uso Justo (Fair Use) y Derechos de Autor</h3>
        <p>Las imágenes de portadas de álbumes, capturas de pantalla de software, logotipos de marcas y pequeños fragmentos sonoros o de video utilizados en este sitio se emplean estrictamente bajo la doctrina de <strong>Uso Justo (Fair Use)</strong> con fines de reseña crítica, comentario, educación y reportaje. Todos los derechos de propiedad intelectual de estos elementos pertenecen a sus respectivos creadores, bandas, sellos discográficos o empresas de software. </p>
        <p>Si eres el titular de los derechos de algún material mostrado y deseas solicitar su retiro bajo la ley DMCA, comunícate con nosotros a contacto@elmetalesvida.com.</p>

        <h3 className="font-headline-sm uppercase text-xl font-bold mt-8 mb-4">3. Divulgación de Enlaces de Afiliados</h3>
        <p>El Sitio participa en programas de marketing de afiliados (incluyendo, entre otros, el Programa de Afiliados de Amazon). Esto significa que al hacer clic en ciertos enlaces de equipamiento o productos y realizar una compra, <strong>EL METAL ES VIDA</strong> puede recibir una pequeña comisión. Esto no representa ningún costo adicional para el usuario y nos permite mantener la plataforma en funcionamiento. Siempre brindamos reseñas honestas e independientes sin que las comisiones influyan en nuestro criterio técnico.</p>

        <h3 className="font-headline-sm uppercase text-xl font-bold mt-8 mb-4">4. Limitación de Responsabilidad Técnica</h3>
        <p>Las configuraciones, presets y consejos de audio compartidos en el Sitio tienen fines informativos. No nos hacemos responsables de ningún daño en hardware, altavoces, audífonos o pérdida de datos derivados del uso de software de terceros o configuraciones extremas de audio sugeridas en nuestra plataforma. El usuario asume total responsabilidad al descargar, instalar y utilizar programas de terceros.</p>
      </div>
    </main>
  );
}
