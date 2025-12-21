import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
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
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative">
                  {/* Capybara coding logo */}
                  <div className="w-16 h-12 bg-green-200 rounded-full relative overflow-hidden border-2 border-green-400 shadow-lg">
                    {/* Capybara body */}
                    <div className="w-full h-full bg-green-300 rounded-full relative">
                      {/* Head */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-7 bg-green-400 rounded-t-full"></div>
                      {/* Eyes - focused on screen */}
                      <div className="absolute top-1.5 left-2.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute top-1.5 right-2.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      {/* Nose */}
                      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-pink-300 rounded-full"></div>
                      {/* Ears */}
                      <div className="absolute -top-1 left-1.5 w-2 h-3 bg-green-500 rounded-t-full transform rotate-12"></div>
                      <div className="absolute -top-1 right-1.5 w-2 h-3 bg-green-500 rounded-t-full transform -rotate-12"></div>
                      {/* Front legs typing */}
                      <div className="absolute bottom-0 left-2 w-2 h-3 bg-green-400 rounded-b-sm"></div>
                      <div className="absolute bottom-0 right-2 w-2 h-3 bg-green-400 rounded-b-sm"></div>
                      {/* Computer screen */}
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-gray-800 rounded-sm border border-gray-600">
                        <div className="w-full h-full bg-blue-900 rounded-sm flex items-center justify-center">
                          <div className="text-xs text-green-400 font-mono">{'</>'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white"
                      style={{
                        fontFamily: '"Montserrat", "Helvetica Neue", "Arial", sans-serif',
                        fontWeight: '700'
                      }}>
                  Zack&apos;s blog
                </span>
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
              </div>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
