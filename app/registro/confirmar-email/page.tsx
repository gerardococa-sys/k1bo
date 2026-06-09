import Link from 'next/link'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

export default function ConfirmarEmailPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F2F0ED',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '48px 40px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        border: '0.5px solid #2C2C2C12',
      }}>
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>📧</div>

        <h1 style={{
          fontFamily: FONT_SERIF,
          fontSize: '26px',
          fontWeight: 700,
          color: '#1E1E1E',
          marginBottom: '12px',
        }}>
          Revisa tu correo
        </h1>

        <p style={{
          fontFamily: FONT_SANS,
          fontSize: '16px',
          color: '#7A7A78',
          lineHeight: 1.7,
          marginBottom: '28px',
        }}>
          Te enviamos un enlace de confirmación. Haz clic en él para activar
          tu cuenta en Artifex7.
        </p>

        <div style={{
          background: '#F2F0ED',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '28px',
          textAlign: 'left',
        }}>
          <p style={{
            fontFamily: FONT_SANS,
            fontSize: '13px',
            fontWeight: 700,
            color: '#7A7A78',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 10px',
          }}>
            ¿No recibiste el email?
          </p>
          <ul style={{
            fontFamily: FONT_SANS,
            fontSize: '14px',
            color: '#7A7A78',
            lineHeight: 1.7,
            paddingLeft: '18px',
            margin: 0,
          }}>
            <li>Revisa tu carpeta de spam</li>
            <li>Verifica que el email sea correcto</li>
            <li>El enlace expira en 24 horas</li>
          </ul>
        </div>

        <Link
          href="/login"
          style={{
            display: 'inline-block',
            background: '#1E1E1E',
            color: '#D4963A',
            fontFamily: FONT_SANS,
            fontSize: '15px',
            fontWeight: 700,
            padding: '13px 28px',
            borderRadius: '8px',
            textDecoration: 'none',
          }}
        >
          Ir a iniciar sesión
        </Link>
      </div>
    </div>
  )
}
