'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Projects() {
  const [projects, setProjects] = useState([] as Array<{ title: string; description: string; link: string }>)

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Projects</h1>
          <p className="text-xl text-gray-600">Explore my work and creations</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-xl mb-4">No projects yet</div>
            <p className="text-gray-500">Projects will appear here once added through the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h2>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  
                  {project.link && (
                    <Link 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
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
