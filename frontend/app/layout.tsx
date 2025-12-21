import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Personal Website',
  description: 'My personal website',
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
          {/* First Row - Logo and Icons - Dark Gray with Flowing Effect */}
          <div className="bg-gray-800 flowing-gray-bg border-b border-gray-700 overflow-hidden relative">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center relative z-10">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="relative h-12 w-auto">
                  <Image
                    src="/logo/zack-code-high-resolution-logo (2).png"
                    alt="ZACK CODE Logo"
                    width={200}
                    height={80}
                    className="h-full w-auto object-contain"
                    priority
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-3 text-xl">
              <span className="animate-bounce">🦘</span>
              <span className="animate-pulse">🐨</span>
              <span className="animate-bounce" style={{animationDelay: '0.5s'}}>🌉</span>
              <span className="animate-pulse" style={{animationDelay: '1s'}}>🏝️</span>
            </div>
            </div>
          </div>
          
          {/* Second Row - Navigation - White */}
          <nav className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-3">
              <div className="flex justify-center space-x-8">
                <Link href="/" className="px-6 py-3 border border-gray-300 rounded-md bg-transparent shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md transition-all duration-300 font-bold text-gray-800"
                      style={{
                        fontFamily: '"Montserrat", "Helvetica Neue", "Arial", sans-serif',
                        fontWeight: '600'
                      }}>Home</Link>
                <Link href="/about" className="px-6 py-3 border border-gray-300 rounded-md bg-transparent shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md transition-all duration-300 font-bold text-gray-800"
                      style={{
                        fontFamily: '"Montserrat", "Helvetica Neue", "Arial", sans-serif',
                        fontWeight: '600'
                      }}>About</Link>
                <Link href="/projects" className="px-6 py-3 border border-gray-300 rounded-md bg-transparent shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md transition-all duration-300 font-bold text-gray-800"
                      style={{
                        fontFamily: '"Montserrat", "Helvetica Neue", "Arial", sans-serif',
                        fontWeight: '600'
                      }}>Projects</Link>
                <Link href="/blog" className="px-6 py-3 border border-gray-300 rounded-md bg-transparent shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md transition-all duration-300 font-bold text-gray-800"
                      style={{
                        fontFamily: '"Montserrat", "Helvetica Neue", "Arial", sans-serif',
                        fontWeight: '600'
                      }}>Blog</Link>
                <Link href="/admin" className="px-6 py-3 border border-gray-300 rounded-md bg-transparent shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md transition-all duration-300 font-bold text-gray-800"
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
