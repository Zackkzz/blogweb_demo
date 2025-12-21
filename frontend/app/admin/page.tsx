'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface BlogPost {
  title: string
  content: string
  date: string
}

interface Project {
  title: string
  description: string
  link: string
}

interface AboutData {
  title: string
  content: string
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<'about' | 'blog' | 'projects' | 'account'>('about')
  
  // Account settings
  const [currentPassword, setCurrentPassword] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  
  // About data
  const [aboutData, setAboutData] = useState<AboutData>({ title: '', content: '' })
  
  // Blog data
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [editingBlogIndex, setEditingBlogIndex] = useState<number | null>(null)
  const [newBlog, setNewBlog] = useState<BlogPost>({ title: '', content: '', date: new Date().toISOString().split('T')[0] })
  
  // Projects data
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null)
  const [newProject, setNewProject] = useState<Project>({ title: '', description: '', link: '' })
  
  const [message, setMessage] = useState('')
  const router = useRouter()

  const verifyToken = async (token: string) => {
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      const data = await res.json()
      if (data.valid) {
        setIsLoggedIn(true)
        loadData()
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      localStorage.removeItem('token')
    }
  }

  const loadData = async () => {
    try {
      const res = await fetch('/api/content')
      const data = await res.json()
      
      if (data.about) {
        setAboutData(data.about)
      }
      if (Array.isArray(data.blog)) {
        setBlogPosts(data.blog)
      }
      if (Array.isArray(data.projects)) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      setMessage('Failed to load data')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      
      if (res.ok) {
        localStorage.setItem('token', data.token)
        setIsLoggedIn(true)
        loadData()
      } else {
        setLoginError(data.error || 'Login failed')
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setAboutData({ title: '', content: '' })
    setBlogPosts([])
    setProjects([])
  }

  const handleSaveAbout = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'about',
          data: aboutData,
          action: 'update'
        })
      })
      
      if (res.ok) {
        setMessage('About page saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to save about page')
      }
    } catch (error) {
      setMessage('Error saving about page')
    }
  }

  const handleAddBlog = async () => {
    if (!newBlog.title || !newBlog.content) {
      setMessage('Please fill in title and content')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'blog',
          data: newBlog,
          action: 'add'
        })
      })
      
      if (res.ok) {
        setBlogPosts([...blogPosts, newBlog])
        setNewBlog({ title: '', content: '', date: new Date().toISOString().split('T')[0] })
        setMessage('Blog post added successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to add blog post')
      }
    } catch (error) {
      setMessage('Error adding blog post')
    }
  }

  const handleUpdateBlog = async (index: number) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'blog',
          data: blogPosts[index],
          action: 'update',
          index
        })
      })
      
      if (res.ok) {
        setEditingBlogIndex(null)
        setMessage('Blog post updated successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to update blog post')
      }
    } catch (error) {
      setMessage('Error updating blog post')
    }
  }

  const handleDeleteBlog = async (index: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'blog',
          action: 'delete',
          index
        })
      })
      
      if (res.ok) {
        setBlogPosts(blogPosts.filter((_, i) => i !== index))
        setMessage('Blog post deleted successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to delete blog post')
      }
    } catch (error) {
      setMessage('Error deleting blog post')
    }
  }

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description) {
      setMessage('Please fill in title and description')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'projects',
          data: newProject,
          action: 'add'
        })
      })
      
      if (res.ok) {
        setProjects([...projects, newProject])
        setNewProject({ title: '', description: '', link: '' })
        setMessage('Project added successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to add project')
      }
    } catch (error) {
      setMessage('Error adding project')
    }
  }

  const handleUpdateProject = async (index: number) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'projects',
          data: projects[index],
          action: 'update',
          index
        })
      })
      
      if (res.ok) {
        setEditingProjectIndex(null)
        setMessage('Project updated successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to update project')
      }
    } catch (error) {
      setMessage('Error updating project')
    }
  }

  const handleDeleteProject = async (index: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'projects',
          action: 'delete',
          index
        })
      })
      
      if (res.ok) {
        setProjects(projects.filter((_, i) => i !== index))
        setMessage('Project deleted successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to delete project')
      }
    } catch (error) {
      setMessage('Error deleting project')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto p-8 max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Username or Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                required
              />
            </div>
            {loginError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {loginError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('successfully') 
            ? 'bg-green-100 text-green-700 border border-green-400' 
            : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('about')}
            className={`py-2 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`py-2 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'blog'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Blog
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'projects'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Projects
          </button>
        </div>
      </div>

      {/* About Tab */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Edit About Page</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              value={aboutData.title}
              onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Content</label>
            <textarea
              value={aboutData.content}
              onChange={(e) => setAboutData({ ...aboutData, content: e.target.value })}
              rows={10}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
            />
          </div>
          <button
            onClick={handleSaveAbout}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save About Page
          </button>
        </div>
      )}

      {/* Blog Tab */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          {/* Add New Blog Post */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Blog Post</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input
                type="text"
                value={newBlog.title}
                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Content</label>
              <textarea
                value={newBlog.content}
                onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                rows={6}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Date</label>
              <input
                type="date"
                value={newBlog.date}
                onChange={(e) => setNewBlog({ ...newBlog, date: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
              />
            </div>
            <button
              onClick={handleAddBlog}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Blog Post
            </button>
          </div>

          {/* Existing Blog Posts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Existing Blog Posts</h2>
            {blogPosts.length === 0 ? (
              <p className="text-gray-500">No blog posts yet. Add one above!</p>
            ) : (
              <div className="space-y-4">
                {blogPosts.map((post, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    {editingBlogIndex === index ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={post.title}
                          onChange={(e) => {
                            const updated = [...blogPosts]
                            updated[index].title = e.target.value
                            setBlogPosts(updated)
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black font-bold text-xl"
                        />
                        <textarea
                          value={post.content}
                          onChange={(e) => {
                            const updated = [...blogPosts]
                            updated[index].content = e.target.value
                            setBlogPosts(updated)
                          }}
                          rows={4}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                        />
                        <input
                          type="date"
                          value={post.date}
                          onChange={(e) => {
                            const updated = [...blogPosts]
                            updated[index].date = e.target.value
                            setBlogPosts(updated)
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateBlog(index)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingBlogIndex(null)
                              loadData()
                            }}
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                        <p className="text-gray-700 mb-4">{post.content}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingBlogIndex(index)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(index)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Add New Project */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Link</label>
              <input
                type="url"
                value={newProject.link}
                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="https://example.com"
              />
            </div>
            <button
              onClick={handleAddProject}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Project
            </button>
          </div>

          {/* Existing Projects */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Existing Projects</h2>
            {projects.length === 0 ? (
              <p className="text-gray-500">No projects yet. Add one above!</p>
            ) : (
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    {editingProjectIndex === index ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => {
                            const updated = [...projects]
                            updated[index].title = e.target.value
                            setProjects(updated)
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black font-bold text-xl"
                        />
                        <textarea
                          value={project.description}
                          onChange={(e) => {
                            const updated = [...projects]
                            updated[index].description = e.target.value
                            setProjects(updated)
                          }}
                          rows={4}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                        />
                        <input
                          type="url"
                          value={project.link}
                          onChange={(e) => {
                            const updated = [...projects]
                            updated[index].link = e.target.value
                            setProjects(updated)
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateProject(index)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingProjectIndex(null)
                              loadData()
                            }}
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        <p className="text-gray-700 mb-2">{project.description}</p>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {project.link}
                          </a>
                        )}
                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() => setEditingProjectIndex(index)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(index)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
          <form onSubmit={async (e) => {
            e.preventDefault()
            try {
              const token = localStorage.getItem('token')
              const res = await fetch('/api/auth/update', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  currentPassword,
                  newUsername: newUsername || undefined,
                  newPassword: newPassword || undefined,
                  newEmail: newEmail || undefined
                })
              })
              
              const data = await res.json()
              if (res.ok) {
                setMessage('Account updated successfully!')
                setCurrentPassword('')
                setNewUsername('')
                setNewPassword('')
                setNewEmail('')
                setTimeout(() => setMessage(''), 3000)
              } else {
                setMessage(data.error || 'Failed to update account')
              }
            } catch (error) {
              setMessage('Error updating account')
            }
          }}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Current Password *</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                required
                placeholder="Enter current password to make changes"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">New Username (optional)</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="Leave empty to keep current username"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">New Password (optional)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="Leave empty to keep current password"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">New Email (optional)</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="Leave empty to keep current email"
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Update Account
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

