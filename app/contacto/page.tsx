'use client'

import { useState } from 'react'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const PHONE_CODES = [
  { code: '+503', country: '🇸🇻 El Salvador'     },
  { code: '+1',   country: '🇺🇸 Estados Unidos'  },
  { code: '+502', country: '🇬🇹 Guatemala'       },
  { code: '+504', country: '🇭🇳 Honduras'        },
  { code: '+505', country: '🇳🇮 Nicaragua'       },
  { code: '+506', country: '🇨🇷 Costa Rica'      },
  { code: '+507', country: '🇵🇦 Panamá'          },
  { code: '+52',  country: '🇲🇽 México'          },
  { code: '+54',  country: '🇦🇷 Argentina'       },
  { code: '+55',  country: '🇧🇷 Brasil'          },
  { code: '+56',  country: '🇨🇱 Chile'           },
  { code: '+57',  country: '🇨🇴 Colombia'        },
  { code: '+58',  country: '🇻🇪 Venezuela'       },
  { code: '+51',  country: '🇵🇪 Perú'            },
  { code: '+593', country: '🇪🇨 Ecuador'         },
  { code: '+591', country: '🇧🇴 Bolivia'         },
  { code: '+595', country: '🇵🇾 Paraguay'        },
  { code: '+598', country: '🇺🇾 Uruguay'         },
  { code: '+34',  country: '🇪🇸 España'          },
  { code: '+44',  country: '🇬🇧 Reino Unido'     },
  { code: '+33',  country: '🇫🇷 Francia'         },
  { code: '+49',  country: '🇩🇪 Alemania'        },
  { code: '+39',  country: '🇮🇹 Italia'          },
  { code: '+351', country: '🇵🇹 Portugal'        },
  { code: '+31',  country: '🇳🇱 Países Bajos'    },
  { code: '+32',  country: '🇧🇪 Bélgica'         },
  { code: '+41',  country: '🇨🇭 Suiza'           },
  { code: '+43',  country: '🇦🇹 Austria'         },
  { code: '+46',  country: '🇸🇪 Suecia'          },
  { code: '+47',  country: '🇳🇴 Noruega'         },
  { code: '+45',  country: '🇩🇰 Dinamarca'       },
  { code: '+358', country: '🇫🇮 Finlandia'       },
  { code: '+48',  country: '🇵🇱 Polonia'         },
  { code: '+7',   country: '🇷🇺 Rusia'           },
  { code: '+86',  country: '🇨🇳 China'           },
  { code: '+81',  country: '🇯🇵 Japón'           },
  { code: '+82',  country: '🇰🇷 Corea del Sur'   },
  { code: '+91',  country: '🇮🇳 India'           },
  { code: '+61',  country: '🇦🇺 Australia'       },
  { code: '+64',  country: '🇳🇿 Nueva Zelanda'   },
  { code: '+27',  country: '🇿🇦 Sudáfrica'       },
  { code: '+20',  country: '🇪🇬 Egipto'          },
  { code: '+234', country: '🇳🇬 Nigeria'         },
  { code: '+254', country: '🇰🇪 Kenia'           },
  { code: '+212', country: '🇲🇦 Marruecos'       },
  { code: '+90',  country: '🇹🇷 Turquía'         },
  { code: '+966', country: '🇸🇦 Arabia Saudita'  },
  { code: '+971', country: '🇦🇪 Emiratos Árabes' },
  { code: '+972', country: '🇮🇱 Israel'          },
  { code: '+92',  country: '🇵🇰 Pakistán'        },
  { code: '+880', country: '🇧🇩 Bangladesh'      },
  { code: '+63',  country: '🇵🇭 Filipinas'       },
  { code: '+84',  country: '🇻🇳 Vietnam'         },
  { code: '+62',  country: '🇮🇩 Indonesia'       },
  { code: '+60',  country: '🇲🇾 Malasia'         },
  { code: '+65',  country: '🇸🇬 Singapur'        },
  { code: '+66',  country: '🇹🇭 Tailandia'       },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '8px',
  border: '1px solid rgba(196,88,26,0.25)',
  background: '#F2F0ED',
  fontFamily: FONT_SANS,
  fontSize: '16px',
  color: '#2C2C2C',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontFamily: FONT_SANS,
  fontSize: '13px',
  fontWeight: 700,
  color: '#7A7A78',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  display: 'block',
  marginBottom: '6px',
}

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre:    '',
    direccion: '',
    phoneCode: '+503',
    telefono:  '',
    mensaje:   '',
  })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.mensaje.trim()) {
      setError('Nombre y mensaje son obligatorios')
      return
    }
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:    form.nombre,
          direccion: form.direccion,
          telefono:  form.telefono ? `${form.phoneCode} ${form.telefono}` : '',
          mensaje:   form.mensaje,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(true)
      setForm({ nombre: '', direccion: '', phoneCode: '+503', telefono: '', mensaje: '' })
    } catch (err: any) {
      setError(err.message ?? 'Error al enviar. Intenta de nuevo.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ background: '#F2F0ED', minHeight: '100vh' }}>

      {/* Header oscuro */}
      <section style={{ background: '#1E1E1E', padding: '64px 24px', textAlign: 'center' }}>
        <p style={{
          fontFamily: FONT_SANS,
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#D4963A',
          marginBottom: '12px',
        }}>
          Artifex7
        </p>
        <h1 style={{
          fontFamily: FONT_SERIF,
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 700,
          color: '#F2F0ED',
          margin: 0,
        }}>
          Contáctenos
        </h1>
        <p style={{
          fontFamily: FONT_SANS,
          fontSize: '18px',
          color: '#F2F0ED60',
          marginTop: '12px',
          marginBottom: 0,
        }}>
          Estamos aquí para ayudarte
        </p>
      </section>

      {/* Formulario */}
      <div style={{ maxWidth: '580px', margin: '0 auto', padding: '48px 24px' }}>

        {success ? (
          /* Estado de éxito */
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '48px 32px',
            textAlign: 'center',
            border: '1.5px solid #C4581A30',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{
              fontFamily: FONT_SERIF,
              fontSize: '26px',
              fontWeight: 700,
              color: '#1E1E1E',
              marginBottom: '10px',
            }}>
              ¡Mensaje enviado!
            </h2>
            <p style={{
              fontFamily: FONT_SANS,
              fontSize: '16px',
              color: '#7A7A78',
              lineHeight: 1.7,
              marginBottom: '28px',
            }}>
              Gracias por contactarnos. Te responderemos a la brevedad posible.
            </p>
            <button
              onClick={() => setSuccess(false)}
              style={{
                background: '#1E1E1E',
                color: '#D4963A',
                fontFamily: FONT_SANS,
                fontSize: '15px',
                fontWeight: 700,
                padding: '13px 28px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          /* Formulario */
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '36px 32px',
            border: '0.5px solid #2C2C2C12',
          }}>
            <h2 style={{
              fontFamily: FONT_SERIF,
              fontSize: '24px',
              fontWeight: 700,
              color: '#1E1E1E',
              marginBottom: '28px',
            }}>
              Envíanos un mensaje
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Nombre */}
              <div>
                <label style={labelStyle}>Nombre *</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  style={inputStyle}
                  required
                />
              </div>

              {/* Dirección */}
              <div>
                <label style={labelStyle}>Dirección</label>
                <input
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  placeholder="Ciudad, país"
                  style={inputStyle}
                />
              </div>

              {/* Teléfono */}
              <div>
                <label style={labelStyle}>Teléfono</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    name="phoneCode"
                    value={form.phoneCode}
                    onChange={handleChange}
                    style={{ ...inputStyle, width: '180px', flexShrink: 0, cursor: 'pointer' }}
                  >
                    {PHONE_CODES.map(p => (
                      <option key={p.code + p.country} value={p.code}>
                        {p.country} ({p.code})
                      </option>
                    ))}
                  </select>
                  <input
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="Número de teléfono"
                    type="tel"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label style={labelStyle}>Mensaje *</label>
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  placeholder="¿En qué podemos ayudarte?"
                  rows={5}
                  required
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                />
              </div>

              {/* Error */}
              {error && (
                <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#C4581A', margin: 0 }}>
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                style={{
                  background: sending ? '#1E1E1E80' : '#1E1E1E',
                  color: '#D4963A',
                  fontFamily: FONT_SANS,
                  fontSize: '16px',
                  fontWeight: 700,
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  width: '100%',
                }}
              >
                {sending ? 'Enviando...' : 'Enviar mensaje'}
              </button>

            </form>
          </div>
        )}

        {/* Info de contacto */}
        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            border: '0.5px solid #2C2C2C12',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📧</div>
            <p style={{
              fontFamily: FONT_SANS,
              fontSize: '13px',
              fontWeight: 600,
              color: '#7A7A78',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: '0 0 4px',
            }}>
              Email
            </p>
            <a
              href="mailto:artifex7net@gmail.com"
              style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#C4581A', textDecoration: 'none', fontWeight: 500 }}
            >
              artifex7net@gmail.com
            </a>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            border: '0.5px solid #2C2C2C12',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🌐</div>
            <p style={{
              fontFamily: FONT_SANS,
              fontSize: '13px',
              fontWeight: 600,
              color: '#7A7A78',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: '0 0 4px',
            }}>
              Sitio web
            </p>
            <a
              href="https://www.artifex7.net"
              style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#C4581A', textDecoration: 'none', fontWeight: 500 }}
            >
              www.artifex7.net
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
