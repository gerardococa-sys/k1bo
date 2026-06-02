import { Navbar } from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/Footer'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
