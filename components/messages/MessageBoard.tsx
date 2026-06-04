'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MessageSquare, MessageCircle, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

interface Msg {
  id: string
  sender_id: string
  message: string
  created_at: string
}

export interface MessageBoardProps {
  quoteRequestId: string
  currentUserId: string
  currentUserName: string
  currentUserPhoto?: string
  otherPartyName: string
  otherPartyPhoto?: string
}

function fmtTime(d: string) {
  return new Date(d).toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' })
}

export function MessageBoard({
  quoteRequestId,
  currentUserId,
  currentUserName,
  otherPartyName,
}: MessageBoardProps) {
  const [msgs, setMsgs]       = useState<Msg[]>([])
  const [text, setText]       = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const taRef  = useRef<HTMLTextAreaElement>(null)

  // Load messages — no profile join to keep query simple and avoid RLS edge-cases
  const loadMessages = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('quote_messages')
      .select('id, sender_id, message, created_at')
      .eq('quote_request_id', quoteRequestId)
      .order('created_at', { ascending: true })
    if (error) { console.error('Error cargando mensajes:', error); return }
    setMsgs((prev) => {
      // Only update if content actually changed (avoid unnecessary re-renders)
      if (JSON.stringify(prev) === JSON.stringify(data ?? [])) return prev
      return data ?? []
    })
  }, [quoteRequestId])

  useEffect(() => {
    loadMessages()

    // 3-second polling as primary mechanism (works even without Realtime enabled)
    const interval = setInterval(loadMessages, 3000)

    // Realtime subscription as bonus (deduplicated with polling above)
    const supabase = createClient()
    const channel = supabase
      .channel('msgs-' + quoteRequestId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'quote_messages',
        filter: 'quote_request_id=eq.' + quoteRequestId,
      }, () => { loadMessages() })
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [quoteRequestId, loadMessages])

  // Auto-scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  const send = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    const supabase = createClient()
    const { error } = await supabase.from('quote_messages').insert({
      quote_request_id: quoteRequestId,
      sender_id: currentUserId,
      message: text.trim(),
    })
    if (error) {
      console.error('Error enviando mensaje:', error)
      setSending(false)
      return
    }
    setText('')
    setSending(false)
    if (taRef.current) taRef.current.style.height = 'auto'
    // Immediately reload so the sent message appears without waiting for next poll
    loadMessages()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const onInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 82) + 'px'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header — compact */}
      <div style={{
        backgroundColor: '#1C1410',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
      }}>
        <MessageSquare style={{ width: 18, height: 18, color: '#D4A96A', flexShrink: 0 }} />
        <div>
          <span style={{ fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 600, color: '#F5F0E8', display: 'block' }}>
            Mensajes
          </span>
          <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: 'rgba(245,240,232,0.50)' }}>
            Comunícate con {otherPartyName}
          </span>
        </div>
      </div>

      {/* Messages area — fills available height */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: '#F5F0E8',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {msgs.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}>
            <MessageCircle style={{ width: 32, height: 32, color: '#D4A96A', opacity: 0.4 }} />
            <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E', textAlign: 'center', margin: 0 }}>
              Aún no hay mensajes.<br />Inicia la conversación.
            </p>
          </div>
        ) : (
          <>
            {msgs.map((m) => {
              const isOwn = m.sender_id === currentUserId
              const name  = isOwn ? currentUserName : otherPartyName
              return (
                <div key={m.id} style={{ alignSelf: isOwn ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
                  {!isOwn && (
                    <p style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 600, color: '#B85C1A', margin: '0 0 3px' }}>
                      {name}
                    </p>
                  )}
                  <div style={{
                    backgroundColor: isOwn ? '#1C1410' : '#FFFFFF',
                    color:            isOwn ? '#F5F0E8' : '#1C1410',
                    border:           isOwn ? 'none' : '0.5px solid #1C141015',
                    borderRadius:     isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    padding: '10px 14px',
                  }}>
                    <p style={{ fontFamily: FONT_SANS, fontSize: '15px', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {m.message}
                    </p>
                    <p style={{
                      fontFamily: FONT_SANS,
                      fontSize: '11px',
                      color:     isOwn ? 'rgba(245,240,232,0.50)' : '#6B7B6E',
                      textAlign: isOwn ? 'right' : 'left',
                      margin: '4px 0 0',
                    }}>
                      {fmtTime(m.created_at)}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={endRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div style={{
        borderTop: '0.5px solid #1C141015',
        padding: '12px 16px',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        <textarea
          ref={taRef}
          value={text}
          onChange={onInput}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(212,169,106,0.40)',
            backgroundColor: '#F5F0E8',
            fontFamily: FONT_SANS,
            fontSize: '15px',
            color: '#1C1410',
            resize: 'none',
            outline: 'none',
            lineHeight: '1.5',
            overflowY: 'hidden',
          }}
        />
        <button
          onClick={send}
          disabled={!text.trim() || sending}
          style={{
            backgroundColor: '#B85C1A',
            color: '#F5F0E8',
            width: 42,
            height: 42,
            borderRadius: '8px',
            border: 'none',
            cursor: text.trim() && !sending ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            opacity: text.trim() && !sending ? 1 : 0.5,
            transition: 'opacity 150ms',
          }}
        >
          <Send style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </div>
  )
}
