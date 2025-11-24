"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

interface LandingCTAProps {
  onGetStarted: () => void
}

export function LandingCTA({ onGetStarted }: LandingCTAProps) {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B5A7C]/20 via-[#1077A3]/15 via-background to-[#C8861D]/15" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,90,124,0.2),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(200,134,29,0.15),transparent_50%)]" />
      
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#0B5A7C]/20 to-[#C8861D]/20 border border-[#0B5A7C]/30 mb-4 backdrop-blur-sm">
            <TrendingUp className="w-4 h-4 text-[#0B5A7C]" />
          <p className="text-sm font-medium text-[#0B5A7C]">Ready to Get Started?</p>
        </div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            <span className="bg-gradient-to-r from-foreground via-[#0B5A7C] to-[#1077A3] bg-clip-text text-transparent">
              Transform Your Temple's
            </span>
          <br />
            <span className="bg-gradient-to-r from-[#1077A3] to-[#C8861D] bg-clip-text text-transparent">
              Financial Future Today
          </span>
        </h2>
        
          <p className="text-lg text-foreground/70 mb-6 text-balance max-w-2xl mx-auto leading-relaxed">
            Create your first digital treasury vault and start generating 8-15% annual returns. 
            <br />
            <span className="text-base text-foreground/60">Preserve corpus. Automate payments. Build self-sustainability.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          <Button 
            onClick={onGetStarted} 
            size="lg"
              className="bg-gradient-to-r from-[#0B5A7C] to-[#C8861D] hover:from-[#094B68] hover:to-[#B87819] h-14 px-8 text-lg font-semibold shadow-xl shadow-[#0B5A7C]/30 hover:shadow-2xl hover:shadow-[#0B5A7C]/40 hover:scale-105 active:scale-95 transition-all duration-300 text-white group"
          >
              Create Treasury Vault
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
              className="h-14 px-8 text-lg font-semibold border-2 border-[#0B5A7C]/30 hover:bg-[#C8861D]/20 hover:border-[#C8861D]/50 hover:scale-105 active:scale-95 backdrop-blur-sm transition-all duration-300 group"
            asChild
          >
              <Link href="#features" className="group-hover:text-[#C8861D] transition-colors">See How It Works</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-[#0B5A7C]/30 shadow-lg hover:border-[#0B5A7C]/60 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
            <Shield className="w-8 h-8 text-[#0B5A7C] mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
              <div className="font-semibold mb-1 bg-gradient-to-r from-foreground to-[#0B5A7C] bg-clip-text text-transparent group-hover:text-[#0B5A7C] transition-colors">100% Corpus Protected</div>
              <div className="text-sm text-foreground/60 text-center">Principal remains untouched</div>
          </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-[#1077A3]/30 shadow-lg hover:border-[#1077A3]/60 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
            <TrendingUp className="w-8 h-8 text-[#1077A3] mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
              <div className="font-semibold mb-1 bg-gradient-to-r from-foreground to-[#1077A3] bg-clip-text text-transparent group-hover:text-[#1077A3] transition-colors">8-15% Annual Returns</div>
              <div className="text-sm text-foreground/60 text-center">Institutional-grade yield</div>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-[#C8861D]/30 shadow-lg hover:border-[#C8861D]/60 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
              <Users className="w-8 h-8 text-[#C8861D] mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
              <div className="font-semibold mb-1 bg-gradient-to-r from-foreground to-[#C8861D] bg-clip-text text-transparent group-hover:text-[#C8861D] transition-colors">Automated Payments</div>
              <div className="text-sm text-foreground/60 text-center">Set it and forget it</div>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
