'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

// List of background images from the scroll directory
const backgroundImages = [
  '/scroll/757c36f4d3c685ebf384a0c9f3d8d067.jpg',
  '/scroll/80150733afe327157afb290d4c6b9e80.jpg',
  '/scroll/b20666ae00a611ce93a9fde7dcf2fcbe.jpg',
  '/scroll/b373e079205209005e71d094f333a585.jpg',
  '/scroll/bc76ab58abe428ea3041f59cfc7cc153.jpg',
  '/scroll/c4e696db63f832cc3ad5d7f3654e8561.jpg',
  '/scroll/dbddadc3317e9a153620d67eefc76c9d.jpg',
  '/scroll/df00f2912ac8ed1f80d636e7c0bf3b6b.jpg',
]

export default function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set())

  // Preload all images for smoother transitions
  useEffect(() => {
    backgroundImages.forEach((image, index) => {
      const img = new window.Image()
      img.onload = () => {
        setImagesLoaded(prev => new Set(prev).add(index))
      }
      img.src = image
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate next image index
      const newNextIndex = (currentIndex + 1) % backgroundImages.length
      
      // First, set next index - this will render next image with opacity 0
      setNextIndex(newNextIndex)
      
      // Wait a bit to ensure next image is in DOM, and check if it's loaded
      const checkAndStartTransition = () => {
        // Ensure next image is loaded before starting transition
        if (imagesLoaded.has(newNextIndex)) {
          // Now start the crossfade transition
          // CSS transition will smoothly animate from current opacity to new opacity
          setIsTransitioning(true)
          
          // After transition completes, update current index and stop transitioning
          setTimeout(() => {
            setCurrentIndex(newNextIndex)
            setIsTransitioning(false)
          }, 3000) // Wait for transition to complete (3s)
        } else {
          // If image not loaded yet, wait a bit more
          setTimeout(checkAndStartTransition, 100)
        }
      }
      
      setTimeout(checkAndStartTransition, 100) // Small delay to ensure DOM update
    }, 8000) // Change image every 8 seconds (5s display + 3s transition)

    return () => clearInterval(interval)
  }, [currentIndex, imagesLoaded])

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {backgroundImages.map((image, index) => {
        const isCurrent = index === currentIndex
        const isNext = index === nextIndex
        
        // Calculate opacity for smooth crossfade effect
        // The key is to ensure both images are in DOM before transition starts
        // During transition: current fades out (1->0), next fades in (0->1)
        // When not transitioning: only current is visible (opacity 1)
        let opacity = 0
        if (isCurrent && !isTransitioning) {
          opacity = 1 // Current image fully visible
        } else if (isCurrent && isTransitioning) {
          opacity = 0 // Current image fades out (CSS transition from 1 to 0)
        } else if (isNext && !isTransitioning) {
          opacity = 0 // Next image ready but invisible
        } else if (isNext && isTransitioning) {
          opacity = 1 // Next image fades in (CSS transition from 0 to 1)
        }
        
        // Only render current and next images for performance
        if (!isCurrent && !isNext) {
          return null
        }
        
        return (
          <div
            key={`${image}-${index}`}
            className="absolute inset-0 transition-opacity duration-[3000ms] ease-in-out"
            style={{
              opacity: opacity,
              zIndex: isNext ? 2 : isCurrent ? 1 : 0,
            }}
          >
            <Image
              src={image}
              alt=""
              fill
              quality={95}
              priority={isCurrent || isNext}
              className="object-cover"
              sizes="100vw"
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </div>
        )
      })}
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-3"></div>
    </div>
  )
}
