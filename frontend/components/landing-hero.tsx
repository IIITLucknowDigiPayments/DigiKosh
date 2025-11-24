"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Shield, Users, DollarSign } from "lucide-react"
import Link from "next/link"

interface LandingHeroProps {
  onGetStarted: () => void
}

export function LandingHero({ onGetStarted }: LandingHeroProps) {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-4 pb-12 md:pt-6 md:pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B5A7C]/20 via-[#1077A3]/10 via-background to-[#C8861D]/10 animate-gradient-shift" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(11,90,124,0.15),transparent_50%)] animate-float" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(200,134,29,0.15),transparent_50%)] animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,119,163,0.1),transparent_70%)]" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#0B5A7C]/20 to-[#C8861D]/20 border border-[#0B5A7C]/30 mb-4 animate-fade-in backdrop-blur-sm hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4 text-[#0B5A7C] animate-pulse" />
              <p className="text-sm font-medium text-[#0B5A7C] dark:text-[#1077A3]">The Sacred Finance Platform</p>
          </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight animate-fade-in-up">
              <span className="bg-gradient-to-r from-foreground via-[#0B5A7C] to-[#1077A3] bg-clip-text text-transparent animate-gradient-shift">
                Digikosh
            </span>
            <br />
              <span className="text-3xl md:text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-[#1077A3] via-[#C8861D] to-[#D4A540] bg-clip-text text-transparent animate-gradient-shift">
                The Sacred Finance Platform for Temples & Religious Trusts
              </span>
          </h1>

            <p className="text-lg md:text-xl text-foreground/80 mb-4 text-balance max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up delay-100 font-semibold">
              Preserve your temple corpus. Automate monthly expenses. Build a self-sustaining future.
          </p>
          
          <div className="bg-gradient-to-r from-[#0B5A7C]/10 via-[#1077A3]/10 to-[#C8861D]/10 border-l-4 border-[#C8861D] rounded-lg p-4 mb-6 animate-fade-in-up delay-100">
            <p className="text-lg text-foreground/80 mb-3 leading-relaxed">
              <span className="font-semibold text-[#0B5A7C]">Temples receive massive donations</span> but lose corpus value due to inflation and low-yield bank deposits.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              <span className="font-semibold text-[#C8861D]">Digikosh transforms every donation</span> into a perpetual income stream — ensuring priests' salaries, daily operations, and maintenance are funded forever.
            </p>
          </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-6 animate-fade-in-up delay-200">
            <Button 
              onClick={onGetStarted} 
              size="lg"
                className="bg-gradient-to-r from-[#0B5A7C] via-[#1077A3] to-[#C8861D] hover:from-[#094B68] hover:via-[#0D6487] hover:to-[#B87819] h-14 px-8 text-lg font-semibold shadow-xl shadow-[#0B5A7C]/30 hover:shadow-2xl hover:shadow-[#0B5A7C]/40 hover:scale-105 active:scale-95 transition-all duration-300 text-white animate-pulse-glow group"
            >
                Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
                className="h-14 px-8 text-lg font-semibold border-2 border-[#0B5A7C]/30 hover:bg-[#C8861D]/20 hover:border-[#C8861D]/50 hover:scale-105 active:scale-95 backdrop-blur-sm transition-all duration-300 group"
              asChild
            >
              <Link href="#features" className="group-hover:text-[#C8861D] transition-colors">Learn More</Link>
            </Button>
          </div>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up delay-300">
              <div className="flex flex-col items-center lg:items-start p-4 rounded-xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-[#0B5A7C]/20 shadow-lg hover:border-[#0B5A7C]/40 hover:scale-105 transition-all group">
                <Shield className="w-6 h-6 text-[#0B5A7C] mb-2 group-hover:animate-bounce" />
                <div className="text-2xl font-bold mb-1 bg-gradient-to-r from-[#0B5A7C] to-[#1077A3] bg-clip-text text-transparent">100%</div>
                <div className="text-xs text-foreground/60 font-medium">Corpus Protected</div>
              </div>
              <div className="flex flex-col items-center lg:items-start p-4 rounded-xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-[#1077A3]/20 shadow-lg hover:border-[#1077A3]/40 hover:scale-105 transition-all group">
              <TrendingUp className="w-6 h-6 text-[#1077A3] mb-2 group-hover:animate-bounce" />
                <div className="text-2xl font-bold mb-1 bg-gradient-to-r from-[#1077A3] to-[#C8861D] bg-clip-text text-transparent">8-15%</div>
                <div className="text-xs text-foreground/60 font-medium">Annual Returns</div>
              </div>
              <div className="flex flex-col items-center lg:items-start p-4 rounded-xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-[#C8861D]/20 shadow-lg hover:border-[#C8861D]/40 hover:scale-105 transition-all group">
                <Users className="w-6 h-6 text-[#C8861D] mb-2 group-hover:animate-bounce" />
                <div className="text-2xl font-bold mb-1 bg-gradient-to-r from-[#C8861D] to-[#D4A540] bg-clip-text text-transparent">Auto</div>
                <div className="text-xs text-foreground/60 font-medium">Payments</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block animate-fade-in-up delay-200 group">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B5A7C]/30 via-[#1077A3]/20 to-[#C8861D]/20 rounded-2xl blur-3xl animate-pulse-glow" />
              <div className="relative bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl rounded-2xl p-6 border border-[#0B5A7C]/30 shadow-2xl hover:border-[#0B5A7C]/50 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B5A7C] to-[#1077A3] flex items-center justify-center shadow-lg animate-pulse-glow group-hover:rotate-12 transition-transform">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold bg-gradient-to-r from-[#0B5A7C] to-[#1077A3] bg-clip-text text-transparent">Digital Treasury Vault</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#C8861D] to-[#D4A540] bg-clip-text text-transparent">₹2.5 Crore</div>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#0B5A7C]/10 to-[#1077A3]/10 border border-[#0B5A7C]/20 hover:border-[#0B5A7C]/40 transition-all">
                      <div className="text-xs text-foreground/60 mb-1">Monthly Yield</div>
                      <div className="text-lg font-bold bg-gradient-to-r from-[#0B5A7C] to-[#1077A3] bg-clip-text text-transparent">₹2.5L</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#1077A3]/10 to-[#C8861D]/10 border border-[#1077A3]/20 hover:border-[#1077A3]/40 transition-all">
                      <div className="text-xs text-foreground/60 mb-1">Annual APY</div>
                      <div className="text-lg font-bold bg-gradient-to-r from-[#1077A3] to-[#C8861D] bg-clip-text text-transparent">12%</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#C8861D]/10 to-[#0B5A7C]/10 border border-[#C8861D]/20 hover:border-[#C8861D]/40 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-foreground/60">Corpus Protected</div>
                      <div className="text-sm font-semibold bg-gradient-to-r from-[#C8861D] to-[#D4A540] bg-clip-text text-transparent">100%</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#0B5A7C] via-[#1077A3] to-[#C8861D] rounded-full w-full animate-shimmer" />
                    </div>
                    <p className="text-xs text-foreground/60 mt-2">Principal corpus remains untouched</p>
                  </div>
                </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .delay-100 {
          animation-delay: 0.1s;
          animation-fill-mode: both;
        }
        .delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
        .delay-300 {
          animation-delay: 0.3s;
          animation-fill-mode: both;
        }
      `}</style>
    </section>
  )
}
