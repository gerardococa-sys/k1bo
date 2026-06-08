'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface PhotoGalleryProps {
  photos: { photo_url: string }[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '8px',
      }}>
        {photos.map((p, i) => (
          <div
            key={i}
            onClick={() => setLightbox(p.photo_url)}
            style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.photo_url}
              alt={`Foto ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(30,30,30,0.94)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#F2F0ED', padding: '4px',
            }}
          >
            <X style={{ width: 28, height: 28 }} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Vista completa"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '80vh', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }}
          />
        </div>
      )}
    </>
  )
}
