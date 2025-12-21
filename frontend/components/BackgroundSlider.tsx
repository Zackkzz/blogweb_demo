'use client'

import { useEffect, useState } from 'react'

// List of background images from the scroll directory
const backgroundImages = [
  '/scroll/757c36f4d3c685ebf384a0c9f3d8d067.jpg',
  '/scroll/80150733afe327157afb290d4c6b9e80.jpg',
  '/scroll/b20666ae00a611ce93a9fde7dcf2fcbe.jpg',
  '/scroll/b373e079205209005e71d094f333a585.jpg',
  '/scroll/bc76ab58abe428ea3041f59cfc7cc153.jpg',
  '/scroll/c4e696db63f832cc3ad5f3654e8561.jpg',
  '/scroll/dbddadc3317e9a153620d67eefc76c9d.jpg',
  '/scroll/df00f2912ac8ed1f80d636e7c0bf3b6b.jpg',
]

export default function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Preload next image for smoother transitions
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % backgroundImages.length
    const img = new Image()
    img.src = backgroundImages[nextIndex]
  }, [currentIndex])

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out (smooth transition)
      setIsVisible(false)
      
      // After fade out completes, change image and fade in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
        setIsVisible(true)
      }, 3000) // Wait for fade out animation to complete (3s)
    }, 8000) // Change image every 8 seconds (5s display + 3s transition)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {backgroundImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[3000ms] ease-in-out ${
            index === currentIndex && isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
      ))}
    </div>
  )
}

