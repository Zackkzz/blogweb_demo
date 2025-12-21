'use client'

import { useEffect, useState } from 'react'

export default function Blog() {
  const [posts, setPosts] = useState([] as Array<{ title: string; content: string; date: string }>)

  useEffect(() => {
    fetch('/api/content')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch content')
        }
        return res.json()
      })
      .then(data => {
        if (data && Array.isArray(data.blog)) {
          // Sort posts by date (newest first)
          const sortedPosts = [...data.blog].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          })
          setPosts(sortedPosts)
        } else {
          setPosts([])
        }
      })
      .catch(error => {
        console.error('Error fetching content:', error)
        setPosts([])
      })
  }, [])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Blog</h1>
          <p className="text-xl text-gray-600">Thoughts, ideas, and stories</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Blog Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-xl mb-4">No blog posts yet</div>
            <p className="text-gray-500">Blog posts will appear here once added through the admin panel.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <article 
                key={index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <time className="text-sm text-gray-500 font-medium">
                      {formatDate(post.date)}
                    </time>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
