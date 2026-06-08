import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { nombre, direccion, telefono, mensaje } = await req.json()

    if (!nombre?.trim() || !mensaje?.trim()) {
      return NextResponse.json(
        { error: 'Nombre y mensaje son requeridos' },
        { status: 400 },
      )
    }

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
      to: 'artifex7net@gmail.com',
      subject: `Nuevo mensaje de contacto — ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">

          <h2 style="color: #1E1E1E; border-bottom: 2px solid #C4581A; padding-bottom: 12px;">
            Nuevo mensaje de contacto — Artifex7
          </h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #7A7A78; width: 140px;">Nombre:</td>
              <td style="padding: 10px 0; color: #1E1E1E;">${nombre}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #7A7A78;">Dirección:</td>
              <td style="padding: 10px 0; color: #1E1E1E;">${direccion || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #7A7A78;">Teléfono:</td>
              <td style="padding: 10px 0; color: #1E1E1E;">${telefono || '—'}</td>
            </tr>
          </table>

          <div style="margin-top: 20px; background: #F2F0ED; border-left: 4px solid #C4581A; padding: 16px 20px; border-radius: 4px;">
            <p style="font-weight: bold; color: #7A7A78; margin: 0 0 8px;">Mensaje:</p>
            <p style="color: #1E1E1E; line-height: 1.7; margin: 0;">${mensaje.replace(/\n/g, '<br/>')}</p>
          </div>

          <p style="margin-top: 24px; font-size: 12px; color: #7A7A78; border-top: 1px solid #E8E5E1; padding-top: 16px;">
            Enviado desde el formulario de contacto de artifex7.net
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Contact error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
