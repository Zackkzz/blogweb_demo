'use client'

import { useEffect, useState } from 'react'

export default function About() {
  const [content, setContent] = useState<{ title: string; content: string }>({ title: '', content: '' })

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
            <h1 className="text-5xl font-bold mb-4">{content.title || 'About Me'}</h1>
            <div className="w-24 h-1 bg-white/30 rounded-full"></div>
          </div>
          
          {/* Content Section */}
          <div className="px-8 py-12">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                {content.content || 'Content is loading...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
