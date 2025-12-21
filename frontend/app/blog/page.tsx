'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Blog() {
  const [posts, setPosts] = useState([] as Array<{ title: string; content: string; date: string; id?: string }>)

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

  const generateSlug = (title: string, index: number) => {
    // Generate a URL-friendly slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    return slug || `post-${index}`
  }

  return (
    <div className="sunlight-page-bg py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-orange-900/90 mb-4">Blog</h1>
          <p className="text-xl text-orange-800/80">Thoughts, ideas, and stories</p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Blog Posts List */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-orange-700/70 text-xl mb-4">No blog posts yet</div>
            <p className="text-orange-600/70">Blog posts will appear here once added through the admin panel.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => {
              const slug = post.id || generateSlug(post.title, index)
              return (
                <Link 
                  key={index}
                  href={`/blog/${slug}`}
                  className="block"
                >
                  <article 
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-orange-200/30 cursor-pointer group"
                  >
                    <div className="p-8">
                      <div className="flex items-center mb-4">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <time className="text-sm text-orange-700/70 font-medium">
                          {formatDate(post.date)}
                        </time>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                        {post.title}
                      </h2>
                      
                      {/* Extract preview from content */}
                      {(() => {
                        // Remove HTML tags and get first 150 characters as preview
                        const textContent = post.content
                          .replace(/<[^>]*>/g, '')
                          .replace(/&nbsp;/g, ' ')
                          .trim()
                        const preview = textContent.length > 150 
                          ? textContent.substring(0, 150) + '...' 
                          : textContent
                        return (
                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                            {preview}
                          </p>
                        )
                      })()}
                      
                      <div className="flex items-center text-orange-600 font-medium mt-4 group-hover:text-orange-700 transition-colors">
                        <span>Read more</span>
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
