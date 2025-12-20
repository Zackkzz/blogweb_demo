'use client'

import { useEffect, useState } from 'react'

export default function Projects() {
  const [projects, setProjects] = useState([] as Array<{ title: string; description: string; link: string }>)

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setProjects(data.projects))
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Projects</h1>
      {projects.map((project, index) => (
        <div key={index} className="mb-4 border p-4 rounded">
          <h2 className="text-2xl">{project.title}</h2>
          <p>{project.description}</p>
          <a href={project.link} className="text-blue-500">View Project</a>
        </div>
      ))}
    </div>
  )
}