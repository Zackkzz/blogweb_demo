'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface HomeData {
  title?: string
  content?: string
  backgroundImage?: string
}

export default function BackgroundSlider() {
  const [homeData, setHomeData] = useState<HomeData>({})
  const [backgroundImage, setBackgroundImage] = useState('/scroll/757c36f4d3c685ebf384a0c9f3d8d067.jpg')

  useEffect(() => {
    // Fetch home data to get background image
    fetch('/api/content')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch content')
        }
        return res.json()
      })
      .then(data => {
        if (data && data.home) {
          setHomeData(data.home)
          if (data.home.backgroundImage) {
            setBackgroundImage(data.home.backgroundImage)
          }
        }
      })
      .catch(error => {
        console.error('Error fetching home data:', error)
      })
  }, [])

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
