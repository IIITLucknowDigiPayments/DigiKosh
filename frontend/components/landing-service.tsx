"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, TrendingUp, Shield, ArrowRight } from "lucide-react"

export function LandingService() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B5A7C]/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,90,124,0.1),transparent_70%)]" />
      
      <div className="relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#0B5A7C]/20 to-[#C8861D]/20 border border-[#0B5A7C]/30 mb-4 backdrop-blur-sm">
            <Building2 className="w-4 h-4 text-[#0B5A7C]" />
            <p className="text-sm font-medium text-[#0B5A7C]">What Service We Offer</p>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-[#0B5A7C] to-[#C8861D] bg-clip-text text-transparent">
            What Service We Offer
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-center mb-8">
          <div className="space-y-4">
            <p className="text-lg text-foreground/80 leading-relaxed">
              <span className="font-semibold text-[#0B5A7C]">Digikosh is a blockchain-based financial management platform</span> designed exclusively for temples and religious organizations.
            </p>
            <p className="text-base text-foreground/70 leading-relaxed">
              We convert temple donations into safe, yield-generating digital treasury vaults — delivering <span className="font-semibold text-[#C8861D]">8–15% annual returns</span> while enabling automated payouts for all operational needs.
            </p>
          </div>
          
          <Card className="bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm border-2 border-[#0B5A7C]/20 shadow-xl">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B5A7C] to-[#1077A3] flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-[#0B5A7C] to-[#1077A3] bg-clip-text text-transparent">
                      Donations Preserved
                    </h3>
                    <p className="text-foreground/70 text-sm">
                      Principal corpus remains 100% protected
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-[#C8861D] rotate-90" />
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1077A3] to-[#C8861D] flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-[#1077A3] to-[#C8861D] bg-clip-text text-transparent">
                      Yield Funds Operations
                    </h3>
                    <p className="text-foreground/70 text-sm">
                      Automated payouts for salaries and expenses
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-[#C8861D] rotate-90" />
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8861D] to-[#D4A540] flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-[#C8861D] to-[#D4A540] bg-clip-text text-transparent">
                      Self-Sustainable Temple
                    </h3>
                    <p className="text-foreground/70 text-sm">
                      Perpetual income stream for long-term sustainability
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-[#0B5A7C]/10 via-[#1077A3]/10 to-[#C8861D]/10 rounded-xl p-6 border border-[#0B5A7C]/20">
          <div className="text-center">
            <p className="text-lg font-bold bg-gradient-to-r from-[#0B5A7C] via-[#1077A3] to-[#C8861D] bg-clip-text text-transparent">
              Result: Donations are preserved → Yield funds operations → The temple becomes financially self-sustainable.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

