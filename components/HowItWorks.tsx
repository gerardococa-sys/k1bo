import { Logo } from '@/components/ui/Logo'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      style={{
        position: 'relative',
        backgroundColor: '#1C1410',
        backgroundImage: 'url(/images/concrete-texture.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
      }}
      className="py-16"
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(28,20,16,0.92)',
          zIndex: 1,
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }} className="container mx-auto px-4">
        <h2
          style={{
            fontFamily: FONT_SERIF,
            fontSize: '46px',
            fontWeight: 700,
            color: '#F5F0E8',
            textAlign: 'center',
            marginBottom: '8px',
          }}
        >
          ¿Cómo funciona <Logo size="inherit" variant="light" />?
        </h2>
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: '20px',
            color: '#D4A96A',
            textAlign: 'center',
            marginBottom: '48px',
          }}
        >
          Simple y rápido
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { n: 1, title: 'Busca',      desc: 'Elige la categoría del servicio que necesitas' },
            { n: 2, title: 'Selecciona', desc: 'Elige el tipo de trabajo específico' },
            { n: 3, title: 'Compara',    desc: 'Revisa perfiles, fotos y reseñas' },
            { n: 4, title: 'Cotiza',     desc: 'Solicita cotización (registro gratuito)' },
            { n: 5, title: 'Decide',     desc: 'Acepta o rechaza la propuesta' },
          ].map((s) => (
            <div key={s.n} style={{ textAlign: 'center' }}>
              {/* Step number circle */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: '#B85C1A',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  fontFamily: FONT_SANS,
                  fontSize: '20px',
                  fontWeight: 700,
                }}
              >
                {s.n}
              </div>

              {/* Step title */}
              <p
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#F5F0E8',
                  marginTop: '16px',
                  marginBottom: 0,
                }}
              >
                {s.title}
              </p>

              {/* Step description */}
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: '16px',
                  fontWeight: 400,
                  color: 'rgba(245,240,232,0.60)',
                  lineHeight: 1.65,
                  marginTop: '8px',
                  marginBottom: 0,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
