'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ContentData {
  home: { title: string; content: string }
  about: { title: string; content: string }
  projects: Array<{ title: string; description: string; link: string }>
  blog: Array<{ title: string; content: string; date: string }>
}

export default function Admin() {
  const [data, setData] = useState<Partial<ContentData>>({})
  const [editing, setEditing] = useState('')
  const [editData, setEditData] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setIsLoggedIn(true)
            loadData()
          }
        })
    }
  }, [])

  const loadData = () => {
    fetch('/api/content')
      .then(res => res.json())
      .then(setData)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
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
      setLoginError(data.error)
    }
  }

  const handleEdit = (section: string) => {
    setEditing(section)
    setEditData(JSON.stringify(data[section as keyof ContentData], null, 2))
  }

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(editData)
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: editing, data: parsed })
      })
      setData({ ...data, [editing]: parsed })
      setEditing('')
    } catch (error) {
      alert('Invalid JSON')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-700">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-2 !text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 !text-black"
              required
            />
          </div>
          {loginError && <p className="text-red-500">{loginError}</p>}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">Login</button>
        </form>
        <p className="mt-4">Default admin: username or email &apos;admin&apos;, password &apos;admin123&apos;</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <div className="mb-4">
        <button onClick={() => router.push('/admin/profile')} className="bg-green-500 text-white px-4 py-2 mr-2">Update Profile</button>
        <button onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false) }} className="bg-red-500 text-white px-4 py-2">Logout</button>
      </div>
      
      <h2 className="text-2xl mb-4">Edit Content</h2>
      {Object.keys(data).map(section => (
        <div key={section} className="mb-4">
          <h2 className="text-2xl capitalize">{section}</h2>
          {editing === section ? (
            <div>
              <textarea
                value={editData}
                onChange={(e) => setEditData(e.target.value)}
                className="w-full h-40 border p-2 !text-black"
              />
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 mt-2">Save</button>
              <button onClick={() => setEditing('')} className="bg-gray-500 text-white px-4 py-2 mt-2 ml-2">Cancel</button>
            </div>
          ) : (
            <div>
              <pre className="bg-gray-100 p-2 rounded !text-black">{JSON.stringify(data[section as keyof ContentData], null, 2)}</pre>
              <button onClick={() => handleEdit(section)} className="bg-green-500 text-white px-4 py-2 mt-2">Edit</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
