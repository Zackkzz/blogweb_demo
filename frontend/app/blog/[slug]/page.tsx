'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BlogPost() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [post, setPost] = useState<{ title: string; content: string; date: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    fetch('/api/content')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch content')
        }
        return res.json()
      })
      .then(data => {
        if (data && Array.isArray(data.blog)) {
          // Find post by slug (id or generated slug from title)
          const foundPost = data.blog.find((p: any, index: number) => {
            const postSlug = p.id || generateSlug(p.title, index)
            return postSlug === slug
          })

          if (foundPost) {
            setPost(foundPost)
          } else {
            // Post not found, redirect to blog page
            router.push('/blog')
          }
        } else {
          router.push('/blog')
        }
      })
      .catch(error => {
        console.error('Error fetching content:', error)
        router.push('/blog')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug, router])

  const generateSlug = (title: string, index: number) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    return slug || `post-${index}`
  }

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

  if (loading) {
    return (
      <div className="sunlight-page-bg py-12 px-4 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-20">
            <div className="text-orange-700/70 text-xl">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="sunlight-page-bg py-12 px-4 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-20">
            <div className="text-orange-700/70 text-xl mb-4">Post not found</div>
            <Link href="/blog" className="text-orange-600 hover:text-orange-700 underline">
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sunlight-page-bg py-12 px-4 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        {/* Back button */}
        <Link 
          href="/blog"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Blog Post */}
        <article className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-orange-200/30">
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-6">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <time className="text-sm text-orange-700/70 font-medium">
                {formatDate(post.date)}
              </time>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
              {post.title}
            </h1>
            
            <div 
              className="prose prose-lg max-w-none prose-headings:text-orange-900 prose-a:text-orange-600 prose-strong:text-orange-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 blog-post-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Back button at bottom */}
        <div className="mt-8 text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  )
}

