import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Cancelaciones — Artifex7',
  description: 'Política de cancelaciones y reembolsos de Artifex7.',
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

export default function CancelacionesPage() {
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
          Política de Cancelaciones
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
          Esta política describe cómo funcionan las cancelaciones de solicitudes de cotización
          y suscripciones dentro de la plataforma Artifex7.
        </p>

        <hr style={divider} />
        <h2 style={sectionTitle}>1. Cancelación de solicitudes de cotización</h2>
        <p style={body}>
          Los propietarios pueden cancelar una solicitud de cotización en cualquier momento
          antes de que el profesional haya respondido. Una vez que el profesional ha enviado
          su cotización, la solicitud no puede cancelarse automáticamente — deberá
          comunicarse directamente con el profesional para acordar la cancelación.
        </p>
        <p style={body}>
          Para cancelar una solicitud activa, ingrese a su panel de propietario, ubique
          la solicitud correspondiente y seleccione "Cancelar solicitud".
        </p>

        <hr style={divider} />
        <h2 style={sectionTitle}>2. Cancelación de cuenta de profesional</h2>
        <p style={body}>
          Un profesional puede cancelar su cuenta en cualquier momento desde la sección
          "Mi Perfil" en el panel profesional. Al cancelar:
        </p>
        <BulletList items={[
          'Su perfil dejará de aparecer en el directorio inmediatamente.',
          'Las solicitudes de cotización pendientes serán archivadas.',
          'Sus datos serán eliminados conforme a nuestra Política de Privacidad en un plazo de 30 días.',
        ]} />

        <hr style={divider} />
        <h2 style={sectionTitle}>3. Cancelación de cuenta de propietario</h2>
        <p style={body}>
          Los propietarios pueden eliminar su cuenta en cualquier momento. Al hacerlo:
        </p>
        <BulletList items={[
          'Se eliminarán todas sus solicitudes de cotización activas.',
          'Las reseñas publicadas por usted podrán mantenerse en la plataforma de forma anónima.',
          'Sus datos personales serán eliminados en 30 días conforme a nuestra Política de Privacidad.',
        ]} />

        <hr style={divider} />
        <h2 style={sectionTitle}>4. Planes y suscripciones (cuando aplique)</h2>
        <p style={body}>
          Actualmente, el uso básico de Artifex7 es gratuito. En caso de que en el futuro
          se ofrezcan planes de pago para profesionales, la política de cancelación específica
          será comunicada al momento de la contratación e incluirá:
        </p>
        <BulletList items={[
          'Período de prueba gratuito cuando aplique.',
          'Posibilidad de cancelar antes de que finalice el período de facturación para evitar el próximo cargo.',
          'Sin reembolsos por períodos ya facturados, salvo error de cobro comprobable.',
        ]} />

        <hr style={divider} />
        <h2 style={sectionTitle}>5. Disputas entre usuarios</h2>
        <p style={body}>
          Artifex7 no es parte de los contratos de servicios celebrados entre propietarios
          y profesionales. Las disputas relacionadas con trabajos realizados, pagos acordados
          entre las partes o incumplimientos contractuales deben resolverse directamente entre
          los usuarios involucrados.
        </p>
        <p style={body}>
          Si necesita reportar un comportamiento inadecuado de un usuario, puede escribirnos
          a <a href="mailto:soporte@artifex7.com" style={mailLink}>soporte@artifex7.com</a> y
          evaluaremos el caso de acuerdo con nuestros Términos y Condiciones.
        </p>

        <hr style={divider} />
        <h2 style={sectionTitle}>6. Contacto</h2>
        <p style={body}>
          Para consultas sobre cancelaciones o reembolsos, contáctenos en{' '}
          <a href="mailto:soporte@artifex7.com" style={mailLink}>soporte@artifex7.com</a>.
          Respondemos en un plazo máximo de 3 días hábiles.
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
