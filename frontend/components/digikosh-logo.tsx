"use client"

import { useState } from "react"
import Image from "next/image"

interface DigiKoshLogoProps {
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export function DigiKoshLogo({ size = "md", animated = true }: DigiKoshLogoProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-20 h-20"
  }

  const imageSizes = {
    sm: 40,
    md: 48,
    lg: 80
  }

  return (
    <div 
      className={`${sizeClasses[size]} relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background glow with temple colors */}
      <div className={`absolute inset-0 bg-gradient-to-br from-[#0B5A7C] via-[#1077A3] to-[#C8861D] rounded-full blur-md opacity-50 ${animated ? 'animate-pulse' : ''}`} />
      
      {/* Main logo container */}
      <div className={`relative w-full h-full rounded-full flex items-center justify-center shadow-xl overflow-hidden ${animated && isHovered ? 'scale-110' : ''} transition-all duration-300 bg-white`}>
        {/* Temple logo image */}
        <Image 
          src="/logo.jpg" 
          alt="DigiKosh Temple Logo"
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="object-contain p-1"
          priority
        />
        
        {/* Shimmer effect */}
        {animated && (
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer" />
          </div>
        )}
      </div>
      
      <style jsx>{`
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

