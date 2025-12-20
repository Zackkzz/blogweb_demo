'use client'

import { useEffect, useState } from 'react'

export default function About() {
  const [content, setContent] = useState<{ title: string; content: string }>({ title: '', content: '' })

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setContent(data.about))
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
      <p>{content.content}</p>
    </div>
  )
}