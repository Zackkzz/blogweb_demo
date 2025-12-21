'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import RichTextEditor from '@/components/RichTextEditor'

interface BlogPost {
  id?: string
  title: string
  content: string
  date: string
}

interface Project {
  title: string
  description: string
  link: string
  image?: string
}

interface AboutData {
  title: string
  content: string
  photo?: string
  name?: string
  position?: string
  email?: string
  phone?: string
  location?: string
  summary?: string
}

interface HomeData {
  title: string
  content: string
  backgroundImage?: string
}

interface ContactInfo {
  email: string
  github: string
  linkedin: string
  twitter: string
  website: string
}

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

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'blog' | 'projects' | 'contact' | 'account' | 'experience' | 'education'>('home')
  
  // Account settings
  const [currentPassword, setCurrentPassword] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  
  // Home data
  const [homeData, setHomeData] = useState<HomeData>({ title: '', content: '', backgroundImage: '' })
  const [homeBgPreview, setHomeBgPreview] = useState<string>('')
  const [homeBgFile, setHomeBgFile] = useState<File | null>(null)
  
  // About data
  const [aboutData, setAboutData] = useState<AboutData>({ 
    title: '', 
    content: '',
    name: '',
    position: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    photo: ''
  })
  const [aboutPhotoPreview, setAboutPhotoPreview] = useState<string>('')
  const [aboutPhotoFile, setAboutPhotoFile] = useState<File | null>(null)
  
  // Contact data
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    github: '',
    linkedin: '',
    twitter: '',
    website: ''
  })
  
  // Blog data
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [editingBlogIndex, setEditingBlogIndex] = useState<number | null>(null)
  const [newBlog, setNewBlog] = useState<BlogPost>({ title: '', content: '', date: new Date().toISOString().split('T')[0] })
  
  // Projects data
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null)
  const [newProject, setNewProject] = useState<Project>({ title: '', description: '', link: '', image: '' })
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  // Experience data
  const [experiences, setExperiences] = useState<ExperienceItem[]>([])
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null)
  const [newExperience, setNewExperience] = useState<ExperienceItem>({
    id: '',
    type: 'work',
    title: '',
    organization: '',
    description: '',
    startDate: '',
    endDate: '',
    icon: '',
    location: ''
  })
  const [experienceIconPreview, setExperienceIconPreview] = useState<string>('')
  const [experienceIconFile, setExperienceIconFile] = useState<File | null>(null)
  
  // Education data
  const [educationData, setEducationData] = useState<EducationData>({
    title: 'Education',
    description: '',
    items: []
  })
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null)
  const [newEducation, setNewEducation] = useState<EducationItem>({
    id: '',
    degree: '',
    fieldOfStudy: '',
    institution: '',
    startDate: '',
    endDate: '',
    description: '',
    activities: [],
    courses: [],
    icon: '',
    location: '',
    wam: undefined,
    isCurrentWam: false
  })
  const [newCourseName, setNewCourseName] = useState('')
  const [newCourseScore, setNewCourseScore] = useState('')
  const [educationIconPreview, setEducationIconPreview] = useState<string>('')
  const [educationIconFile, setEducationIconFile] = useState<File | null>(null)
  
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
      
      if (data.home) {
        setHomeData(data.home)
        if (data.home.backgroundImage) {
          setHomeBgPreview(data.home.backgroundImage)
        }
      }
      if (data.about) {
        setAboutData(data.about)
        if (data.about.photo) {
          setAboutPhotoPreview(data.about.photo)
        }
      }
      if (data.education) {
        // Convert courses from string[] to Course[] if needed
        const educationItems = (data.education.items || []).map((item: any) => {
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
          ...data.education, 
          items: educationItems,
          description: data.education.description || ''
        })
        // If content is empty, set default UNSW content
        if (!data.education.content || data.education.content.trim() === '') {
          const defaultContent = `<h2>Bachelor of Science in Computer Science</h2>
<p><strong>University of New South Wales (UNSW)</strong></p>
<p>Currently pursuing a Bachelor of Science in Computer Science at the University of New South Wales, one of Australia's leading research universities.</p>

<h3>Program Overview</h3>
<p>This comprehensive program provides a strong foundation in computer science fundamentals, including:</p>
<ul>
  <li>Data structures and algorithms</li>
  <li>Software engineering principles</li>
  <li>Programming languages and paradigms</li>
  <li>Database systems</li>
  <li>Computer networks and security</li>
  <li>Artificial intelligence and machine learning</li>
</ul>

<h3>Key Learning Areas</h3>
<p>The curriculum emphasizes both theoretical understanding and practical application, preparing students for careers in software development, research, and technology innovation.</p>

<p><em>Note: This is a default template. Please customize with your specific details, achievements, and experiences.</em></p>`
          setEducationData({ ...data.education, content: defaultContent })
        }
      }
      if (Array.isArray(data.blog)) {
        setBlogPosts(data.blog)
      }
      if (Array.isArray(data.projects)) {
        setProjects(data.projects)
      }
      if (data.contact) {
        setContactInfo(data.contact)
      }
      if (Array.isArray(data.experience)) {
        setExperiences(data.experience)
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
    setAboutData({ 
      title: '', 
      content: '',
      name: '',
      position: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      photo: ''
    })
    setBlogPosts([])
    setProjects([])
  }

  const handleSaveAbout = async () => {
    try {
      let photoUrl = aboutData.photo || ''
      
      // Upload photo file if provided
      if (aboutPhotoFile) {
        const formData = new FormData()
        formData.append('image', aboutPhotoFile)
        formData.append('directory', 'profile')
        
        try {
          const token = localStorage.getItem('token')
          const uploadRes = await fetch('/api/upload', {
        method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          })
          
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json()
            photoUrl = uploadData.url
          } else {
            const errorData = await uploadRes.json()
            setMessage(errorData.error || 'Failed to upload photo')
            return
          }
    } catch (error) {
          console.error('Error uploading photo:', error)
          setMessage('Failed to upload photo')
          return
        }
      }
      
      const aboutToSave = { ...aboutData, photo: photoUrl }
      
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'about',
          data: aboutToSave,
          action: 'update'
        })
      })
      
      if (res.ok) {
        setAboutData(aboutToSave)
        setAboutPhotoPreview(photoUrl)
        setAboutPhotoFile(null)
        setMessage('About page saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to save about page')
      }
    } catch (error) {
      setMessage('Error saving about page')
    }
  }

  const handleSaveContact = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'contact',
          data: contactInfo
        })
      })
      
      if (res.ok) {
        setMessage('Contact information saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to save contact information')
      }
    } catch (error) {
      console.error('Error saving contact:', error)
      setMessage('Error saving contact information')
    }
  }

  const handleSaveEducation = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'education',
          data: educationData,
          action: 'update'
        })
      })
      
      if (res.ok) {
        setMessage('Education page settings saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to save education page settings')
      }
    } catch (error) {
      setMessage('Error saving education page settings')
    }
  }

  const handleAddEducation = async () => {
    try {
      let iconUrl = newEducation.icon || ''

      if (educationIconFile) {
        const formData = new FormData()
        formData.append('image', educationIconFile)
        formData.append('directory', 'education')
        
        try {
          const token = localStorage.getItem('token')
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          })
          
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json()
            iconUrl = uploadData.url
          } else {
            const errorData = await uploadRes.json()
            setMessage(errorData.error || 'Failed to upload icon')
            return
          }
        } catch (error) {
          console.error('Error uploading icon:', error)
          setMessage('Failed to upload icon')
          return
        }
      }

      const coursesArray: Course[] = (newEducation.courses || []).map(c => {
        if (typeof c === 'string') {
          return { name: c }
        }
        return c
      }).filter(c => c.name && c.name.trim())

      const educationToAdd: EducationItem = {
        ...newEducation,
        id: newEducation.id || Date.now().toString(),
        activities: newEducation.activities?.filter(a => a.trim()) || [],
        courses: coursesArray,
        icon: iconUrl || undefined
      }
      
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'education',
          data: { ...educationData, items: [...educationData.items, educationToAdd] },
          action: 'update'
        })
      })
      
      if (res.ok) {
        setEducationData({ ...educationData, items: [...educationData.items, educationToAdd] })
        setNewEducation({
          id: '',
          degree: '',
          fieldOfStudy: '',
          institution: '',
          startDate: '',
          endDate: '',
          description: '',
          activities: [],
          courses: [],
          icon: '',
          location: '',
          wam: undefined,
          isCurrentWam: false
        })
        setEducationIconFile(null)
        setEducationIconPreview('')
        setMessage('Education item added successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to add education item')
      }
    } catch (error) {
      setMessage('Error adding education item')
    }
  }

  const handleUpdateEducation = async (index: number) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'education',
          data: educationData,
          action: 'update'
        })
      })
      
      if (res.ok) {
        setEditingEducationIndex(null)
        setMessage('Education item updated successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to update education item')
      }
    } catch (error) {
      setMessage('Error updating education item')
    }
  }

  const handleDeleteEducation = async (index: number) => {
    if (!confirm('Are you sure you want to delete this education item?')) return
    
    try {
      const updatedItems = educationData.items.filter((_, i) => i !== index)
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'education',
          data: { ...educationData, items: updatedItems },
          action: 'update'
        })
      })
      
      if (res.ok) {
        setEducationData({ ...educationData, items: updatedItems })
        setMessage('Education item deleted successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to delete education item')
      }
    } catch (error) {
      setMessage('Error deleting education item')
    }
  }

  const handleAddBlog = async () => {
    if (!newBlog.title || !newBlog.content) {
      setMessage('Please fill in title and content')
      return
    }
    
    try {
      // Generate slug from title if id is not provided
      const generateSlug = (title: string) => {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `post-${Date.now()}`
      }
      
      const blogToAdd = {
        ...newBlog,
        id: newBlog.id || generateSlug(newBlog.title)
      }
      
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'blog',
          data: blogToAdd,
          action: 'add'
        })
      })
      
      if (res.ok) {
        setBlogPosts([...blogPosts, blogToAdd])
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
      let imageUrl = newProject.image || ''
      
      // If no image provided but link exists, try to get favicon
      if (!imageUrl && newProject.link) {
        try {
          const faviconRes = await fetch(`/api/favicon?url=${encodeURIComponent(newProject.link)}`)
          const faviconData = await faviconRes.json()
          if (faviconData.favicon) {
            imageUrl = faviconData.favicon
          }
        } catch (error) {
          console.error('Error fetching favicon:', error)
        }
      }
      
      // If image file is uploaded, upload it first
      if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)
        
        try {
          const token = localStorage.getItem('token')
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          })
          
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json()
            imageUrl = uploadData.url
          }
        } catch (error) {
          console.error('Error uploading image:', error)
        }
      }
      
      const projectToAdd = { ...newProject, image: imageUrl }
      
      const token = localStorage.getItem('token')
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'projects',
          data: projectToAdd,
          action: 'add'
        })
      })
      
      if (res.ok) {
        setProjects([...projects, projectToAdd])
        setNewProject({ title: '', description: '', link: '', image: '' })
        setImagePreview('')
        setImageFile(null)
        setMessage('Project added successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to add project')
      }
    } catch (error) {
      setMessage('Error adding project')
    }
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleGetFavicon = async () => {
    if (!newProject.link) {
      setMessage('Please enter a link first')
      return
    }
    
    try {
      const res = await fetch(`/api/favicon?url=${encodeURIComponent(newProject.link)}`)
      const data = await res.json()
      if (data.favicon) {
        setNewProject({ ...newProject, image: data.favicon })
        setImagePreview(data.favicon)
        setMessage('Favicon loaded successfully!')
        setTimeout(() => setMessage(''), 2000)
      }
    } catch (error) {
      setMessage('Failed to get favicon')
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
      <div className="sunlight-page-bg min-h-screen flex items-center justify-center p-8">
        <div className="container max-w-md">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-orange-200/30">
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
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 px-4 rounded-md hover:from-orange-600 hover:to-amber-600 transition-colors font-semibold"
            >
              Login
            </button>
        </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sunlight-page-bg min-h-screen">
      <div className="container mx-auto p-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-900/90">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors shadow-md"
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
      <div className="mb-6 border-b border-orange-200/40">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('about')}
            className={`py-2 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-orange-700/70 hover:text-orange-800'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`py-2 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'blog'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-orange-700/70 hover:text-orange-800'
            }`}
          >
            Blog
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'projects'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-orange-700/70 hover:text-orange-800'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`py-2 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'education'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-orange-700/70 hover:text-orange-800'
            }`}
          >
            Education
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-2 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'contact'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-orange-700/70 hover:text-orange-800'
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`py-2 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'account'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-orange-700/70 hover:text-orange-800'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`py-2 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'experience'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-orange-700/70 hover:text-orange-800'
            }`}
          >
            Experience
          </button>
        </div>
      </div>

      {/* Home Tab */}
      {activeTab === 'home' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Home Page</h2>
          
          {/* Background Image Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-gray-700 font-semibold mb-3">Home Background Image</label>
            <div className="mb-3">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-orange-900 mb-2">📐 Recommended Format and Dimensions:</p>
                <ul className="text-sm text-orange-800 space-y-1 ml-4">
                  <li>• <strong>Resolution</strong>: 3840 x 2160 (4K) or 2560 x 1440 (2K)</li>
                  <li>• <strong>Aspect Ratio</strong>: 16:9 (landscape)</li>
                  <li>• <strong>Format</strong>: JPEG or WebP</li>
                  <li>• <strong>Quality</strong>: 85-95%</li>
                  <li>• <strong>File Size</strong>: Recommended &lt; 10MB</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-shrink-0">
                {homeBgPreview ? (
                  <div className="relative w-64 h-36 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md">
                    <img 
                      src={homeBgPreview} 
                      alt="Background preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-64 h-36 rounded-lg bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                    <span className="text-gray-400">No preview</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  value={homeData.backgroundImage || ''}
                  onChange={(e) => {
                    setHomeData({ ...homeData, backgroundImage: e.target.value })
                    setHomeBgPreview(e.target.value)
                  }}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black mb-2"
                  placeholder="Background image URL (e.g., /scroll/image.jpg)"
                />
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/webp,image/png"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setHomeBgFile(file)
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setHomeBgPreview(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                />
                <p className="text-sm text-gray-500 mt-2">
                  💡 Tip: Uploaded images will be automatically saved to the <code className="bg-gray-100 px-1 rounded">/scroll/</code> directory
                </p>
              </div>
            </div>
          </div>

      <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              value={homeData.title || ''}
              onChange={(e) => setHomeData({ ...homeData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
              placeholder="Home page title"
            />
      </div>
      
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Content</label>
            <RichTextEditor
              value={homeData.content || ''}
              onChange={(value) => setHomeData({ ...homeData, content: value })}
              placeholder="Home page content"
            />
          </div>
          
          <button
            onClick={async () => {
              try {
                let bgImageUrl = homeData.backgroundImage || ''
                
                // Upload background image file if provided
                if (homeBgFile) {
                  const formData = new FormData()
                  formData.append('image', homeBgFile)
                  formData.append('directory', 'scroll') // Upload to scroll directory
                  
                  try {
                    const token = localStorage.getItem('token')
                    const uploadRes = await fetch('/api/upload', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`
                      },
                      body: formData
                    })
                    
                    if (uploadRes.ok) {
                      const uploadData = await uploadRes.json()
                      bgImageUrl = uploadData.url
                    } else {
                      const errorData = await uploadRes.json()
                      setMessage(errorData.error || 'Failed to upload background image')
                      return
                    }
                  } catch (error) {
                    console.error('Error uploading background image:', error)
                    setMessage('Failed to upload background image')
                    return
                  }
                }
                
                const token = localStorage.getItem('token')
                const res = await fetch('/api/content', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    section: 'home',
                    data: { ...homeData, backgroundImage: bgImageUrl },
                    action: 'update'
                  })
                })
                
                if (res.ok) {
                  setHomeData({ ...homeData, backgroundImage: bgImageUrl })
                  setHomeBgPreview(bgImageUrl)
                  setHomeBgFile(null)
                  setMessage('Home page saved successfully!')
                  setTimeout(() => setMessage(''), 3000)
                } else {
                  setMessage('Failed to save home page')
                }
              } catch (error) {
                setMessage('Error saving home page')
              }
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Home Page
          </button>
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Edit About Page (Resume Style)</h2>
          
          {/* Photo Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-gray-700 font-semibold mb-3">Profile Photo</label>
            <div className="mb-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">📐 Recommended Format and Dimensions:</p>
                <ul className="text-sm text-blue-800 space-y-1 ml-4">
                  <li>• <strong>Resolution</strong>: 400 x 400 or larger (square)</li>
                  <li>• <strong>Aspect Ratio</strong>: 1:1 (square, recommended)</li>
                  <li>• <strong>Format</strong>: JPEG, PNG, or WebP</li>
                  <li>• <strong>Quality</strong>: 85-95%</li>
                  <li>• <strong>File Size</strong>: Recommended &lt; 2MB</li>
                  <li>• <strong>Recommendation</strong>: Use clear profile photos with simple backgrounds</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-shrink-0">
                {aboutPhotoPreview || aboutData.photo ? (
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden border-4 border-white shadow-lg">
                    <img 
                      src={aboutPhotoPreview || aboutData.photo || ''} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 rounded-lg bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-6xl">👤</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  value={aboutData.photo || ''}
                  onChange={(e) => {
                    setAboutData({ ...aboutData, photo: e.target.value })
                    setAboutPhotoPreview(e.target.value)
                  }}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black mb-2"
                  placeholder="Photo URL (e.g., /profile.jpg)"
                />
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setAboutPhotoFile(file)
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setAboutPhotoPreview(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                />
                <p className="text-sm text-gray-500 mt-2">
                  💡 Tip: Uploaded images will be automatically saved, or use the <code className="bg-gray-100 px-1 rounded">/profile.jpg</code> path
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
            <input
              type="text"
              value={aboutData.name || ''}
              onChange={(e) => setAboutData({ ...aboutData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
              placeholder="Your full name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Position/Title</label>
            <input
              type="text"
              value={aboutData.position || ''}
              onChange={(e) => setAboutData({ ...aboutData, position: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
              placeholder="e.g., Software Engineer, Full Stack Developer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={aboutData.email || ''}
                onChange={(e) => setAboutData({ ...aboutData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone</label>
              <input
                type="tel"
                value={aboutData.phone || ''}
                onChange={(e) => setAboutData({ ...aboutData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Location</label>
            <input
              type="text"
              value={aboutData.location || ''}
              onChange={(e) => setAboutData({ ...aboutData, location: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
              placeholder="City, Country"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Professional Summary</label>
              <textarea
              value={aboutData.summary || ''}
              onChange={(e) => setAboutData({ ...aboutData, summary: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
              placeholder="A brief professional summary (2-3 sentences)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Title (for page header)</label>
            <input
              type="text"
              value={aboutData.title}
              onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
              placeholder="About Me"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Detailed Content</label>
            <RichTextEditor
              value={aboutData.content}
              onChange={(value) => setAboutData({ ...aboutData, content: value })}
              placeholder="Write about your background, skills, experience, and interests..."
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
              <RichTextEditor
                value={newBlog.content}
                onChange={(value) => setNewBlog({ ...newBlog, content: value })}
                placeholder="Blog post content"
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
                        <RichTextEditor
                          value={post.content}
                          onChange={(value) => {
                            const updated = [...blogPosts]
                            updated[index].content = value
                            setBlogPosts(updated)
                          }}
                          placeholder="Blog post content"
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
                placeholder="https://example.com or https://github.com/username/repo"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Project Image</label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newProject.image || ''}
                    onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                    placeholder="Image URL (optional)"
                  />
                  {newProject.link && (
                    <button
                      type="button"
                      onClick={handleGetFavicon}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
                    >
                      Auto Get Logo
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Or upload image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-contain border border-gray-300 rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
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
                <p className="text-sm text-gray-600 mb-2">💡 Use ↑ and ↓ buttons to reorder projects. The order here will be displayed on the Projects page.</p>
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
                        <div className="mb-4">
                          <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                          <input
                            type="url"
                            value={project.image || ''}
                            onChange={(e) => {
                              const updated = [...projects]
                              updated[index].image = e.target.value
                              setProjects(updated)
                            }}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                            placeholder="Image URL (optional)"
                          />
                          {project.image && (
                            <img 
                              src={project.image} 
                              alt="Project" 
                              className="mt-2 w-32 h-32 object-contain border border-gray-300 rounded-md"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          )}
                        </div>
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
                        {project.image && (
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-24 h-24 object-contain border border-gray-300 rounded-md mb-3"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        )}
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
                            onClick={async () => {
                              if (index > 0) {
                                const updated = [...projects]
                                const temp = updated[index]
                                updated[index] = updated[index - 1]
                                updated[index - 1] = temp
                                setProjects(updated)
                                
                                // Save new order
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
                                      data: updated,
                                      action: 'update'
                                    })
                                  })
                                  
                                  if (res.ok) {
                                    setMessage('Order updated successfully!')
                                    setTimeout(() => setMessage(''), 2000)
                                  }
                                } catch (error) {
                                  setMessage('Error updating order')
                                }
                              }
                            }}
                            disabled={index === 0}
                            className={`px-3 py-2 rounded-md transition-colors ${
                              index === 0 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={async () => {
                              if (index < projects.length - 1) {
                                const updated = [...projects]
                                const temp = updated[index]
                                updated[index] = updated[index + 1]
                                updated[index + 1] = temp
                                setProjects(updated)
                                
                                // Save new order
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
                                      data: updated,
                                      action: 'update'
                                    })
                                  })
                                  
                                  if (res.ok) {
                                    setMessage('Order updated successfully!')
                                    setTimeout(() => setMessage(''), 2000)
                                  }
                                } catch (error) {
                                  setMessage('Error updating order')
                                }
                              }
                            }}
                            disabled={index === projects.length - 1}
                            className={`px-3 py-2 rounded-md transition-colors ${
                              index === projects.length - 1 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                            title="Move down"
                          >
                            ↓
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

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">GitHub</label>
              <input
                type="url"
                value={contactInfo.github}
                onChange={(e) => setContactInfo({ ...contactInfo, github: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="https://github.com/yourusername"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">LinkedIn</label>
              <input
                type="url"
                value={contactInfo.linkedin}
                onChange={(e) => setContactInfo({ ...contactInfo, linkedin: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="https://linkedin.com/in/yourusername"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Twitter</label>
              <input
                type="url"
                value={contactInfo.twitter}
                onChange={(e) => setContactInfo({ ...contactInfo, twitter: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="https://twitter.com/yourusername"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Website</label>
              <input
                type="url"
                value={contactInfo.website}
                onChange={(e) => setContactInfo({ ...contactInfo, website: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="https://yourwebsite.com"
              />
            </div>
            
            <button
              onClick={handleSaveContact}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Save Contact Information
            </button>
          </div>
        </div>
      )}

      {/* Education Tab */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          {/* Page Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Education Page Settings</h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input
                type="text"
                value={educationData.title}
                onChange={(e) => setEducationData({ ...educationData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="Education"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={educationData.description}
                onChange={(e) => setEducationData({ ...educationData, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="Brief description of your education journey..."
              />
            </div>
            
            <button
              onClick={handleSaveEducation}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>

          {/* Add New Education Item */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Education Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Degree *</label>
                <input
                  type="text"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                  placeholder="e.g., Bachelor of Science"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Field of Study *</label>
                <input
                  type="text"
                  value={newEducation.fieldOfStudy}
                  onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Institution *</label>
                <input
                  type="text"
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                  placeholder="University name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Location</label>
                <input
                  type="text"
                  value={newEducation.location || ''}
                  onChange={(e) => setNewEducation({ ...newEducation, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Start Date *</label>
                <input
                  type="date"
                  value={newEducation.startDate}
                  onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">End Date (leave empty for current)</label>
                <input
                  type="date"
                  value={newEducation.endDate || ''}
                  onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Description *</label>
              <RichTextEditor
                value={newEducation.description}
                onChange={(value) => setNewEducation({ ...newEducation, description: value })}
                placeholder="Describe your education experience..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Activities (one per line)</label>
              <textarea
                value={newEducation.activities?.join('\n') || ''}
                onChange={(e) => setNewEducation({ ...newEducation, activities: e.target.value.split('\n').filter(a => a.trim()) })}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="Enter activities, one per line"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">WAM (Weighted Average Mark)</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={newEducation.wam !== undefined ? newEducation.wam : ''}
                  onChange={(e) => setNewEducation({ ...newEducation, wam: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-32 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                  placeholder="Enter WAM (0-100)"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newEducation.isCurrentWam || false}
                    onChange={(e) => setNewEducation({ ...newEducation, isCurrentWam: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">Mark as Current WAM</span>
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1">Leave empty if you don't want to display WAM</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Courses</label>
              <div className="space-y-3 mb-3">
                {(newEducation.courses || []).map((course, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={typeof course === 'string' ? course : course.name}
                      onChange={(e) => {
                        const updated = [...(newEducation.courses || [])]
                        updated[idx] = typeof course === 'string' 
                          ? { name: e.target.value }
                          : { ...course, name: e.target.value }
                        setNewEducation({ ...newEducation, courses: updated })
                      }}
                      className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                      placeholder="Course name"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={typeof course === 'object' && course.score !== undefined ? course.score : ''}
                      onChange={(e) => {
                        const updated = [...(newEducation.courses || [])]
                        updated[idx] = typeof course === 'string'
                          ? { name: course, score: e.target.value ? parseFloat(e.target.value) : undefined }
                          : { ...course, score: e.target.value ? parseFloat(e.target.value) : undefined }
                        setNewEducation({ ...newEducation, courses: updated })
                      }}
                      className="w-24 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                      placeholder="Score"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (newEducation.courses || []).filter((_, i) => i !== idx)
                        setNewEducation({ ...newEducation, courses: updated })
                      }}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                  placeholder="Course name"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={newCourseScore}
                  onChange={(e) => setNewCourseScore(e.target.value)}
                  className="w-24 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                  placeholder="Score"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newCourseName.trim()) {
                      const newCourse: Course = {
                        name: newCourseName.trim(),
                        score: newCourseScore ? parseFloat(newCourseScore) : undefined
                      }
                      setNewEducation({ 
                        ...newEducation, 
                        courses: [...(newEducation.courses || []), newCourse] 
                      })
                      setNewCourseName('')
                      setNewCourseScore('')
                    }
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Add Course
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Icon</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setEducationIconFile(file)
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setEducationIconPreview(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                />
                {educationIconPreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Preview:</p>
                    <Image
                      src={educationIconPreview}
                      alt="Icon preview"
                      width={64}
                      height={64}
                      className="rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-500">Or enter URL:</p>
                <input
                  type="url"
                  value={newEducation.icon || ''}
                  onChange={(e) => setNewEducation({ ...newEducation, icon: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                  placeholder="Icon URL (optional)"
                />
              </div>
            </div>

            <button
              onClick={handleAddEducation}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Education Item
            </button>
          </div>

          {/* Existing Education Items */}
          {educationData.items.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Education Items</h2>
              <div className="space-y-4">
                {educationData.items.map((item, index) => (
                  <div key={item.id || index} className="border border-gray-300 rounded-lg p-4">
                    {editingEducationIndex === index ? (
                      <div className="space-y-4">
                        {/* Edit form - similar to add form but for existing item */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Degree *</label>
                            <input
                              type="text"
                              value={item.degree}
                              onChange={(e) => {
                                const updated = [...educationData.items]
                                updated[index].degree = e.target.value
                                setEducationData({ ...educationData, items: updated })
                              }}
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Field of Study *</label>
                            <input
                              type="text"
                              value={item.fieldOfStudy}
                              onChange={(e) => {
                                const updated = [...educationData.items]
                                updated[index].fieldOfStudy = e.target.value
                                setEducationData({ ...educationData, items: updated })
                              }}
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Institution *</label>
                            <input
                              type="text"
                              value={item.institution}
                              onChange={(e) => {
                                const updated = [...educationData.items]
                                updated[index].institution = e.target.value
                                setEducationData({ ...educationData, items: updated })
                              }}
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Location</label>
                            <input
                              type="text"
                              value={item.location || ''}
                              onChange={(e) => {
                                const updated = [...educationData.items]
                                updated[index].location = e.target.value
                                setEducationData({ ...educationData, items: updated })
                              }}
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Start Date *</label>
                            <input
                              type="date"
                              value={item.startDate}
                              onChange={(e) => {
                                const updated = [...educationData.items]
                                updated[index].startDate = e.target.value
                                setEducationData({ ...educationData, items: updated })
                              }}
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">End Date</label>
                            <input
                              type="date"
                              value={item.endDate || ''}
                              onChange={(e) => {
                                const updated = [...educationData.items]
                                updated[index].endDate = e.target.value
                                setEducationData({ ...educationData, items: updated })
                              }}
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Description *</label>
                          <RichTextEditor
                            value={item.description}
                            onChange={(value) => {
                              const updated = [...educationData.items]
                              updated[index].description = value
                              setEducationData({ ...educationData, items: updated })
                            }}
                            placeholder="Describe your education experience..."
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Activities (one per line)</label>
                          <textarea
                            value={item.activities?.join('\n') || ''}
                            onChange={(e) => {
                              const updated = [...educationData.items]
                              updated[index].activities = e.target.value.split('\n').filter(a => a.trim())
                              setEducationData({ ...educationData, items: updated })
                            }}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">WAM (Weighted Average Mark)</label>
                          <div className="flex items-center gap-4">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={item.wam !== undefined ? item.wam : ''}
                              onChange={(e) => {
                                const updated = [...educationData.items]
                                updated[index].wam = e.target.value ? parseFloat(e.target.value) : undefined
                                setEducationData({ ...educationData, items: updated })
                              }}
                              className="w-32 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                              placeholder="Enter WAM (0-100)"
                            />
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={item.isCurrentWam || false}
                                onChange={(e) => {
                                  const updated = [...educationData.items]
                                  updated[index].isCurrentWam = e.target.checked
                                  setEducationData({ ...educationData, items: updated })
                                }}
                                className="w-4 h-4"
                              />
                              <span className="text-gray-700">Mark as Current WAM</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Courses</label>
                          <div className="space-y-3 mb-3">
                            {(item.courses || []).map((course, courseIdx) => (
                              <div key={courseIdx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={typeof course === 'string' ? course : course.name}
                                  onChange={(e) => {
                                    const updated = [...educationData.items]
                                    updated[index].courses = (updated[index].courses || []).map((c, i) => 
                                      i === courseIdx 
                                        ? (typeof c === 'string' ? { name: e.target.value } : { ...c, name: e.target.value })
                                        : c
                                    )
                                    setEducationData({ ...educationData, items: updated })
                                  }}
                                  className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                                  placeholder="Course name"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                  value={typeof course === 'object' && course.score !== undefined ? course.score : ''}
                                  onChange={(e) => {
                                    const updated = [...educationData.items]
                                    updated[index].courses = (updated[index].courses || []).map((c, i) => 
                                      i === courseIdx
                                        ? (typeof c === 'string' 
                                            ? { name: c, score: e.target.value ? parseFloat(e.target.value) : undefined }
                                            : { ...c, score: e.target.value ? parseFloat(e.target.value) : undefined })
                                        : c
                                    )
                                    setEducationData({ ...educationData, items: updated })
                                  }}
                                  className="w-24 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                                  placeholder="Score"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...educationData.items]
                                    updated[index].courses = (updated[index].courses || []).filter((_, i) => i !== courseIdx)
                                    setEducationData({ ...educationData, items: updated })
                                  }}
                                  className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newCourseName}
                              onChange={(e) => setNewCourseName(e.target.value)}
                              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                              placeholder="Course name"
                            />
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={newCourseScore}
                              onChange={(e) => setNewCourseScore(e.target.value)}
                              className="w-24 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                              placeholder="Score"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newCourseName.trim()) {
                                  const updated = [...educationData.items]
                                  const newCourse: Course = {
                                    name: newCourseName.trim(),
                                    score: newCourseScore ? parseFloat(newCourseScore) : undefined
                                  }
                                  updated[index].courses = [...(updated[index].courses || []), newCourse]
                                  setEducationData({ ...educationData, items: updated })
                                  setNewCourseName('')
                                  setNewCourseScore('')
                                }
                              }}
                              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                            >
                              Add Course
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Icon URL</label>
                          <input
                            type="url"
                            value={item.icon || ''}
                            onChange={(e) => {
                              const updated = [...educationData.items]
                              updated[index].icon = e.target.value
                              setEducationData({ ...educationData, items: updated })
                            }}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                            placeholder="Icon URL (optional)"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateEducation(index)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingEducationIndex(null)}
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-lg font-bold">{item.degree} in {item.fieldOfStudy}</h4>
                            <p className="text-orange-600">{item.institution}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(item.startDate).toLocaleDateString()}
                              {item.endDate ? ` - ${new Date(item.endDate).toLocaleDateString()}` : ' - Present'}
                              {item.location && ` • ${item.location}`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingEducationIndex(index)}
                              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEducation(index)}
                              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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

      {/* Experience Tab */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          {/* Add New Experience */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Experience</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Type *</label>
              <select
                value={newExperience.type}
                onChange={(e) => setNewExperience({ ...newExperience, type: e.target.value as 'work' | 'education' | 'project' })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
              >
                <option value="work">Work</option>
                <option value="education">Education</option>
                <option value="project">Project</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Title *</label>
              <input
                type="text"
                value={newExperience.title}
                onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="e.g., Software Engineer, Bachelor's Degree, Project Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Organization/Company</label>
              <input
                type="text"
                value={newExperience.organization || ''}
                onChange={(e) => setNewExperience({ ...newExperience, organization: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="Company name, University name, etc."
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Description *</label>
              <RichTextEditor
                value={newExperience.description}
                onChange={(value) => setNewExperience({ ...newExperience, description: value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Start Date *</label>
                <input
                  type="date"
                  value={newExperience.startDate}
                  onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">End Date (leave empty for present)</label>
                <input
                  type="date"
                  value={newExperience.endDate || ''}
                  onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value || undefined })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Location</label>
              <input
                type="text"
                value={newExperience.location || ''}
                onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                placeholder="City, Country"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Custom Icon (optional)</label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newExperience.icon || ''}
                    onChange={(e) => setNewExperience({ ...newExperience, icon: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                    placeholder="Icon URL (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Or upload icon image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setExperienceIconFile(file)
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setExperienceIconPreview(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                  />
                </div>
                {(experienceIconPreview || newExperience.icon) && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center border-2 border-gray-300">
                      {experienceIconPreview ? (
                        <img 
                          src={experienceIconPreview} 
                          alt="Icon preview" 
                          className="w-12 h-12 object-contain"
                        />
                      ) : newExperience.icon ? (
                        <img 
                          src={newExperience.icon} 
                          alt="Icon" 
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={async () => {
                if (!newExperience.title || !newExperience.description || !newExperience.startDate) {
                  setMessage('Please fill in required fields')
                  return
                }
                
                try {
                  let iconUrl = newExperience.icon || ''
                  
                  // Upload icon file if provided
                  if (experienceIconFile) {
                    const formData = new FormData()
                    formData.append('image', experienceIconFile)
                    
                    try {
                      const token = localStorage.getItem('token')
                      const uploadRes = await fetch('/api/upload', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`
                        },
                        body: formData
                      })
                      
                      if (uploadRes.ok) {
                        const uploadData = await uploadRes.json()
                        iconUrl = uploadData.url
                      }
                    } catch (error) {
                      console.error('Error uploading icon:', error)
                    }
                  }
                  
                  const experienceToAdd = {
                    ...newExperience,
                    id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    icon: iconUrl || undefined
                  }
                  
                  const token = localStorage.getItem('token')
                  const res = await fetch('/api/content', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      section: 'experience',
                      data: experienceToAdd,
                      action: 'add'
                    })
                  })
                  
                  if (res.ok) {
                    setExperiences([...experiences, experienceToAdd])
                    setNewExperience({
                      id: '',
                      type: 'work',
                      title: '',
                      organization: '',
                      description: '',
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: '',
                      icon: '',
                      location: ''
                    })
                    setExperienceIconPreview('')
                    setExperienceIconFile(null)
                    setMessage('Experience added successfully!')
                    setTimeout(() => setMessage(''), 3000)
                  } else {
                    setMessage('Failed to add experience')
                  }
                } catch (error) {
                  setMessage('Error adding experience')
                }
              }}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Experience
            </button>
          </div>

          {/* Existing Experiences */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Existing Experiences</h2>
            {experiences.length === 0 ? (
              <p className="text-gray-500">No experiences yet. Add one above!</p>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-2">💡 Use ↑ and ↓ buttons to reorder experiences. The order here will be displayed on the Experience page.</p>
                {experiences.map((exp, index) => (
                  <div key={exp.id || index} className="border border-gray-200 rounded-md p-4">
                    {editingExperienceIndex === index ? (
                      <div className="space-y-4">
                        <select
                          value={exp.type}
                          onChange={(e) => {
                            const updated = [...experiences]
                            updated[index].type = e.target.value as 'work' | 'education' | 'project'
                            setExperiences(updated)
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                        >
                          <option value="work">Work</option>
                          <option value="education">Education</option>
                          <option value="project">Project</option>
                        </select>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const updated = [...experiences]
                            updated[index].title = e.target.value
                            setExperiences(updated)
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black font-bold text-xl"
                        />
                        <input
                          type="text"
                          value={exp.organization || ''}
                          onChange={(e) => {
                            const updated = [...experiences]
                            updated[index].organization = e.target.value
                            setExperiences(updated)
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                          placeholder="Organization"
                        />
                        <RichTextEditor
                          value={exp.description}
                          onChange={(value) => {
                            const updated = [...experiences]
                            updated[index].description = value
                            setExperiences(updated)
                          }}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => {
                              const updated = [...experiences]
                              updated[index].startDate = e.target.value
                              setExperiences(updated)
                            }}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                          />
                          <input
                            type="date"
                            value={exp.endDate || ''}
                            onChange={(e) => {
                              const updated = [...experiences]
                              updated[index].endDate = e.target.value || undefined
                              setExperiences(updated)
                            }}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                            placeholder="End Date"
                          />
                        </div>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => {
                            const updated = [...experiences]
                            updated[index].location = e.target.value
                            setExperiences(updated)
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                          placeholder="Location"
                        />
                        <input
                          type="url"
                          value={exp.icon || ''}
                          onChange={(e) => {
                            const updated = [...experiences]
                            updated[index].icon = e.target.value
                            setExperiences(updated)
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                          placeholder="Icon URL"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem('token')
                                const res = await fetch('/api/content', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  },
                                  body: JSON.stringify({
                                    section: 'experience',
                                    data: experiences[index],
                                    action: 'update',
                                    index
                                  })
                                })
                                
                                if (res.ok) {
                                  setEditingExperienceIndex(null)
                                  setMessage('Experience updated successfully!')
                                  setTimeout(() => setMessage(''), 3000)
                                } else {
                                  setMessage('Failed to update experience')
                                }
                              } catch (error) {
                                setMessage('Error updating experience')
                              }
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingExperienceIndex(null)
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
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            exp.type === 'work' ? 'bg-orange-500' :
                            exp.type === 'education' ? 'bg-blue-500' : 'bg-green-500'
                          } text-white`}>
                            {exp.type.toUpperCase()}
                          </span>
                          {exp.icon && (
                            <img src={exp.icon} alt={exp.type} className="w-6 h-6 object-contain" onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }} />
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
                        {exp.organization && <p className="text-orange-600 font-semibold mb-2">{exp.organization}</p>}
                        <p className="text-gray-700 mb-2">{exp.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(exp.startDate).toLocaleDateString()}
                          {exp.endDate ? ` - ${new Date(exp.endDate).toLocaleDateString()}` : ' - Present'}
                          {exp.location && ` • ${exp.location}`}
                        </p>
                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() => setEditingExperienceIndex(index)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (index > 0) {
                                const updated = [...experiences]
                                const temp = updated[index]
                                updated[index] = updated[index - 1]
                                updated[index - 1] = temp
                                setExperiences(updated)
                                
                                // Save new order
                                try {
                                  const token = localStorage.getItem('token')
                                  const res = await fetch('/api/content', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({
                                      section: 'experience',
                                      data: updated,
                                      action: 'update'
                                    })
                                  })
                                  
                                  if (res.ok) {
                                    setMessage('Order updated successfully!')
                                    setTimeout(() => setMessage(''), 2000)
                                  }
                                } catch (error) {
                                  setMessage('Error updating order')
                                }
                              }
                            }}
                            disabled={index === 0}
                            className={`px-3 py-2 rounded-md transition-colors ${
                              index === 0 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={async () => {
                              if (index < experiences.length - 1) {
                                const updated = [...experiences]
                                const temp = updated[index]
                                updated[index] = updated[index + 1]
                                updated[index + 1] = temp
                                setExperiences(updated)
                                
                                // Save new order
                                try {
                                  const token = localStorage.getItem('token')
                                  const res = await fetch('/api/content', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({
                                      section: 'experience',
                                      data: updated,
                                      action: 'update'
                                    })
                                  })
                                  
                                  if (res.ok) {
                                    setMessage('Order updated successfully!')
                                    setTimeout(() => setMessage(''), 2000)
                                  }
                                } catch (error) {
                                  setMessage('Error updating order')
                                }
                              }
                            }}
                            disabled={index === experiences.length - 1}
                            className={`px-3 py-2 rounded-md transition-colors ${
                              index === experiences.length - 1 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm('Are you sure you want to delete this experience?')) return
                              
                              try {
                                const token = localStorage.getItem('token')
                                const res = await fetch('/api/content', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  },
                                  body: JSON.stringify({
                                    section: 'experience',
                                    action: 'delete',
                                    index
                                  })
                                })
                                
                                if (res.ok) {
                                  setExperiences(experiences.filter((_, i) => i !== index))
                                  setMessage('Experience deleted successfully!')
                                  setTimeout(() => setMessage(''), 3000)
                                } else {
                                  setMessage('Failed to delete experience')
                                }
                              } catch (error) {
                                setMessage('Error deleting experience')
                              }
                            }}
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
      </div>
    </div>
  )
}

