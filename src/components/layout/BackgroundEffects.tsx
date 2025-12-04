import { useMemo } from 'react'

export default function BackgroundEffects() {
  // Generate random particles only once on mount to avoid re-rendering flicker
  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 2, // 2px to 5px
      duration: Math.random() * 15 + 15, // 15s to 30s
      delay: Math.random() * -30, // Negative delay to start mid-animation
      opacity: Math.random() * 0.4 + 0.1, // 0.1 to 0.5
      // Randomly choose between accent main and secondary colors via CSS variables
      colorVar: Math.random() > 0.6 ? 'var(--accent-main)' : 'var(--accent-secondary)'
    }))
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-bg-primary transition-colors duration-700">
      {/* Flowing Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary bg-[length:400%_400%] animate-gradient-flow opacity-100 dark:opacity-100"></div>

      {/* Animated Grid that moves slowly */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] dark:opacity-[0.1] animate-grid-move mix-blend-overlay dark:mix-blend-normal"></div>
      
      {/* Floating Particles */}
      {particles.map((p) => (
        <div 
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.colorVar,
            opacity: p.opacity,
            animation: `particle-float ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            filter: 'blur(1px)',
            boxShadow: `0 0 ${p.size * 2}px ${p.colorVar}`
          }}
        />
      ))}

      {/* Ambient Light Orbs - Refined for elegance and subtlety */}
      {/* Orb 1: Main Accent (Green or Purple) */}
      <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-accent-main rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-5 dark:opacity-10 animate-blob" />
      
      {/* Orb 2: Secondary Accent (Gold or Orange) */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-accent-secondary rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-5 dark:opacity-10 animate-blob animation-delay-2000" />
      
      {/* Orb 3: Floating Center - Very subtle */}
      <div className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] bg-accent-main rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] opacity-0 dark:opacity-5 animate-blob animation-delay-4000" />
    </div>
  )
}