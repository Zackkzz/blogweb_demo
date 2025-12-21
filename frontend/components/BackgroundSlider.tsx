'use client'

import Image from 'next/image'

// Single background image
const backgroundImage = '/scroll/757c36f4d3c685ebf384a0c9f3d8d067.jpg'

export default function BackgroundSlider() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <Image
        src={backgroundImage}
        alt=""
        fill
        quality={95}
        priority
        sizes="100vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        className="object-cover"
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-3"></div>
    </div>
  )
}
