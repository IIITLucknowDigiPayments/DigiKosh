"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Wallet, TrendingUp, Users, Clock, CheckCircle2, Sparkles } from "lucide-react"

export function LandingHowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Wallet,
      title: "Create Digital Treasury Vault",
      description: "Set up your temple's digital treasury vault and deposit donations. Your corpus remains 100% protected.",
      gradient: "from-[#0B5A7C] via-[#1077A3] to-[#2088B4]",
      bgGradient: "from-[#0B5A7C]/10 via-[#1077A3]/10 to-[#2088B4]/10",
      borderColor: "border-[#0B5A7C]/30",
    },
    {
      number: "02",
      icon: TrendingUp,
      title: "Generate 8-15% Annual Yield",
      description: "Your funds automatically generate yield through institutional-grade DeFi strategies. No manual work needed.",
      gradient: "from-[#1077A3] via-[#2088B4] to-[#C8861D]",
      bgGradient: "from-[#1077A3]/10 via-[#2088B4]/10 to-[#C8861D]/10",
      borderColor: "border-[#1077A3]/30",
    },
    {
      number: "03",
      icon: Users,
      title: "Configure Automated Payments",
      description: "Set up automated monthly payouts for priests' salaries, vendor payments, and operational expenses.",
      gradient: "from-[#C8861D] via-[#D4A540] to-[#1077A3]",
      bgGradient: "from-[#C8861D]/10 via-[#D4A540]/10 to-[#1077A3]/10",
      borderColor: "border-[#C8861D]/30",
    },
    {
      number: "04",
      icon: Clock,
      title: "Automatic Monthly Distributions",
      description: "Yield is automatically distributed to bank accounts on schedule. Set it and forget it — your temple operations run smoothly.",
      gradient: "from-[#0B5A7C] via-[#C8861D] to-[#1077A3]",
      bgGradient: "from-[#0B5A7C]/10 via-[#C8861D]/10 to-[#1077A3]/10",
      borderColor: "border-[#0B5A7C]/30",
    },
  ]

  const features = [
    "100% Corpus Protected",
    "Fully Automated Payments",
    "Secure & Transparent",
    "Compliance Ready",
  ]

  return (
    <section id="how-it-works" className="relative px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
      
      <div className="relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#0B5A7C]/20 to-[#C8861D]/20 border border-[#0B5A7C]/30 mb-4 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#0B5A7C]" />
            <p className="text-sm font-medium text-[#0B5A7C]">Sacred Process</p>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-[#0B5A7C] via-[#1077A3] to-[#C8861D] bg-clip-text text-transparent">
            How Digikosh Works
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Transform your temple donations into a self-sustaining financial system in minutes. Our platform handles everything automatically.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <Card
                key={idx}
                className={`group relative overflow-hidden border-2 ${step.borderColor} hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm hover:scale-105 active:scale-95 cursor-pointer`}
              >
                {/* Animated gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} />
                
                {/* Number badge */}
                <div className="absolute top-3 right-3 z-10">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-white font-bold text-sm">{step.number}</span>
                  </div>
                </div>

                <CardContent className="p-5 relative z-0">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-3 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent pr-10">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed text-xs">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B5A7C] to-[#C8861D] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-lg bg-gradient-to-r from-foreground to-[#0B5A7C] bg-clip-text text-transparent group-hover:text-[#0B5A7C] transition-colors">
                  {feature}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-[#0B5A7C]/10 via-[#1077A3]/10 to-[#C8861D]/10 border-2 border-[#0B5A7C]/20 backdrop-blur-md">
            <p className="text-base text-foreground/80 mb-2">
              Ready to transform your temple's financial future?
            </p>
            <p className="text-xl font-bold bg-gradient-to-r from-[#0B5A7C] via-[#1077A3] to-[#C8861D] bg-clip-text text-transparent">
              Create your digital treasury vault in under 5 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

