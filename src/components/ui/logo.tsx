'use client'

import { useState } from 'react'

interface LogoProps {
  src?: string | null
  alt?: string
  className?: string
  fallback?: string
}

export function Logo({ src, alt = 'Eternal Echoes & Visions', className = '', fallback = 'E' }: LogoProps) {
  const [imageError, setImageError] = useState(false)
  const logoPath = src || '/logo.png'

  if (imageError) {
    return (
      <div className={`rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm ${className}`}>
        <span>{fallback}</span>
      </div>
    )
  }

  return (
    <img 
      src={logoPath} 
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}

