'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

interface Course {
  name: string
  score?: number
}

interface EducationItem {
  id: string
  degree: string
  fieldOfStudy: string
  institution: string
  startDate: string
  endDate?: string
  description: string
  activities?: string[]
  courses?: Course[]
  icon?: string
  location?: string
  wam?: number
  isCurrentWam?: boolean
}

interface EducationData {
  title: string
  description: string
  items: EducationItem[]
}

export default function Education() {
  const [educationData, setEducationData] = useState<EducationData>({ 
    title: 'Education', 
    description: '',
    items: []
  })
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    fetch('/api/content')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch content')
        }
        return res.json()
      })
      .then(data => {
        if (data && data.education) {
          // Ensure items is always an array and convert courses from string[] to Course[] if needed
          const education = data.education
          if (!Array.isArray(education.items)) {
            // Migrate from old format or ensure items exists
            education.items = []
          }
          const educationItems = education.items.map((item: any) => {
            if (item.courses && Array.isArray(item.courses)) {
              const courses = item.courses.map((c: any) => {
                if (typeof c === 'string') {
                  return { name: c }
                }
                return c
              })
              return { ...item, courses }
            }
            return item
          })
          setEducationData({
            title: education.title || 'Education',
            description: education.description || '',
            items: educationItems
          })
        } else {
          setEducationData({ title: 'Education', description: '', items: [] })
        }
      })
      .catch(error => {
        console.error('Error fetching education content:', error);
        setEducationData({ title: 'Education', description: 'Content is loading...', items: [] })
      })
  }, [])

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

  const scrollToSection = (itemId: string) => {
    const element = sectionRefs.current[itemId]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Sort items by start date (most recent first)
  const sortedItems = Array.isArray(educationData.items) 
    ? [...educationData.items].sort((a, b) => {
        const dateA = new Date(a.startDate).getTime()
        const dateB = new Date(b.startDate).getTime()
        return dateB - dateA
      })
    : []

  return (
    <div className="sunlight-page-bg py-12 px-4 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-orange-900/90 mb-4">
            {educationData.title || 'Education'}
          </h1>
          {educationData.description && (
            <p className="text-xl text-orange-800/80 mb-4">{educationData.description}</p>
          )}
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mx-auto"></div>
        </div>

        {/* Part 1: Academic Journey Roadmap */}
        {sortedItems.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-orange-900/90 mb-4">Academic Journey</h2>
              <p className="text-lg text-orange-700/80 italic">
                You can click the link to the relevant place.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mx-auto mt-4"></div>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-300 via-orange-400 to-orange-500"></div>
              
              <div className="space-y-8">
                {sortedItems.map((item, index) => {
                  const itemId = item.id || `item-${index}`
                  const isCustomIcon = item.icon && !item.icon.startsWith('💼') && !item.icon.startsWith('🎓') && !item.icon.startsWith('🚀')
                  
                  return (
                    <div key={itemId} className="relative flex items-start gap-6">
                      {/* Timeline dot with icon */}
                      <div 
                        className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg border-4 border-white cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => scrollToSection(itemId)}
                      >
                        {isCustomIcon && item.icon ? (
                          <Image
                            src={item.icon}
                            alt="Education Icon"
                            width={32}
                            height={32}
                            className="object-contain"
                            unoptimized
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              const parent = target.parentElement
                              if (parent) {
                                const fallback = document.createElement('span')
                                fallback.className = 'text-2xl'
                                fallback.textContent = '🎓'
                                parent.appendChild(fallback)
                              }
                            }}
                          />
                        ) : (
                          <span className="text-2xl">🎓</span>
                        )}
                      </div>

                      {/* Content card - clickable */}
                      <div 
                        className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-orange-200/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
                        onClick={() => scrollToSection(itemId)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-2xl font-bold text-orange-900/90">
                                {item.degree} in {item.fieldOfStudy}
                              </h3>
                            </div>
                            <p className="text-lg text-orange-600 font-semibold mb-2">{item.institution}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
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
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Part 2: Detailed Information Sections */}
        {sortedItems.length > 0 && (
          <div className="space-y-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-orange-900/90 mb-4">Detailed Information</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mx-auto"></div>
            </div>

            {sortedItems.map((item, index) => {
              const itemId = item.id || `item-${index}`
              
              return (
                <div
                  key={itemId}
                  ref={(el) => { sectionRefs.current[itemId] = el }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-orange-200/30 scroll-mt-20"
                >
                  {/* Header */}
                  <div className="flex items-start gap-6 mb-8 pb-6 border-b border-orange-200/30">
                    {item.icon && (
                      <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100 p-2 border-4 border-white shadow-lg">
                        <div className="relative w-full h-full rounded-lg overflow-hidden">
                          <Image
                            src={item.icon}
                            alt="Education Icon"
                            fill
                            className="object-contain"
                            unoptimized
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-3xl font-bold text-orange-900/90">
                          {item.degree}
                        </h3>
                        <span className="text-2xl text-orange-600">in</span>
                        <h3 className="text-3xl font-bold text-orange-900/90">
                          {item.fieldOfStudy}
                        </h3>
                      </div>
                      <p className="text-xl text-orange-600 font-semibold mb-2">{item.institution}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
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
                    </div>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <div className="mb-8">
                      <h4 className="text-xl font-bold text-orange-900/90 mb-3">Overview</h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{item.description}</p>
                    </div>
                  )}

                  {/* Activities */}
                  {item.activities && item.activities.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xl font-bold text-orange-900/90 mb-4">Activities</h4>
                      <ul className="space-y-2">
                        {item.activities.map((activity, actIndex) => (
                          <li key={actIndex} className="flex items-start gap-3">
                            <span className="text-orange-500 mt-1">•</span>
                            <span className="text-gray-700 flex-1">{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Courses and WAM */}
                  {item.courses && item.courses.length > 0 && (
                    <div>
                      <h4 className="text-xl font-bold text-orange-900/90 mb-4">Relevant Courses</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {item.courses.map((course, courseIndex) => {
                          const courseName = typeof course === 'string' ? course : course.name
                          const courseScore = typeof course === 'object' ? course.score : undefined
                          return (
                            <div key={courseIndex} className="bg-orange-50/50 rounded-lg p-3 border border-orange-200/30 flex items-center justify-between">
                              <span className="text-gray-700 flex-1">{courseName}</span>
                              {courseScore !== undefined && courseScore !== null && (
                                <span className="ml-3 px-2 py-1 bg-orange-200/50 rounded text-orange-800 font-semibold text-sm">
                                  {courseScore}
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      {/* Total WAM below courses */}
                      {item.wam !== undefined && item.wam !== null && (
                        <div className="mt-4 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200/50">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-orange-900/90">Weighted Average Mark (WAM)</h4>
                            {item.isCurrentWam && (
                              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-orange-600">{item.wam.toFixed(1)}</span>
                            <span className="text-gray-600">/ 100</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {sortedItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-orange-700/70 text-xl mb-4">No education entries yet</div>
            <p className="text-orange-600/70">Education entries will appear here once added through the admin panel.</p>
          </div>
        )}
      </div>
    </div>
  )
}
