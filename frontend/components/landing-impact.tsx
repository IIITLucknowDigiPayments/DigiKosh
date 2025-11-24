"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Globe, Heart, Award, Zap, Target } from "lucide-react"

export function LandingImpact() {
  const stats = [
    {
      icon: DollarSign,
      value: "₹21.3Cr",
      label: "Divine Blessings Generated",
      change: "+28% This Year",
      gradient: "from-[#0B5A7C] via-[#1077A3] to-[#2088B4]",
      bgGradient: "from-[#0B5A7C]/20 via-[#1077A3]/20 to-[#2088B4]/20",
    },
    {
      icon: Users,
      value: "1,008",
      label: "Temple Sevadharis Supported",
      change: "+54% This Year",
      gradient: "from-[#1077A3] via-[#2088B4] to-[#C8861D]",
      bgGradient: "from-[#1077A3]/20 via-[#2088B4]/20 to-[#C8861D]/20",
    },
    {
      icon: Globe,
      value: "108",
      label: "Sacred Temples Empowered",
      change: "+18% This Year",
      gradient: "from-[#C8861D] via-[#D4A540] to-[#E8B954]",
      bgGradient: "from-[#C8861D]/20 via-[#D4A540]/20 to-[#E8B954]/20",
    },
    {
      icon: Heart,
      value: "₹14.8Cr",
      label: "Sacred Seva Distributed",
      change: "+32% This Year",
      gradient: "from-[#0B5A7C] via-[#C8861D] to-[#1077A3]",
      bgGradient: "from-[#0B5A7C]/20 via-[#C8861D]/20 to-[#1077A3]/20",
    },
  ]

  const impactAreas = [
    {
      icon: Target,
      title: "Temple Priests & Pandits",
      description: "Supporting temple priests and vedic scholars serving divine communities with sacred knowledge",
      gradient: "from-[#0B5A7C] to-[#1077A3]",
      bgGradient: "from-[#0B5A7C]/10 to-[#1077A3]/10",
      projects: "45 temples",
      amount: "₹5.4Cr",
    },
    {
      icon: Heart,
      title: "Community Annadanam",
      description: "Funding sacred food distribution and feeding programs for devotees and underprivileged",
      gradient: "from-[#1077A3] to-[#C8861D]",
      bgGradient: "from-[#1077A3]/10 to-[#C8861D]/10",
      projects: "28 programs",
      amount: "₹3.2Cr",
    },
    {
      icon: Globe,
      title: "Temple Maintenance",
      description: "Supporting temple infrastructure, renovation and preservation of sacred heritage",
      gradient: "from-[#C8861D] to-[#D4A540]",
      bgGradient: "from-[#C8861D]/10 to-[#D4A540]/10",
      projects: "35 temples",
      amount: "₹4.8Cr",
    },
    {
      icon: Award,
      title: "Vedic Education",
      description: "Empowering gurukuls and vedic schools to preserve ancient wisdom and culture",
      gradient: "from-[#0B5A7C] to-[#C8861D]",
      bgGradient: "from-[#0B5A7C]/10 to-[#C8861D]/10",
      projects: "18 gurukuls",
      amount: "₹1.4Cr",
    },
  ]

  const achievements = [
    {
      icon: Zap,
      title: "100% Dharmic & Transparent",
      description: "Every sacred transaction follows dharmic principles and is verifiable",
      color: "text-[#C8861D]",
    },
    {
      icon: TrendingUp,
      title: "Sustainable Divine Growth",
      description: "Continuous divine blessings for long-term temple seva",
      color: "text-[#1077A3]",
    },
    {
      icon: Users,
      title: "Temple Community Driven",
      description: "Decisions made by temple committees and devotee stakeholders",
      color: "text-[#0B5A7C]",
    },
  ]

  return (
    <section id="impact" className="relative px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B5A7C]/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(11,90,124,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(200,134,29,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(16,119,163,0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,165,64,0.1),transparent_60%)]" />
      
      <div className="relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#0B5A7C]/20 to-[#C8861D]/20 border border-[#0B5A7C]/30 mb-4 backdrop-blur-sm">
            <Heart className="w-4 h-4 text-[#0B5A7C]" />
            <p className="text-sm font-medium text-[#0B5A7C]">Divine Impact</p>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#0B5A7C] via-[#1077A3] via-[#C8861D] to-[#D4A540] bg-clip-text text-transparent">
            Creating Sacred Temple Impact
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            See how Temple Zone is transforming the way sacred communities and temple sevadharis receive sustainable divine support
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card
                key={idx}
                className={`group relative overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all duration-500 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm hover:scale-105 active:scale-95 hover:shadow-2xl cursor-pointer`}
              >
                {/* Animated gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <CardContent className="p-8 relative">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-6 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Value */}
                  <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm font-medium text-foreground/70 mb-2">
                    {stat.label}
                  </div>
                  
                  {/* Change */}
                  <div className="text-xs font-semibold text-green-500">
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Impact Areas */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-foreground via-[#0B5A7C] to-[#C8861D] bg-clip-text text-transparent">
            Sacred Seva Areas
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {impactAreas.map((area, idx) => {
              const Icon = area.icon
              return (
                <Card
                  key={idx}
                  className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-500 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${area.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <CardContent className="p-8 relative">
                    <div className="flex items-start gap-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${area.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl flex-shrink-0`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                          {area.title}
                        </h4>
                        <p className="text-foreground/70 mb-4 leading-relaxed">
                          {area.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                            <span className="text-sm font-semibold text-primary">{area.projects}</span>
                          </div>
                          <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${area.bgGradient} border border-primary/20`}>
                            <span className={`text-sm font-bold bg-gradient-to-r ${area.gradient} bg-clip-text text-transparent`}>{area.amount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="grid md:grid-cols-3 gap-6">
          {achievements.map((achievement, idx) => {
            const Icon = achievement.icon
            return (
              <div
                key={idx}
                className="group p-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-center cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl`}>
                  <Icon className={`w-8 h-8 ${achievement.color}`} />
                </div>
                <h4 className="text-xl font-bold mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  {achievement.title}
                </h4>
                <p className="text-foreground/70 leading-relaxed">
                  {achievement.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-[#0B5A7C]/10 via-[#1077A3]/10 via-[#C8861D]/10 to-[#D4A540]/10 border-2 border-[#0B5A7C]/20 backdrop-blur-md">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Heart className="w-5 h-5 text-[#C8861D]" />
              <p className="text-xl font-bold bg-gradient-to-r from-[#0B5A7C] via-[#1077A3] to-[#C8861D] bg-clip-text text-transparent">
                Join the Divine Movement
              </p>
            </div>
            <p className="text-base text-foreground/80">
              Be part of a sacred temple seva revolution
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

