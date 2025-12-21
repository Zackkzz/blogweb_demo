import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import AnimatedIcons from '@/components/AnimatedIcons'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Space',
  description: 'My personal website',
  icons: {
    icon: '/logo/zack-space-high-resolution-logo-grayscale-transparent.png',
    apple: '/logo/zack-space-high-resolution-logo-grayscale-transparent.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black`}>
        {/* Header Section */}
        <header className="overflow-hidden relative">
          {/* First Row - Logo and Icons - White Background */}
          <div className="bg-white border-b border-gray-200 overflow-hidden relative">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center relative z-10">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative h-16 w-auto">
                  <Image
                    src="/logo/zack-space-high-resolution-logo-grayscale-transparent.png"
                    alt="ZACK SPACE Logo"
                    width={250}
                    height={100}
                    className="h-full w-auto object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>
            <AnimatedIcons />
            </div>
            {/* Sunlight water wave effect */}
            <div className="sunlight-water-waves">
              <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="wave-layer wave-layer-1">
                <defs>
                  <linearGradient id="sunlightGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 255, 200, 0.6)" />
                    <stop offset="50%" stopColor="rgba(255, 215, 0, 0.8)" />
                    <stop offset="100%" stopColor="rgba(255, 140, 0, 0.9)" />
                  </linearGradient>
                  <linearGradient id="sunlightGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 240, 180, 0.55)" />
                    <stop offset="50%" stopColor="rgba(255, 200, 100, 0.75)" />
                    <stop offset="100%" stopColor="rgba(255, 160, 60, 0.85)" />
                  </linearGradient>
                </defs>
                {/* 无缝循环的波浪路径 - 使用重复模式，带呼吸效果 */}
                <path 
                  d="M0,60 Q150,20 300,60 T600,60 L600,120 L0,120 Z" 
                  fill="url(#sunlightGradient1)"
                  className="breathing-path"
                  opacity="0.9"
                />
                <path 
                  d="M0,60 Q150,20 300,60 T600,60 L600,120 L0,120 Z" 
                  fill="url(#sunlightGradient1)"
                  className="breathing-path"
                  opacity="0.9"
                  transform="translate(600, 0)"
                />
              </svg>
              <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="wave-layer wave-layer-2">
                <path 
                  d="M0,65 Q150,25 300,65 T600,65 L600,120 L0,120 Z" 
                  fill="url(#sunlightGradient2)"
                  className="breathing-path-2"
                />
                <path 
                  d="M0,65 Q150,25 300,65 T600,65 L600,120 L0,120 Z" 
                  fill="url(#sunlightGradient2)"
                  className="breathing-path-2"
                  transform="translate(600, 0)"
                />
              </svg>
            </div>
          </div>
          
          {/* Second Row - Navigation - Glassmorphism with Warm Sunlight */}
          <nav className="sunlight-glass-bg border-b border-orange-200/20">
            <div className="container mx-auto px-4 py-3">
              <div className="flex justify-center space-x-8">
                    <Link href="/" className="px-6 py-3 border border-orange-600/40 rounded-md bg-transparent shadow-sm hover:bg-orange-500/20 hover:border-orange-500/60 hover:shadow-md transition-all duration-300 font-bold text-orange-900/90"
                          style={{
                            fontFamily: '"Montserrat", "Helvetica Neue", "Arial", sans-serif',
                            fontWeight: '600'
                          }}>Home</Link>
                    <Link href="/about" className="px-6 py-3 border border-orange-600/40 rounded-md bg-transparent shadow-sm hover:bg-orange-500/20 hover:border-orange-500/60 hover:shadow-md transition-all duration-300 font-bold text-orange-900/90"
                          style={{
                            fontFamily: '"Montserrat", "Helvetica Neue", "Arial", sans-serif',
                            fontWeight: '600'
                          }}>About</Link>
                    <Link href="/projects" className="px-6 py-3 border border-orange-600/40 rounded-md bg-transparent shadow-sm hover:bg-orange-500/20 hover:border-orange-500/60 hover:shadow-md transition-all duration-300 font-bold text-orange-900/90"
                          style={{
                            fontFamily: '"Montserrat", "Helvetica Neue", "Arial", sans-serif',
                            fontWeight: '600'
                          }}>Projects</Link>
                    <Link href="/blog" className="px-6 py-3 border border-orange-600/40 rounded-md bg-transparent shadow-sm hover:bg-orange-500/20 hover:border-orange-500/60 hover:shadow-md transition-all duration-300 font-bold text-orange-900/90"
                          style={{
                            fontFamily: '"Montserrat", "Helvetica Neue", "Arial", sans-serif',
                            fontWeight: '600'
                          }}>Blog</Link>
                    <Link href="/experience" className="px-6 py-3 border border-orange-600/40 rounded-md bg-transparent shadow-sm hover:bg-orange-500/20 hover:border-orange-500/60 hover:shadow-md transition-all duration-300 font-bold text-orange-900/90"
                          style={{
                            fontFamily: '"Montserrat", "Helvetica Neue", "Arial", sans-serif',
                            fontWeight: '600'
                          }}>Experience</Link>
                    <Link href="/education" className="px-6 py-3 border border-orange-600/40 rounded-md bg-transparent shadow-sm hover:bg-orange-500/20 hover:border-orange-500/60 hover:shadow-md transition-all duration-300 font-bold text-orange-900/90"
                          style={{
                            fontFamily: '"Montserrat", "Helvetica Neue", "Arial", sans-serif',
                            fontWeight: '600'
                          }}>Education</Link>
                    <Link href="/admin" className="px-6 py-3 border border-orange-600/40 rounded-md bg-transparent shadow-sm hover:bg-orange-500/20 hover:border-orange-500/60 hover:shadow-md transition-all duration-300 font-bold text-orange-900/90"
                          style={{
                            fontFamily: '"Montserrat", "Helvetica Neue", "Arial", sans-serif',
                            fontWeight: '600'
                          }}>Admin</Link>
              </div>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
