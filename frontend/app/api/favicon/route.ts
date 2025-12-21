import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    // Try to get favicon from common locations
    const urlObj = new URL(url)
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`
    
    // Common favicon paths
    const faviconPaths = [
      `${baseUrl}/favicon.ico`,
      `${baseUrl}/favicon.png`,
      `${baseUrl}/apple-touch-icon.png`,
      `${baseUrl}/logo.png`,
      `${baseUrl}/logo.svg`,
    ]

    // For GitHub repositories
    if (urlObj.hostname === 'github.com') {
      const pathParts = urlObj.pathname.split('/').filter(Boolean)
      if (pathParts.length >= 2) {
        // GitHub repository - use GitHub's API or default GitHub logo
        return NextResponse.json({ 
          favicon: 'https://github.githubassets.com/favicons/favicon.png',
          source: 'github'
        })
      }
    }

    // Try to fetch favicon
    for (const faviconPath of faviconPaths) {
      try {
        const response = await fetch(faviconPath, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(3000)
        })
        if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
          return NextResponse.json({ 
            favicon: faviconPath,
            source: 'direct'
          })
        }
      } catch (e) {
        // Continue to next path
      }
    }

    // Fallback: use Google's favicon service
    const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`
    return NextResponse.json({ 
      favicon: googleFaviconUrl,
      source: 'google'
    })
  } catch (error: any) {
    console.error('Error fetching favicon:', error)
    // Fallback to a default icon
    return NextResponse.json({ 
      favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=128',
      source: 'fallback'
    })
  }
}

