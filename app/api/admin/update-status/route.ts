import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://k1bo.net'
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { data: caller } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (caller?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { userId, status } = await req.json()

    if (!userId || !['registered', 'review', 'active', 'suspended'].includes(status)) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
    }

    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: targetProfile } = await adminSupabase
      .from('profiles')
      .select('role, full_name, account_status')
      .eq('id', userId)
      .single()

    const { error } = await adminSupabase
      .from('profiles')
      .update({ account_status: status })
      .eq('id', userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Send activation email to professionals when their account goes active
    if (
      status === 'active' &&
      targetProfile?.role === 'professional' &&
      targetProfile?.account_status !== 'active'
    ) {
      try {
        const { data: authData } = await adminSupabase.auth.admin.getUserById(userId)
        const email = authData?.user?.email
        const name  = targetProfile.full_name ?? 'Profesional'

        if (email) {
          await resend.emails.send({
            from: FROM_EMAIL,
            to:   email,
            subject: '¡Tu cuenta ha sido activada en K1BO!',
            html: activationEmail(name, SITE_URL),
          })
        }
      } catch (emailErr) {
        console.error('Error sending activation email:', emailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Error interno' }, { status: 500 })
  }
}

function activationEmail(name: string, siteUrl: string) {
  const dashUrl = `${siteUrl}/sv/profesional-panel/dashboard`
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F2F0ED;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F0ED;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;border:1px solid #2C2C2C15;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:#1E1E1E;padding:28px 40px;text-align:center;">
            <span style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#D4963A;letter-spacing:0.05em;">K1BO</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="font-size:15px;color:#7A7A78;margin:0 0 8px;">Hola, <strong style="color:#1E1E1E;">${name}</strong></p>
            <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#1E1E1E;margin:0 0 16px;line-height:1.3;">
              ¡Tu cuenta ha sido activada! 🎉
            </h1>
            <p style="font-size:15px;color:#7A7A78;line-height:1.7;margin:0 0 28px;">
              Nuestro equipo revisó tu solicitud y hemos activado tu cuenta de profesional en K1BO. Ya puedes comenzar a recibir solicitudes de clientes.
            </p>

            <!-- Steps -->
            <div style="background:#F2F0ED;border-radius:12px;padding:24px 28px;margin-bottom:28px;">
              <p style="font-size:13px;font-weight:700;color:#7A7A78;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px;">Para completar tu perfil:</p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding:8px 0;vertical-align:top;width:28px;">
                    <span style="display:inline-block;background:#C4581A;color:#fff;font-size:11px;font-weight:700;width:20px;height:20px;border-radius:50%;text-align:center;line-height:20px;">1</span>
                  </td>
                  <td style="padding:8px 0 8px 8px;font-size:14px;color:#1E1E1E;line-height:1.5;">
                    <strong>Portafolio</strong> — Agrega fotografías de tus trabajos anteriores para generar confianza con los clientes.
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;vertical-align:top;">
                    <span style="display:inline-block;background:#C4581A;color:#fff;font-size:11px;font-weight:700;width:20px;height:20px;border-radius:50%;text-align:center;line-height:20px;">2</span>
                  </td>
                  <td style="padding:8px 0 8px 8px;font-size:14px;color:#1E1E1E;line-height:1.5;">
                    <strong>Preguntas frecuentes (FAQ)</strong> — Responde las dudas más comunes de tus clientes antes de que te contacten.
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;vertical-align:top;">
                    <span style="display:inline-block;background:#C4581A;color:#fff;font-size:11px;font-weight:700;width:20px;height:20px;border-radius:50%;text-align:center;line-height:20px;">3</span>
                  </td>
                  <td style="padding:8px 0 8px 8px;font-size:14px;color:#1E1E1E;line-height:1.5;">
                    <strong>Categorías de servicios</strong> — Indica en qué categorías ofreces tus servicios para aparecer en las búsquedas correctas.
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;vertical-align:top;">
                    <span style="display:inline-block;background:#C4581A;color:#fff;font-size:11px;font-weight:700;width:20px;height:20px;border-radius:50%;text-align:center;line-height:20px;">4</span>
                  </td>
                  <td style="padding:8px 0 8px 8px;font-size:14px;color:#1E1E1E;line-height:1.5;">
                    <strong>Zona de cobertura</strong> — Define las ciudades o municipios donde ofreces tus servicios.
                  </td>
                </tr>
              </table>
            </div>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center">
                  <a href="${dashUrl}" style="display:inline-block;background:#1E1E1E;color:#D4963A;font-size:15px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.02em;">
                    Completar mi perfil →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #2C2C2C10;text-align:center;">
            <p style="font-size:12px;color:#7A7A78;margin:0;line-height:1.6;">
              Recibes este correo porque tu cuenta fue activada en K1BO.<br>
              Si tienes dudas, escríbenos a <a href="mailto:hola@k1bo.net" style="color:#C4581A;text-decoration:none;">hola@k1bo.net</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`
}
