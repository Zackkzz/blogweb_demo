'use client'

import { useEffect, useState, useRef } from 'react'
import BackgroundSlider from '@/components/BackgroundSlider'

interface ContactInfo {
  email?: string
  github?: string
  linkedin?: string
  twitter?: string
  website?: string
}

export default function Home() {
  const [content, setContent] = useState<{ title: string; content: string }>({ title: '', content: '' })
  const [contactInfo, setContactInfo] = useState<ContactInfo>({})
  const [waveStopped, setWaveStopped] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  useEffect(() => {
    fetch('/api/content')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch content')
        }
        return res.json()
      })
      .then(data => {
        if (data && data.home) {
          setContent(data.home)
        } else {
          setContent({ title: 'Good Day! Welcome to My Space!', content: 'Loading...' })
        }
        // Get contact info if available
        if (data && data.contact) {
          setContactInfo(data.contact)
        }
      })
      .catch(error => {
        console.error('Error fetching content:', error)
        setContent({ title: 'Good Day! Welcome to My Space!', content: 'Content is loading...' })
      })
  }, [])

  // Stop waving animation after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setWaveStopped(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (distance > minSwipeDistance && currentPage < 1) {
      // Swipe left - go to next page
      setCurrentPage(currentPage + 1)
    } else if (distance < -minSwipeDistance && currentPage > 0) {
      // Swipe right - go to previous page
      setCurrentPage(currentPage - 1)
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  // Handle mouse wheel for scrolling between pages
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && currentPage < 1) {
      setCurrentPage(currentPage + 1)
    } else if (e.deltaY < 0 && currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image slider */}
      <BackgroundSlider />
      
      {/* Left Navigation Bar */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
        <button
          onClick={() => setCurrentPage(0)}
          className={`w-3 h-12 rounded-full transition-all duration-300 ${
            currentPage === 0 
              ? 'bg-white/90 shadow-lg scale-110' 
              : 'bg-white/40 hover:bg-white/60'
          }`}
          aria-label="Go to page 1"
        />
        <button
          onClick={() => setCurrentPage(1)}
          className={`w-3 h-12 rounded-full transition-all duration-300 ${
            currentPage === 1 
              ? 'bg-white/90 shadow-lg scale-110' 
              : 'bg-white/40 hover:bg-white/60'
          }`}
          aria-label="Go to page 2"
        />
      </div>

      {/* Swipeable Container */}
      <div
        ref={containerRef}
        className="relative z-10 w-full h-screen overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {/* Pages Container */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {/* Page 1: Main Content */}
          <div className="min-w-full h-full flex flex-col items-center justify-center px-4 py-20 relative">
            <div className="text-center max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                <span className="flex items-center justify-center gap-3 flex-wrap">
                  <span>{content.title || 'Good Day! Welcome to My Space!'}</span>
                  <span className={`wave-hand ${waveStopped ? 'stopped' : ''}`}>👋</span>
                </span>
              </h1>
              {content.content && /<[a-z][\s\S]*>/i.test(content.content) ? (
                <div 
                  className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed prose prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              ) : (
                <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                  {content.content}
                </p>
              )}
            </div>

            {/* Copyright - Bottom center */}
            <div className="absolute bottom-4 left-0 right-0 text-center z-20">
              <p className="text-white/70 text-sm md:text-base">
                © {new Date().getFullYear()} My Space. All rights reserved.
              </p>
            </div>
          </div>

          {/* Page 2: Contact Information */}
          <div className="min-w-full h-full flex flex-col items-center justify-center px-4 py-20 relative">
            <div className="w-full max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 text-center">Get in Touch</h2>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 md:p-12 border border-white/20 shadow-lg">
                <div className="flex flex-col gap-6">
                  {contactInfo.email && (
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="flex items-center gap-4 px-6 py-4 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-200 group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-2xl">📧</span>
                      <div className="flex-1">
                        <div className="text-sm text-white/70 mb-1">Email</div>
                        <div className="text-lg font-semibold">{contactInfo.email}</div>
                      </div>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </a>
                  )}
                  {contactInfo.github && (
                    <a 
                      href={contactInfo.github}
                      className="flex items-center gap-4 px-6 py-4 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-200 group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-2xl">💻</span>
                      <div className="flex-1">
                        <div className="text-sm text-white/70 mb-1">GitHub</div>
                        <div className="text-lg font-semibold">{contactInfo.github.replace(/^https?:\/\//, '')}</div>
                      </div>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </a>
                  )}
                  {contactInfo.linkedin && (
                    <a 
                      href={contactInfo.linkedin}
                      className="flex items-center gap-4 px-6 py-4 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-200 group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-2xl">💼</span>
                      <div className="flex-1">
                        <div className="text-sm text-white/70 mb-1">LinkedIn</div>
                        <div className="text-lg font-semibold">{contactInfo.linkedin.replace(/^https?:\/\//, '')}</div>
                      </div>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </a>
                  )}
                  {contactInfo.twitter && (
                    <a 
                      href={contactInfo.twitter}
                      className="flex items-center gap-4 px-6 py-4 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-200 group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-2xl">🐦</span>
                      <div className="flex-1">
                        <div className="text-sm text-white/70 mb-1">Twitter</div>
                        <div className="text-lg font-semibold">{contactInfo.twitter.replace(/^https?:\/\//, '')}</div>
                      </div>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </a>
                  )}
                  {contactInfo.website && (
                    <a 
                      href={contactInfo.website}
                      className="flex items-center gap-4 px-6 py-4 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-200 group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-2xl">🌐</span>
                      <div className="flex-1">
                        <div className="text-sm text-white/70 mb-1">Website</div>
                        <div className="text-lg font-semibold">{contactInfo.website.replace(/^https?:\/\//, '')}</div>
                      </div>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </a>
                  )}
                  {Object.keys(contactInfo).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-white/70 text-lg">Contact information coming soon...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Copyright - Bottom center */}
            <div className="absolute bottom-4 left-0 right-0 text-center z-20">
              <p className="text-white/70 text-sm md:text-base">
                © {new Date().getFullYear()} My Space. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom right corner info */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-5 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 flex items-center justify-center bg-gray-800/20">
              <img 
                src={`/profile.jpg?t=${new Date().getTime()}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
                style={{ 
                  objectPosition: 'center center',
                  transform: 'scale(1.3)',
                  minWidth: '100%',
                  minHeight: '100%'
                }}
                onError={(e) => {
                  // Fallback to default image if the custom image doesn't exist
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
                }}
              />
            </div>
            <div className="text-right">
              <div className="font-semibold text-base">Your Name</div>
              <div className="text-sm text-white/70">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
