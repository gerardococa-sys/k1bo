'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Photo {
  id: string
  photo_url: string
  publicUrl: string
  caption: string | null
  order_index: number
}

export function PortfolioLightbox({ photos }: { photos: Photo[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const close = useCallback(() => setActiveIndex(null), [])
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  )
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length],
  )

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex, close, prev, next])

  if (photos.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No hay fotos en el portafolio aún.</p>
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setActiveIndex(index)}
            className="relative aspect-square overflow-hidden rounded-lg bg-muted cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.publicUrl}
              alt={photo.caption ?? 'Foto de portafolio'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s' }}
              className="group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 z-10 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Photo */}
          <div
            className="flex flex-col items-center mx-16 max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[activeIndex].publicUrl}
              alt={photos[activeIndex].caption ?? 'Foto de portafolio'}
              className="max-h-[75vh] max-w-full object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
            {photos[activeIndex].caption && (
              <p className="mt-3 text-sm text-white/80 text-center">
                {photos[activeIndex].caption}
              </p>
            )}
            <p className="mt-1 text-xs text-white/40">
              {activeIndex + 1} / {photos.length}
            </p>
          </div>

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 z-10 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
        </div>
      )}
    </>
  )
}
