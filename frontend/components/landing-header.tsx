"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAccount, useDisconnect } from "wagmi"
import { useRouter } from "next/navigation"
import { Wallet, LogOut } from "lucide-react"
import { DigiKoshLogo } from "@/components/digikosh-logo"

interface LandingHeaderProps {
  onConnectWallet: () => void
}

export function LandingHeader({ onConnectWallet }: LandingHeaderProps) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleDisconnect = () => {
    disconnect()
  }

  const handleDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-[#0B5A7C]/20 dark:border-[#0B5A7C]/10 shadow-lg shadow-[#0B5A7C]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push("/")}>
          <DigiKoshLogo size="sm" animated={true} />
          <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-[#0B5A7C] via-[#1077A3] to-[#C8861D] bg-clip-text text-transparent group-hover:from-[#094B68] group-hover:via-[#0D6487] group-hover:to-[#B87819] transition-all duration-300">
            Digikosh
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-2">
          <a 
            href="#features" 
            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition-all duration-200 relative group"
          >
            Sacred Features
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0B5A7C] via-[#1077A3] to-[#C8861D] group-hover:w-full transition-all duration-300" />
          </a>
          <a 
            href="#how-it-works" 
            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition-all duration-200 relative group"
          >
            Divine Process
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0B5A7C] via-[#1077A3] to-[#C8861D] group-hover:w-full transition-all duration-300" />
          </a>
          <a 
            href="#impact" 
            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition-all duration-200 relative group"
          >
            Temple Impact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0B5A7C] via-[#1077A3] to-[#C8861D] group-hover:w-full transition-all duration-300" />
          </a>
        </nav>
        {isMounted && isConnected && address ? (
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleDashboard}
              className="hidden sm:flex backdrop-blur-sm bg-white/5 dark:bg-white/5 border-white/10 hover:bg-white/10 dark:hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Dashboard
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#0B5A7C]/10 to-[#C8861D]/10 border border-[#0B5A7C]/20 backdrop-blur-sm hover:from-[#0B5A7C]/15 hover:to-[#C8861D]/15 hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse-glow cursor-pointer">
              <Wallet className="w-4 h-4 text-[#0B5A7C]" />
              <span className="text-sm font-medium text-[#0B5A7C] dark:text-[#1077A3]">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleDisconnect}
              className="h-9 w-9 rounded-lg hover:bg-white/5 dark:hover:bg-white/5 hover:scale-110 active:scale-95 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button 
            onClick={onConnectWallet} 
            className="bg-gradient-to-r from-[#0B5A7C] via-[#1077A3] to-[#C8861D] hover:from-[#094B68] hover:via-[#0D6487] hover:to-[#B87819] shadow-lg shadow-[#0B5A7C]/30 hover:shadow-xl hover:shadow-[#0B5A7C]/40 hover:scale-105 active:scale-95 transition-all duration-300 text-white font-semibold animate-pulse-glow"
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  )
}
