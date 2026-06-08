import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad — Artifex7',
  description: 'Política de privacidad y tratamiento de datos personales de Artifex7.',
}

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const sectionTitle: React.CSSProperties = {
  fontFamily: FONT_SERIF,
  fontSize: '20px',
  fontWeight: 600,
  color: '#2C2C2C',
  marginTop: '32px',
  marginBottom: '12px',
}

const body: React.CSSProperties = {
  fontFamily: FONT_SANS,
  fontSize: '16px',
  color: '#2C2C2C',
  lineHeight: 1.75,
  marginBottom: '12px',
}

const divider: React.CSSProperties = {
  borderTop: '0.5px solid rgba(212,169,106,0.30)',
  marginTop: '32px',
}

const mailLink: React.CSSProperties = {
  color: '#C4581A',
  textDecoration: 'underline',
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ ...body, paddingLeft: '20px' }}>
      {items.map(item => (
        <li key={item} style={{ marginBottom: '6px', listStyleType: 'none', paddingLeft: '16px', position: 'relative' }}>
          <span style={{ color: '#C4581A', position: 'absolute', left: 0 }}>•</span>
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function PrivacidadPage() {
  return (
    <div style={{ backgroundColor: '#F2F0ED', minHeight: '100vh' }}>

      {/* Header */}
      <section style={{ backgroundColor: '#1E1E1E', padding: '48px 24px', textAlign: 'center' }}>
        <p style={{
          fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4963A',
          marginBottom: '12px',
        }}>
          Legal
        </p>
        <h1 style={{
          fontFamily: FONT_SERIF, fontSize: '42px', fontWeight: 700,
          color: '#F2F0ED', marginBottom: '12px',
        }}>
          Política de Privacidad
        </h1>
        <p style={{
          fontFamily: FONT_SANS, fontSize: '14px',
          color: 'rgba(245,240,232,0.50)',
        }}>
          Última actualización: junio 2026
        </p>
      </section>

      {/* Content */}
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 24px' }}>

        <p style={body}>
          En Artifex7 nos comprometemos a proteger su privacidad. Esta Política describe qué
          información recopilamos, cómo la usamos y cuáles son sus derechos al respecto.
        </p>

        <hr style={divider} />
        <h2 style={sectionTitle}>1. Información que recopilamos</h2>
        <p style={body}>Recopilamos la siguiente información cuando usted usa nuestra Plataforma:</p>
        <BulletList items={[
          'Nombre completo, correo electrónico y número de teléfono al registrarse.',
          'Información de perfil: fotografía, descripción, categorías de servicio (profesionales).',
          'Contenido de solicitudes de cotización: descripción del proyecto, fotos adjuntas.',
          'Reseñas y calificaciones enviadas.',
          'Datos de uso: páginas visitadas, búsquedas realizadas, dispositivo y navegador.',
          'Dirección IP y datos de geolocalización aproximada.',
        ]} />

        <hr style={divider} />
        <h2 style={sectionTitle}>2. Cómo usamos su información</h2>
        <p style={body}>Utilizamos sus datos para:</p>
        <BulletList items={[
          'Crear y administrar su cuenta.',
          'Facilitar la comunicación entre propietarios y profesionales.',
          'Enviar notificaciones relacionadas con su actividad en la Plataforma.',
          'Mejorar la experiencia de usuario y la calidad del servicio.',
          'Cumplir con obligaciones legales aplicables.',
          'Detectar y prevenir fraude o uso indebido de la Plataforma.',
        ]} />

        <hr style={divider} />
        <h2 style={sectionTitle}>3. Compartición de información</h2>
        <p style={body}>
          No vendemos su información personal a terceros. Podemos compartir datos en los siguientes casos:
        </p>
        <BulletList items={[
          'Con otros usuarios de la Plataforma, en la medida necesaria para facilitar el contacto (por ejemplo, su nombre y teléfono cuando envía una solicitud de cotización).',
          'Con proveedores de servicios tecnológicos que nos ayudan a operar la Plataforma (almacenamiento en la nube, correo electrónico transaccional).',
          'Con autoridades competentes cuando la ley lo exija.',
        ]} />

        <hr style={divider} />
        <h2 style={sectionTitle}>4. Retención de datos</h2>
        <p style={body}>
          Conservamos su información mientras su cuenta esté activa. Si elimina su cuenta,
          borraremos sus datos personales en un plazo de 30 días, salvo que la ley nos obligue
          a conservarlos por un período mayor.
        </p>

        <hr style={divider} />
        <h2 style={sectionTitle}>5. Sus derechos</h2>
        <p style={body}>Usted tiene derecho a:</p>
        <BulletList items={[
          'Acceder a la información que tenemos sobre usted.',
          'Corregir datos inexactos o incompletos.',
          'Solicitar la eliminación de su cuenta y datos personales.',
          'Oponerse al procesamiento de sus datos para fines de marketing.',
          'Exportar sus datos en formato legible.',
        ]} />
        <p style={body}>
          Para ejercer cualquiera de estos derechos, escríbanos a{' '}
          <a href="mailto:privacidad@artifex7.com" style={mailLink}>privacidad@artifex7.com</a>.
        </p>

        <hr style={divider} />
        <h2 style={sectionTitle}>6. Cookies</h2>
        <p style={body}>
          Utilizamos cookies y tecnologías similares para mantener su sesión activa, recordar
          sus preferencias y analizar el uso de la Plataforma. Puede configurar su navegador
          para rechazar cookies, aunque esto podría afectar el funcionamiento de algunas funciones.
        </p>

        <hr style={divider} />
        <h2 style={sectionTitle}>7. Seguridad</h2>
        <p style={body}>
          Implementamos medidas de seguridad técnicas y organizativas para proteger su información
          contra acceso no autorizado, pérdida o alteración. Sin embargo, ningún sistema es
          completamente seguro y no podemos garantizar la seguridad absoluta de sus datos.
        </p>

        <hr style={divider} />
        <h2 style={sectionTitle}>8. Contacto</h2>
        <p style={body}>
          Si tiene preguntas sobre esta Política de Privacidad, contáctenos en{' '}
          <a href="mailto:privacidad@artifex7.com" style={mailLink}>privacidad@artifex7.com</a>.
        </p>

        <div style={{ marginTop: '48px' }}>
          <Link
            href="/sv"
            style={{
              display: 'inline-block',
              backgroundColor: '#1E1E1E',
              color: '#D4963A',
              fontFamily: FONT_SANS,
              fontSize: '15px',
              fontWeight: 700,
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
