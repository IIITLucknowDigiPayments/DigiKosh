"use client"

import { useEffect, useState } from "react"

interface DigiKoshLogoProps {
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export function DigiKoshLogo({ size = "md", animated = true }: DigiKoshLogoProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  }

  return (
    <div 
      className={`${sizeClasses[size]} relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background glow */}
      <div className={`absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-xl blur-md opacity-60 ${animated ? 'animate-pulse' : ''}`} />
      
      {/* Main logo container */}
      <div className={`relative w-full h-full bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-xl ${animated && isHovered ? 'animate-spin-slow scale-110' : ''} transition-all duration-300`}>
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent rounded-xl" />
        
        {/* Logo symbol - stylized "DK" */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative">
            {/* D */}
            <div className="absolute -left-2 top-0 w-3 h-5 border-2 border-white rounded-l-full border-r-0" />
            {/* K */}
            <div className="relative">
              <div className="w-0.5 h-5 bg-white" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white rounded-tr" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white rounded-br" />
            </div>
          </div>
        </div>
        
        {/* Shimmer effect */}
        {animated && (
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg) scale(1); }
          to { transform: rotate(360deg) scale(1.1); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(0); }
          100% { transform: translateX(200%) translateY(0); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  )
}

