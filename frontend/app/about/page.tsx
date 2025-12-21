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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
      <p>{content.content}</p>
    </div>
  )
}
