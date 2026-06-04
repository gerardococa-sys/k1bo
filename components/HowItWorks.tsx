export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-[#F9F9F9] py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-2">¿Cómo funciona Artifex7?</h2>
        <p className="text-center text-muted-foreground mb-12">Simple y rápido</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { n: 1, title: 'Busca',      desc: 'Elige la categoría del servicio que necesitas' },
            { n: 2, title: 'Selecciona', desc: 'Elige el tipo de trabajo específico' },
            { n: 3, title: 'Compara',    desc: 'Revisa perfiles, fotos y reseñas' },
            { n: 4, title: 'Cotiza',     desc: 'Solicita cotización (registro gratuito)' },
            { n: 5, title: 'Decide',     desc: 'Acepta o rechaza la propuesta' },
          ].map((s) => (
            <div key={s.n} className="text-center">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-3">
                {s.n}
              </div>
              <p className="font-semibold mb-1">{s.title}</p>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
