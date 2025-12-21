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
  const [nextIndex, setNextIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Preload all images for smoother transitions
  useEffect(() => {
    backgroundImages.forEach((image) => {
      const img = new Image()
      img.src = image
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      // Start crossfade transition - next image fades in while current fades out
      setIsTransitioning(true)
      
      // After transition completes, update indices
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
        setNextIndex((prevIndex) => (prevIndex + 2) % backgroundImages.length)
        setIsTransitioning(false)
      }, 3000) // Wait for transition to complete (3s)
    }, 8000) // Change image every 8 seconds (5s display + 3s transition)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {backgroundImages.map((image, index) => {
        const isCurrent = index === currentIndex
        const isNext = index === nextIndex
        
        // Calculate opacity for crossfade effect
        let opacity = 0
        if (isTransitioning) {
          // During transition: next image fades in (0 to 1), current fades out (1 to 0)
          opacity = isNext ? 1 : isCurrent ? 0 : 0
        } else {
          // When not transitioning: only current image is visible
          opacity = isCurrent ? 1 : 0
        }
        
        return (
          <div
            key={image}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[3000ms] ease-in-out"
            style={{
              backgroundImage: `url(${image})`,
              opacity: opacity,
              zIndex: isNext ? 2 : isCurrent ? 1 : 0,
            }}
          />
        )
      })}
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-3"></div>
    </div>
  )
}

