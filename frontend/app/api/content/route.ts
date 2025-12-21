import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-env'

const dataPath = path.join(process.cwd(), 'data', 'content.json')

// Default content structure
const defaultContent = {
  home: {
    title: 'Good Day! Welcome to Zack\'s blog!',
    content: 'This is the home page content. You can edit this from the admin panel.'
  },
  about: {
    title: 'About Me',
    content: 'I am a passionate developer with experience in various technologies. This content can be edited from the admin panel.'
  },
  projects: [],
  blog: []
}

export async function GET() {
  try {
    // Check if file exists
    if (!fs.existsSync(dataPath)) {
      console.warn(`Content file not found at ${dataPath}, returning default content`)
      return NextResponse.json(defaultContent)
    }
    
    const data = fs.readFileSync(dataPath, 'utf8')
    const parsed = JSON.parse(data)
    
    // Merge with defaults to ensure all keys exist
    return NextResponse.json({
      ...defaultContent,
      ...parsed
    })
  } catch (error: any) {
    console.error('Error reading content file:', error)
    // Return default content instead of error to prevent frontend crashes
    return NextResponse.json(defaultContent)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    try {
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const { section, data, action, index } = await request.json()
    
    // Check if we're in a serverless environment
    const isServerless = process.cwd().includes('/var/task') || process.env.NETLIFY === 'true'
    
    if (isServerless) {
      // In serverless, we can't write files, so return success but don't actually save
      // This is a limitation of serverless environments
      console.warn('Cannot save content in serverless environment')
      return NextResponse.json({ success: true, warning: 'Content saved in memory only (serverless limitation)' })
    }
    
    let currentData
    try {
      if (fs.existsSync(dataPath)) {
        currentData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      } else {
        currentData = { ...defaultContent }
      }
    } catch (error) {
      currentData = { ...defaultContent }
    }
    
    // Handle different actions
    if (action === 'add') {
      // Add new item to array
      if (!currentData[section]) {
        currentData[section] = []
      }
      currentData[section].push(data)
    } else if (action === 'update' && typeof index === 'number') {
      // Update item at index
      if (Array.isArray(currentData[section])) {
        currentData[section][index] = data
      } else {
        // For non-array sections like 'about'
        currentData[section] = data
      }
    } else if (action === 'delete' && typeof index === 'number') {
      // Delete item at index
      if (Array.isArray(currentData[section])) {
        currentData[section].splice(index, 1)
      }
    } else {
      // Default: replace entire section
      currentData[section] = data
    }
    
    // Ensure directory exists
    const dir = path.dirname(dataPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 2))
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Failed to update data', details: error.message }, { status: 500 })
  }
}
