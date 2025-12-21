export default function ZackCodeLogo({ className = '', size = 'default', color = 'current' }: { className?: string; size?: 'default' | 'small' | 'large'; color?: 'current' | 'white' | 'black' }) {
  const scale = size === 'small' ? 0.5 : size === 'large' ? 1.2 : 1
  const textColor = color === 'white' ? 'text-white' : color === 'black' ? 'text-black' : 'text-current'
  const svgColor = color === 'white' ? 'white' : color === 'black' ? 'black' : 'currentColor'
  
  return (
    <div className={`flex flex-col items-center ${className}`} style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
      {/* Top section: EST. - Sydney Opera House - 2025 */}
      <div className="flex items-end justify-center gap-2 mb-1">
        <span className={`text-[10px] font-bold ${textColor}`} style={{ fontFamily: 'Arial, sans-serif' }}>EST.</span>
        
        {/* Sydney Opera House SVG */}
        <svg 
          width="50" 
          height="25" 
          viewBox="0 0 60 30" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          {/* Base with horizontal lines */}
          <line x1="5" y1="25" x2="55" y2="25" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="8" y1="22" x2="52" y2="22" stroke={svgColor} strokeWidth="1" strokeLinecap="round"/>
          <line x1="10" y1="19" x2="50" y2="19" stroke={svgColor} strokeWidth="1" strokeLinecap="round"/>
          
          {/* Left shell structure */}
          <path 
            d="M 12 19 Q 8 12, 10 5 Q 12 2, 15 3 Q 18 4, 20 8" 
            stroke={svgColor} 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
          />
          <path 
            d="M 20 8 Q 18 12, 20 15" 
            stroke={svgColor} 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Center shell structure */}
          <path 
            d="M 22 19 Q 20 10, 25 4 Q 28 1, 32 3 Q 35 5, 35 10" 
            stroke={svgColor} 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
          />
          <path 
            d="M 35 10 Q 33 14, 35 17" 
            stroke={svgColor} 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Right shell structure */}
          <path 
            d="M 37 19 Q 38 12, 42 6 Q 44 3, 47 4 Q 50 5, 48 10" 
            stroke={svgColor} 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
          />
          <path 
            d="M 48 10 Q 46 14, 48 17" 
            stroke={svgColor} 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        
        <span className={`text-[10px] font-bold ${textColor}`} style={{ fontFamily: 'Arial, sans-serif' }}>2025</span>
      </div>
      
      {/* Main title: ZACK CODE */}
      <div className="flex flex-col items-center mb-0.5">
        <span 
          className={`text-xl font-bold ${textColor} uppercase leading-tight`}
          style={{ 
            fontFamily: 'Arial, sans-serif',
            fontWeight: '900',
            letterSpacing: '0.05em'
          }}
        >
          ZACK
        </span>
        <span 
          className={`text-xl font-bold ${textColor} uppercase leading-tight`}
          style={{ 
            fontFamily: 'Arial, sans-serif',
            fontWeight: '900',
            letterSpacing: '0.05em'
          }}
        >
          CODE
        </span>
      </div>
      
      {/* Tagline: Innovate. Inspire. Ignite. */}
      <div className={`text-[9px] ${textColor}`} style={{ fontFamily: 'Arial, sans-serif' }}>
        Innovate. Inspire. Ignite.
      </div>
    </div>
  )
}

