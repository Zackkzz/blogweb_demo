'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface ExperienceItem {
  id: string
  type: 'work' | 'education' | 'project'
  title: string
  organization?: string
  description: string
  startDate: string
  endDate?: string
  icon?: string
  location?: string
}

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([])

  useEffect(() => {
    fetch('/api/content')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch content')
        }
        return res.json()
      })
      .then(data => {
        if (data && Array.isArray(data.experience)) {
          // Display in saved order (no automatic sorting)
          setExperiences(data.experience)
        } else {
          setExperiences([])
        }
      })
      .catch(error => {
        console.error('Error fetching experience:', error)
        setExperiences([])
      })
  }, [])

  const getTypeIcon = (type: string, customIcon?: string) => {
    if (customIcon) {
      return customIcon
    }
    
    switch (type) {
      case 'work':
        return '💼'
      case 'education':
        return '🎓'
      case 'project':
        return '🚀'
      default:
        return '📌'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'work':
        return 'from-orange-400 to-amber-500'
      case 'education':
        return 'from-blue-400 to-indigo-500'
      case 'project':
        return 'from-green-400 to-emerald-500'
      default:
        return 'from-gray-400 to-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="sunlight-page-bg py-12 px-4 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-orange-900/90 mb-4">Experience</h1>
          <p className="text-xl text-orange-800/80">My journey through work, education, and projects</p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Timeline */}
        {experiences.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-orange-700/70 text-xl mb-4">No experience entries yet</div>
            <p className="text-orange-600/70">Experience entries will appear here once added through the admin panel.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-300 via-orange-400 to-orange-500"></div>
            
            <div className="space-y-8">
              {experiences.map((item, index) => {
                const icon = getTypeIcon(item.type, item.icon)
                const isCustomIcon = item.icon && !icon.startsWith('💼') && !icon.startsWith('🎓') && !icon.startsWith('🚀')
                
                return (
                  <div key={item.id || index} className="relative flex items-start gap-6">
                    {/* Timeline dot */}
                    <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${getTypeColor(item.type)} flex items-center justify-center shadow-lg border-4 border-white`}>
                      {isCustomIcon ? (
                        <Image
                          src={icon}
                          alt={item.type}
                          width={32}
                          height={32}
                          className="object-contain"
                          unoptimized
                          onError={(e) => {
                            // Fallback to emoji if image fails
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              const fallback = document.createElement('span')
                              fallback.className = 'text-2xl'
                              fallback.textContent = getTypeIcon(item.type)
                              parent.appendChild(fallback)
                            }
                          }}
                        />
                      ) : (
                        <span className="text-2xl">{icon}</span>
                      )}
                    </div>

                    {/* Content card */}
                    <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-orange-200/30 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getTypeColor(item.type)} text-white`}>
                              {item.type.toUpperCase()}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-1">{item.title}</h3>
                          {item.organization && (
                            <p className="text-lg text-orange-600 font-semibold">{item.organization}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-gray-600 mb-4">
                        <div className="flex items-center gap-4 text-sm mb-2">
                          <span className="flex items-center gap-1">
                            <span>📅</span>
                            <span>
                              {formatDate(item.startDate)}
                              {item.endDate ? ` - ${formatDate(item.endDate)}` : ' - Present'}
                            </span>
                          </span>
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <span>📍</span>
                              <span>{item.location}</span>
                            </span>
                          )}
                        </div>
                        <div 
                          className="text-gray-700 leading-relaxed experience-rich-text"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

