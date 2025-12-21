import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    // Simple token verification - in production, use proper JWT verification
    const verifyRes = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
    
    if (!verifyRes.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('image') as File
    const directory = formData.get('directory') as string || 'projects' // Default to projects: 'projects', 'scroll', or 'profile'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 15MB for background images, 2MB for profile, 5MB for others)
    const maxSize = directory === 'scroll' 
      ? 15 * 1024 * 1024 
      : directory === 'profile' 
        ? 2 * 1024 * 1024 
        : 5 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = directory === 'scroll' ? '15MB' : directory === 'profile' ? '2MB' : '5MB'
      return NextResponse.json({ 
        error: `File size must be less than ${maxSizeMB}` 
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = directory === 'scroll' 
      ? `bg-${timestamp}-${randomStr}.${extension}`
      : directory === 'profile'
        ? `profile-${timestamp}-${randomStr}.${extension}`
        : `project-${timestamp}-${randomStr}.${extension}`

    // Determine upload directory
    const uploadDir = directory === 'scroll'
      ? join(process.cwd(), 'frontend', 'public', 'scroll')
      : directory === 'profile'
        ? join(process.cwd(), 'frontend', 'public', 'uploads', 'profile')
        : join(process.cwd(), 'frontend', 'public', 'uploads', 'projects')
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Return public URL
    const url = directory === 'scroll'
      ? `/scroll/${filename}`
      : directory === 'profile'
        ? `/uploads/profile/${filename}`
        : `/uploads/projects/${filename}`
    
    return NextResponse.json({ 
      url,
      filename,
      size: file.size,
      type: file.type
    })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

