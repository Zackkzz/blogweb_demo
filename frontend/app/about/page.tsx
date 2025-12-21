'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface AboutData {
  title: string
  content: string
  photo?: string
  name?: string
  position?: string
  email?: string
  phone?: string
  location?: string
  summary?: string
}

export default function About() {
  const [content, setContent] = useState<AboutData>({ 
    title: '', 
    content: '',
    name: '',
    position: '',
    email: '',
    phone: '',
    location: '',
    summary: ''
  })

  useEffect(() => {
    fetch('/api/content')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch content')
        }
        return res.json()
      })
      .then(data => {
        if (data && data.about) {
          setContent(data.about)
        } else {
          setContent({ title: 'About Me', content: 'Loading...' })
        }
      })
      .catch(error => {
        console.error('Error fetching content:', error)
        setContent({ title: 'About Me', content: 'Content is loading...' })
      })
  }, [])

  // Check if content is HTML
  const isHTML = (str: string) => {
    if (!str) return false
    return /<[a-z][\s\S]*>/i.test(str)
  }

  const isContentHTML = isHTML(content.content)

  return (
    <div className="sunlight-page-bg py-12 px-4 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* Modern Web-style Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Photo and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-orange-200/30 sticky top-8">
              {/* Photo Section */}
              <div className="relative w-full aspect-square bg-gradient-to-br from-orange-100 to-amber-100 p-6">
                {content.photo ? (
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                    <Image
                      src={`${content.photo}?t=${new Date().getTime()}`}
                      alt={content.name || 'Profile'}
                      fill
                      className="object-cover"
                      priority
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-xl bg-white/20 border-4 border-white shadow-2xl flex items-center justify-center">
                    <span className="text-9xl">👤</span>
                  </div>
                )}
              </div>
              
              {/* Basic Info Card */}
              <div className="p-6 bg-white/80">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{content.name || content.title || 'Your Name'}</h1>
                {content.position && (
                  <p className="text-xl text-orange-600 font-semibold mb-6">{content.position}</p>
                )}
                
                <div className="space-y-3">
                  {content.email && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📧</span>
                      </div>
                      <a href={`mailto:${content.email}`} className="hover:text-orange-600 transition-colors break-all">
                        {content.email}
                      </a>
                    </div>
                  )}
                  {content.phone && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📱</span>
                      </div>
                      <a href={`tel:${content.phone}`} className="hover:text-orange-600 transition-colors">
                        {content.phone}
                      </a>
                    </div>
                  )}
                  {content.location && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📍</span>
                      </div>
                      <span>{content.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Card */}
            {content.summary && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-200/30">
                <h2 className="text-2xl font-bold text-orange-900/90 mb-4 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full"></span>
                  Summary
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">{content.summary}</p>
              </div>
            )}
            
            {/* Main Content Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-200/30">
              <h2 className="text-2xl font-bold text-orange-900/90 mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full"></span>
                About Me
              </h2>
              
              {isContentHTML ? (
                <div 
                  className="about-content-list prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              ) : (
                <div className="space-y-4">
                  {content.content ? (
                    content.content.split('\n').filter(line => line.trim()).map((line, index) => (
                      <div key={index} className="flex gap-4 group">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-400 mt-2 group-hover:bg-orange-500 transition-colors"></div>
                        <p className="text-gray-700 leading-relaxed text-base md:text-lg flex-1">
                          {line.trim()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                      Content is loading...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
