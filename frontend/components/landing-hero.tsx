"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Shield, Users, DollarSign } from "lucide-react"
import Link from "next/link"

interface LandingHeroProps {
  onGetStarted: () => void
}

export function LandingHero({ onGetStarted }: LandingHeroProps) {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-20 md:pt-12 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-purple-500/10 via-background to-fuchsia-500/10 animate-gradient-shift" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.15),transparent_50%)] animate-float" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.15),transparent_50%)] animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,38,211,0.1),transparent_70%)]" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 mb-8 animate-fade-in backdrop-blur-sm hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4 text-violet-500 animate-pulse" />
              <p className="text-sm font-medium text-violet-600 dark:text-violet-400">Sustainable Funding Platform</p>
          </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight animate-fade-in-up">
              <span className="bg-gradient-to-r from-foreground via-violet-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">
                Fund Your Team
            </span>
            <br />
              <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent animate-gradient-shift">
                with Yield
              </span>
          </h1>

            <p className="text-xl md:text-2xl text-foreground/70 mb-10 text-balance max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up delay-100">
              Create sustainable income streams for your contributors. 
            <br />
              <span className="text-lg text-foreground/60">Your funds stay safe while generating yield for your team.</span>
          </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12 animate-fade-in-up delay-200">
            <Button 
              onClick={onGetStarted} 
              size="lg"
                className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 h-14 px-8 text-lg font-semibold shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 transition-all text-white animate-pulse-glow group"
            >
                Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
                className="h-14 px-8 text-lg font-semibold border-2 hover:bg-accent/50 backdrop-blur-sm"
              asChild
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up delay-300">
              <div className="flex flex-col items-center lg:items-start p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-violet-500/20 shadow-lg hover:border-violet-500/40 hover:scale-105 transition-all group">
                <Shield className="w-8 h-8 text-violet-500 mb-3 group-hover:animate-bounce" />
                <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">100%</div>
                <div className="text-sm text-foreground/60">Protected</div>
              </div>
              <div className="flex flex-col items-center lg:items-start p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-purple-500/20 shadow-lg hover:border-purple-500/40 hover:scale-105 transition-all group">
              <TrendingUp className="w-8 h-8 text-purple-500 mb-3 group-hover:animate-bounce" />
                <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Auto</div>
                <div className="text-sm text-foreground/60">Yield</div>
              </div>
              <div className="flex flex-col items-center lg:items-start p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-fuchsia-500/20 shadow-lg hover:border-fuchsia-500/40 hover:scale-105 transition-all group">
                <Users className="w-8 h-8 text-fuchsia-500 mb-3 group-hover:animate-bounce" />
                <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">Team</div>
                <div className="text-sm text-foreground/60">First</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block animate-fade-in-up delay-200 group">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-purple-500/20 to-fuchsia-500/20 rounded-3xl blur-3xl animate-pulse-glow" />
              <div className="relative bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl rounded-3xl p-8 border border-violet-500/30 shadow-2xl hover:border-violet-500/50 transition-all">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg animate-pulse-glow group-hover:rotate-12 transition-transform">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Vault Balance</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">$125,000</div>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all">
                      <div className="text-sm text-foreground/60 mb-1">Monthly Yield</div>
                      <div className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">$2,500</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                      <div className="text-sm text-foreground/60 mb-1">Contributors</div>
                      <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">12</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-foreground/60">APY</div>
                      <div className="text-sm font-semibold bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">12.5%</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-full w-3/4 animate-shimmer" />
                    </div>
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
