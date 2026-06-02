import Link from 'next/link'
import { Facebook, Instagram, MessageCircle } from 'lucide-react'

interface FooterProps {
  countryPrefix?: string
}

export function Footer({ countryPrefix }: FooterProps) {
  const base = countryPrefix ? `/${countryPrefix}` : ''

  return (
    <footer style={{ backgroundColor: '#1B3A6B' }} className="text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="text-2xl font-black uppercase mb-3">K1BO</p>
            <p className="text-white/70 text-sm leading-relaxed">
              Encuentra al profesional ideal para tu hogar, negocio u oficina
            </p>
          </div>

          {/* Empresa */}
          <div>
            <p className="font-semibold mb-4 text-white">Empresa</p>
            <div className="space-y-2 text-sm text-white/60">
              <Link href={base || '/'} className="block hover:text-white transition-colors">Nosotros</Link>
              <Link href={base || '/'} className="block hover:text-white transition-colors">Cómo funciona</Link>
              <Link href={base || '/'} className="block hover:text-white transition-colors">Contacto</Link>
            </div>
          </div>

          {/* Para profesionales */}
          <div>
            <p className="font-semibold mb-4 text-white">Para profesionales</p>
            <div className="space-y-2 text-sm text-white/60">
              <Link href="/registro/profesional" className="block hover:text-white transition-colors">
                Regístrate como profesional
              </Link>
              <Link href="/login" className="block hover:text-white transition-colors">
                Iniciar sesión
              </Link>
            </div>
          </div>

          {/* Países */}
          <div>
            <p className="font-semibold mb-4 text-white">Países</p>
            <div className="space-y-2 text-sm">
              <Link href="/sv" className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
                <span>🇸🇻</span> El Salvador
              </Link>
              <span className="flex items-center gap-2 text-white/40 text-xs">
                🇬🇹 Guatemala — Próximamente
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">© 2026 K1BO. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5">
            <a href="#" aria-label="Facebook" className="text-white/40 hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Instagram" className="text-white/40 hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="TikTok" className="text-white/40 hover:text-white transition-colors text-sm font-bold tracking-tight">
              TikTok
            </a>
            <a href="#" aria-label="WhatsApp" className="text-white/40 hover:text-white transition-colors">
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
