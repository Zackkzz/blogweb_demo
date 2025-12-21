import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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
    const { section, data } = await request.json()
    const currentData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    currentData[section] = data
    fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 })
  }
}
