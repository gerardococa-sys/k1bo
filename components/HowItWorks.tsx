const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

export function HowItWorks() {
  return (
    <section id="como-funciona" style={{ backgroundColor: '#F9F9F9' }} className="py-16">
      <div className="container mx-auto px-4">
        <h2
          style={{
            fontFamily: FONT_SERIF,
            fontSize: '38px',
            fontWeight: 700,
            color: '#1C1410',
            textAlign: 'center',
            marginBottom: '8px',
          }}
        >
          ¿Cómo funciona Artifex7?
        </h2>
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: '18px',
            color: '#6B7B6E',
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
                  color: '#F5F0E8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  fontFamily: FONT_SANS,
                  fontSize: '22px',
                  fontWeight: 700,
                }}
              >
                {s.n}
              </div>

              {/* Step title */}
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1C1410',
                  marginBottom: '6px',
                }}
              >
                {s.title}
              </p>

              {/* Step description */}
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: '15px',
                  color: '#6B7B6E',
                  lineHeight: 1.65,
                  margin: 0,
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
