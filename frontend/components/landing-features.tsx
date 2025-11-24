"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Shield, Users, FileText, Lock, Building2, Zap, CreditCard } from "lucide-react"

export function LandingFeatures() {
  const features = [
    {
      icon: Shield,
      title: "Corpus Protection Engine",
      description: "Prevents depletion of temple funds by preserving 100% principal corpus. Only yield is used for operations, ensuring perpetual sustainability.",
      gradient: "from-[#0B5A7C] to-[#1077A3]",
    },
    {
      icon: TrendingUp,
      title: "High-Yield Treasury Vaults (8–15% APY)",
      description: "Powered by institutional-grade decentralized finance strategies. Safe, secure, and transparent yield generation for temple funds.",
      gradient: "from-[#1077A3] to-[#2088B4]",
    },
    {
      icon: CreditCard,
      title: "Automated Salary & Vendor Payments",
      description: "Scheduled monthly payouts directly to bank accounts. Automate priests' salaries, vendor payments, and operational expenses seamlessly.",
      gradient: "from-[#0B5A7C] to-[#C8861D]",
    },
    {
      icon: Users,
      title: "Donor Transparency Dashboard",
      description: "Devotees can track how their donations support temple operations. Real-time visibility builds trust and encourages more contributions.",
      gradient: "from-[#C8861D] to-[#D4A540]",
    },
    {
      icon: FileText,
      title: "Compliance Automation",
      description: "Auto-generated reports, 80G certificates & Form 10BD filing support. Stay compliant with minimal effort and zero errors.",
      gradient: "from-[#D4A540] to-[#E8B954]",
    },
    {
      icon: Lock,
      title: "Smart Security & Auditability",
      description: "ERC-4626 standardized vaults with on-chain transparency for trustees. Every transaction is verifiable and auditable.",
      gradient: "from-[#1077A3] to-[#0B5A7C]",
    },
    {
      icon: Zap,
      title: "Zero Crypto Complexity UI",
      description: "Experience designed in temple language: 'Digital Fixed Deposit', 'Corpus Protection', 'Automated Salary'. No blockchain knowledge needed.",
      gradient: "from-[#0B5A7C] to-[#C8861D]",
    },
    {
      icon: Building2,
      title: "Seamless Bank Integration",
      description: "Works alongside existing bank accounts and temple ERP systems. Integrate with your current financial infrastructure effortlessly.",
      gradient: "from-[#C8861D] to-[#1077A3]",
    },
  ]

  return (
    <section id="features" className="relative px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.1),transparent_50%)]" />
      
      <div className="relative">
      <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#0B5A7C]/20 to-[#C8861D]/20 border border-[#0B5A7C]/30 mb-4 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-[#0B5A7C]" />
            <p className="text-sm font-medium text-[#0B5A7C]">8 Key Features</p>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground via-[#0B5A7C] to-[#C8861D] bg-clip-text text-transparent">
            8 Key Features That Make Digikosh Unique
        </h2>
        <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
            Everything you need to transform temple donations into a self-sustaining financial future
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <Card 
              key={idx} 
                className="group hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm cursor-pointer"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <CardContent className="p-6 relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed group-hover:text-foreground/80 transition-colors">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
        </div>
      </div>
    </section>
  )
}
