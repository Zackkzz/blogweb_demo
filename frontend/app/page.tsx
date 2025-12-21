'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [content, setContent] = useState<{ title: string; content: string }>({ title: '', content: '' })
  const [waveStopped, setWaveStopped] = useState(false)

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
          setContent({ title: 'Good Day! Welcome to Zack\'s blog!', content: 'Loading...' })
        }
      })
      .catch(error => {
        console.error('Error fetching content:', error)
        setContent({ title: 'Good Day! Welcome to Zack\'s blog!', content: 'Content is loading...' })
      })
  }, [])

  // Stop waving animation after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setWaveStopped(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop&crop=center)' }}>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            <span className="flex items-center justify-center gap-3 flex-wrap">
              <span>Good Day! Welcome to Zack&apos;s blog!</span>
              <span className={`wave-hand ${waveStopped ? 'stopped' : ''}`}>👋</span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            {content.content}
          </p>
        </div>
      </div>
      
      {/* Bottom right corner info */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 flex items-center justify-center bg-gray-800/20">
              <img 
                src="/profile.jpg" 
                alt="Zack" 
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
              <div className="font-semibold text-sm">Zack</div>
              <div className="text-xs text-white/70">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
