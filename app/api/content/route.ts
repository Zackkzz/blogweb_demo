import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'content.json')

export async function GET() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 })
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