'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageSquare, MessageCircle, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

interface Props {
  quoteRequestId: string
  currentUserId: string
  otherPartyName: string
}

function MessageBoard({ quoteRequestId, currentUserId, otherPartyName }: Props) {
  const [messages, setMessages]   = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending]     = useState(false)
  const [error, setError]         = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  async function loadMessages() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('quote_messages')
      .select('id, message, sender_id, created_at')
      .eq('quote_request_id', quoteRequestId)
      .order('created_at', { ascending: true })
    if (error) {
      console.error('RLS/Error cargando mensajes:', JSON.stringify(error))
      setError('Error cargando: ' + error.message)
      return
    }
    console.log('Mensajes cargados:', data?.length,
      '| quoteRequestId:', quoteRequestId,
      '| currentUserId:', currentUserId)
    if (data) setMessages(data)
  }

  async function sendMessage() {
    if (!newMessage.trim() || sending) return
    setSending(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase
      .from('quote_messages')
      .insert({
        quote_request_id: quoteRequestId,
        sender_id: currentUserId,
        message: newMessage.trim(),
      })
    if (error) {
      console.error('RLS/Error enviando:', JSON.stringify(error))
      setError('Error: ' + error.message + ' | Code: ' + error.code)
    } else {
      setNewMessage('')
      await loadMessages()
    }
    setSending(false)
  }

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Log de montaje para verificar que los props llegan correctos
  useEffect(() => {
    console.log('MessageBoard montado:', {
      quoteRequestId,
      currentUserId,
      otherPartyName,
    })
  }, [])

  // Carga inicial + polling cada 4 segundos + suscripción realtime
  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 4000)

    const supabase = createClient()
    const channel = supabase
      .channel('room-' + quoteRequestId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quote_messages',
          filter: `quote_request_id=eq.${quoteRequestId}`,
        },
        (payload) => {
          setMessages((prev) => {
            const exists = prev.find((m) => m.id === payload.new.id)
            if (exists) return prev
            return [...prev, payload.new]
          })
        }
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [quoteRequestId])

  function formatTime(ts: string) {
    return new Date(ts).toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{
      background: '#fff',
      border: '0.5px solid rgba(30,30,30,0.08)',
      borderRadius: '12px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '560px',
    }}>

      {/* Header */}
      <div style={{
        background: '#1E1E1E',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
      }}>
        <MessageSquare style={{ width: 18, height: 18, color: '#D4963A', flexShrink: 0 }} />
        <div>
          <div style={{ color: '#F2F0ED', fontSize: '15px', fontWeight: 600, fontFamily: FONT_SANS }}>
            Mensajes
          </div>
          <div style={{ color: 'rgba(245,240,232,0.5)', fontSize: '12px', fontFamily: FONT_SANS }}>
            Conversación con {otherPartyName}
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        background: '#F2F0ED',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {messages.length === 0 && (
          <div style={{
            margin: 'auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}>
            <MessageCircle style={{ width: 32, height: 32, color: '#D4963A', opacity: 0.4 }} />
            <p style={{ color: '#7A7A78', fontSize: '14px', fontFamily: FONT_SANS, margin: 0 }}>
              Aún no hay mensajes.<br />Inicia la conversación.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId
          return (
            <div key={msg.id} style={{
              alignSelf: isOwn ? 'flex-end' : 'flex-start',
              maxWidth: '78%',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}>
              {!isOwn && (
                <span style={{
                  fontSize: '11px', fontWeight: 600, color: '#C4581A',
                  paddingLeft: '4px', fontFamily: FONT_SANS,
                }}>
                  {otherPartyName}
                </span>
              )}
              <div style={{
                background:   isOwn ? '#1E1E1E' : '#fff',
                color:        isOwn ? '#F2F0ED' : '#1E1E1E',
                border:       isOwn ? 'none' : '0.5px solid rgba(30,30,30,0.1)',
                borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '10px 14px',
                fontSize: '15px',
                lineHeight: 1.5,
                fontFamily: FONT_SANS,
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              }}>
                {msg.message}
              </div>
              <span style={{
                fontSize: '11px',
                color: '#7A7A78',
                alignSelf:    isOwn ? 'flex-end' : 'flex-start',
                paddingLeft:  isOwn ? 0 : '4px',
                paddingRight: isOwn ? '4px' : 0,
                fontFamily: FONT_SANS,
              }}>
                {formatTime(msg.created_at)}
              </span>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '6px 16px',
          background: '#C4581A15',
          color: '#C4581A',
          fontSize: '13px',
          fontFamily: FONT_SANS,
          flexShrink: 0,
        }}>
          {error}
        </div>
      )}

      {/* Input */}
      <div style={{
        borderTop: '0.5px solid rgba(30,30,30,0.08)',
        padding: '12px 14px',
        background: '#fff',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
          }}
          placeholder="Escribe un mensaje... (Enter para enviar)"
          rows={1}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(212,169,106,0.4)',
            background: '#F2F0ED',
            fontSize: '15px',
            color: '#2C2C2C',
            resize: 'none',
            outline: 'none',
            fontFamily: FONT_SANS,
            lineHeight: '1.5',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim() || sending}
          style={{
            background: !newMessage.trim() || sending ? 'rgba(184,92,26,0.4)' : '#C4581A',
            color: '#F2F0ED',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            cursor: !newMessage.trim() || sending ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: FONT_SANS,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          <Send style={{ width: 16, height: 16 }} />
          {sending ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

    </div>
  )
}

// Named export (used by profesional-panel detail page)
export { MessageBoard }
// Default export (used by client solicitud detail page)
export default MessageBoard
