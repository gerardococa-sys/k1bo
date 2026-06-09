import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Artifex7',
  description: 'Términos y condiciones de uso de la plataforma Artifex7.',
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
  borderTop: '0.5px solid rgba(212,150,58,0.30)',
  marginTop: '32px',
  marginBottom: '0',
}

const mailLink: React.CSSProperties = {
  color: '#C4581A',
  textDecoration: 'underline',
}

export default function TerminosPage() {
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
          Términos y Condiciones
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
          Al acceder y utilizar la plataforma Artifex7 (en adelante "la Plataforma"), usted acepta
          quedar vinculado por los presentes Términos y Condiciones. Si no está de acuerdo con
          alguno de estos términos, le solicitamos que no utilice la Plataforma.
        </p>

        <hr style={divider} />
        <h2 style={sectionTitle}>1. Descripción del servicio</h2>
        <p style={body}>
          Artifex7 es un directorio digital que conecta a propietarios de viviendas, oficinas y negocios
          con profesionales independientes y empresas del sector construcción, remodelación y servicios
          para el hogar en Centroamérica.
        </p>
        <p style={body}>
          La Plataforma facilita el contacto entre las partes, pero no es parte de ningún contrato de
          servicios entre usuarios. Artifex7 no garantiza la calidad, legalidad ni idoneidad de ningún
          profesional listado.
        </p>

        <hr style={divider} />
        <h2 style={sectionTitle}>2. Registro y cuentas</h2>
        <p style={body}>
          Para acceder a ciertas funciones debe crear una cuenta proporcionando información veraz,
          completa y actualizada. Usted es responsable de mantener la confidencialidad de sus
          credenciales y de toda la actividad que ocurra bajo su cuenta.
        </p>
        <ul style={{ ...body, paddingLeft: '20px', marginBottom: '12px' }}>
          {[
            'Debe tener al menos 18 años para registrarse.',
            'Cada persona puede tener una sola cuenta de cada tipo.',
            'Nos reservamos el derecho de suspender cuentas que infrinjan estos términos.',
          ].map(item => (
            <li key={item} style={{ marginBottom: '6px', listStyleType: 'none', paddingLeft: '16px', position: 'relative' }}>
              <span style={{ color: '#C4581A', position: 'absolute', left: 0 }}>•</span>
              {item}
            </li>
          ))}
        </ul>

        <hr style={divider} />
        <h2 style={sectionTitle}>3. Obligaciones de los profesionales</h2>
        <p style={body}>
          Los profesionales registrados en Artifex7 se comprometen a:
        </p>
        <ul style={{ ...body, paddingLeft: '20px' }}>
          {[
            'Proporcionar información veraz sobre su experiencia, certificaciones y servicios.',
            'Responder las solicitudes de cotización en un plazo razonable.',
            'Tratar a los propietarios con respeto y profesionalismo.',
            'Cumplir con la legislación laboral y fiscal aplicable en su país.',
          ].map(item => (
            <li key={item} style={{ marginBottom: '6px', listStyleType: 'none', paddingLeft: '16px', position: 'relative' }}>
              <span style={{ color: '#C4581A', position: 'absolute', left: 0 }}>•</span>
              {item}
            </li>
          ))}
        </ul>

        <hr style={divider} />
        <h2 style={sectionTitle}>4. Obligaciones de los propietarios</h2>
        <p style={body}>
          Los propietarios que utilicen la Plataforma se comprometen a:
        </p>
        <ul style={{ ...body, paddingLeft: '20px' }}>
          {[
            'Proporcionar información precisa en sus solicitudes de cotización.',
            'Contactar a los profesionales de buena fe y con intención real de contratar.',
            'No publicar reseñas falsas o malintencionadas.',
          ].map(item => (
            <li key={item} style={{ marginBottom: '6px', listStyleType: 'none', paddingLeft: '16px', position: 'relative' }}>
              <span style={{ color: '#C4581A', position: 'absolute', left: 0 }}>•</span>
              {item}
            </li>
          ))}
        </ul>

        <hr style={divider} />
        <h2 style={sectionTitle}>5. Limitación de responsabilidad</h2>
        <p style={body}>
          Artifex7 actúa únicamente como intermediario tecnológico. No somos responsables por:
        </p>
        <ul style={{ ...body, paddingLeft: '20px' }}>
          {[
            'La calidad o resultado de los trabajos realizados por los profesionales.',
            'Disputas contractuales entre propietarios y profesionales.',
            'Daños directos o indirectos derivados del uso de la Plataforma.',
            'Interrupciones del servicio por causas fuera de nuestro control.',
          ].map(item => (
            <li key={item} style={{ marginBottom: '6px', listStyleType: 'none', paddingLeft: '16px', position: 'relative' }}>
              <span style={{ color: '#C4581A', position: 'absolute', left: 0 }}>•</span>
              {item}
            </li>
          ))}
        </ul>

        <hr style={divider} />
        <h2 style={sectionTitle}>6. Pagos y pasarela de pagos</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <p style={body}>
            Todos los pagos realizados por los propietarios serán realizados a través de la plataforma
            que pondrá a disposición la pasarela de pago o a través de transferencia electrónica
            utilizando Transfer365 o transferencia directa entre cuentas.
          </p>

          <p style={body}>
            Todas las transferencias serán realizadas a la cuenta que ARTIFEX7 ponga a disposición.
          </p>

          <p style={body}>
            El profesional independiente o empresa reconoce que ARTIFEX7 cobra una comisión por cada
            servicio de mano de obra completado a través de la plataforma. El porcentaje y estructura
            de dicha comisión será comunicado dentro del perfil del profesional y podrá ser actualizado
            por ARTIFEX7 con previo aviso razonable.
          </p>

          <p style={body}>
            El profesional independiente o empresa recibirá el pago neto correspondiente (monto pagado
            por el Propietario menos la comisión de ARTIFEX7) conforme al ciclo operativo de
            liquidaciones o cuando el propietario ha aceptado el trabajo.
          </p>

          <p style={body}>
            Es responsabilidad del profesional independiente o empresa proporcionar información bancaria
            válida, completa y actualizada. ARTIFEX7 no será responsable por retrasos derivados de
            errores en los datos proporcionados por el profesional.
          </p>

          <div>
            <p style={body}>ARTIFEX7 podrá retener temporalmente pagos cuando:</p>
            <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Exista una disputa o reclamo activo sobre un servicio.',
                'Haya indicios de conducta inapropiada, fraude, incumplimiento operativo o violación de estos Términos.',
                'Sea necesario cubrir reembolsos al propietario bajo las políticas de cancelación o bajo la Política de Garantía ARTIFEX7.',
              ].map(item => (
                <li key={item} style={{ fontFamily: FONT_SANS, fontSize: '16px', color: '#2C2C2C', lineHeight: 1.75, listStyleType: 'none', paddingLeft: '16px', position: 'relative' }}>
                  <span style={{ color: '#C4581A', position: 'absolute', left: 0 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p style={body}>
            Los pagos realizados al profesional podrán estar sujetos a retenciones o descuentos de ley
            aplicables en la República de El Salvador, de acuerdo con su condición fiscal y la normativa
            vigente. Dichas retenciones serán aplicadas automáticamente cuando corresponda.
          </p>

          <p style={body}>
            El profesional es responsable del cumplimiento de sus propias obligaciones fiscales,
            incluyendo inscripción tributaria, declaraciones y pago de impuestos derivados de sus
            ingresos obtenidos como trabajador independiente.
          </p>

        </div>

        <hr style={divider} />
        <h2 style={sectionTitle}>9. Propiedad intelectual</h2>
        <p style={body}>
          Todo el contenido de Artifex7 — incluyendo logotipos, textos, imágenes y código —
          es propiedad de Artifex7 o sus licenciantes. Queda prohibida su reproducción total o
          parcial sin autorización previa por escrito.
        </p>

        <hr style={divider} />
        <h2 style={sectionTitle}>11. Modificaciones</h2>
        <p style={body}>
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios
          serán notificados a través de la Plataforma o por correo electrónico. El uso continuado
          de la Plataforma después de la notificación constituye aceptación de los nuevos términos.
        </p>

        <hr style={divider} />
        <h2 style={sectionTitle}>8. Contacto</h2>
        <p style={body}>
          Para cualquier consulta sobre estos Términos y Condiciones, escríbenos a{' '}
          <a href="mailto:legal@artifex7.com" style={mailLink}>legal@artifex7.com</a>.
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
