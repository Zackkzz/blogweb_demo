'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Projects() {
  const [projects, setProjects] = useState([] as Array<{ title: string; description: string; link: string; image?: string }>)

  useEffect(() => {
    fetch('/api/content')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch content')
        }
        return res.json()
      })
      .then(data => {
        if (data && Array.isArray(data.projects)) {
          setProjects(data.projects)
        } else {
          setProjects([])
        }
      })
      .catch(error => {
        console.error('Error fetching content:', error)
        setProjects([])
      })
  }, [])

  return (
    <div className="sunlight-page-bg py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-orange-900/90 mb-4">Projects</h1>
          <p className="text-xl text-orange-800/80">Explore my work and creations</p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-orange-700/70 text-xl mb-4">No projects yet</div>
            <p className="text-orange-600/70">Projects will appear here once added through the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-orange-200/30"
              >
                <div className="p-6">
                  <div className="mb-4">
                    {project.image ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden mb-4 group-hover:scale-110 transition-transform border-2 border-orange-200/50">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to emoji if image fails to load
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent && !parent.querySelector('.fallback-icon')) {
                              const fallback = document.createElement('div')
                              fallback.className = 'fallback-icon w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center'
                              fallback.innerHTML = '<span class="text-2xl">🚀</span>'
                              parent.appendChild(fallback)
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-2xl">🚀</span>
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                      {project.title}
                    </h2>
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  
                  {project.link && (
                    <Link 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                    >
                      View Project
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
