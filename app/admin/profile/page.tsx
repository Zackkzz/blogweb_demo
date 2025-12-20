'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [updateMessage, setUpdateMessage] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin')
      return
    }
    fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setIsLoggedIn(true)
        } else {
          router.push('/admin')
        }
      })
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) return

    const res = await fetch('/api/auth/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ currentPassword, newUsername, newPassword, newEmail })
    })
    const data = await res.json()
    if (res.ok) {
      setUpdateMessage('Profile updated successfully')
      setCurrentPassword('')
      setNewUsername('')
      setNewPassword('')
      setNewEmail('')
    } else {
      setUpdateMessage(data.error || 'Update failed')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto p-4">
        <p>Checking authentication...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Update Profile</h1>
      <button onClick={() => router.push('/admin')} className="bg-gray-500 text-white px-4 py-2 mb-4">Back to Admin</button>

      <form onSubmit={handleUpdateProfile} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border p-2 !text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">New Username (optional)</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full border p-2 !text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">New Password (optional)</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 !text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">New Email (optional)</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full border p-2 !text-black"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Update Profile</button>
        {updateMessage && <p className="mt-2 text-green-600">{updateMessage}</p>}
      </form>
    </div>
  )
}