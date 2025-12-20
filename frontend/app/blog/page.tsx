'use client'

import { useEffect, useState } from 'react'

export default function Blog() {
  const [posts, setPosts] = useState([] as Array<{ title: string; content: string; date: string }>)

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setPosts(data.blog))
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      {posts.map((post, index) => (
        <div key={index} className="mb-4 border p-4 rounded">
          <h2 className="text-2xl">{post.title}</h2>
          <p className="text-sm text-gray-500">{post.date}</p>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  )
}
