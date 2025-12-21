'use client'

export default function AnimatedIcons() {
  // Use limited iteration animations that will naturally stop after completing their cycles
  // animate-bounce duration is 1s, so 6 seconds = 6 iterations
  // animate-pulse duration is 2s, so 6 seconds = 3 iterations
  // These animations will complete their last cycle and stop naturally
  
  return (
    <div className="flex items-center space-x-3 text-xl">
      <span className="icon-bounce-6">🦘</span>
      <span className="icon-pulse-3">🐨</span>
      <span className="icon-bounce-6-delayed">🌉</span>
      <span className="icon-pulse-3-delayed">🏝️</span>
    </div>
  )
}

