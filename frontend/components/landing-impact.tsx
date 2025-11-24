"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Globe, Heart, Award, Zap, Target } from "lucide-react"

export function LandingImpact() {
  const stats = [
    {
      icon: DollarSign,
      value: "$2.84M",
      label: "Total Yield Generated",
      change: "+18% YTD",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      bgGradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
    },
    {
      icon: Users,
      value: "427",
      label: "Contributors Funded",
      change: "+45% YTD",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bgGradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
    },
    {
      icon: Globe,
      value: "58",
      label: "Public Projects Supported",
      change: "+12% YTD",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      bgGradient: "from-purple-500/20 via-pink-500/20 to-rose-500/20",
    },
    {
      icon: Heart,
      value: "$1.98M",
      label: "Total Distributed",
      change: "+22% YTD",
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      bgGradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
    },
  ]

  const impactAreas = [
    {
      icon: Target,
      title: "Open Source Development",
      description: "Supporting developers building the future of decentralized technology",
      gradient: "from-blue-500 to-cyan-500",
      projects: "24 projects",
      amount: "$450K",
    },
    {
      icon: Heart,
      title: "Public Health",
      description: "Funding healthcare initiatives and medical research worldwide",
      gradient: "from-pink-500 to-rose-500",
      projects: "12 projects",
      amount: "$320K",
    },
    {
      icon: Globe,
      title: "Climate Action",
      description: "Supporting environmental projects and sustainable solutions",
      gradient: "from-green-500 to-emerald-500",
      projects: "15 projects",
      amount: "$580K",
    },
    {
      icon: Award,
      title: "Education",
      description: "Empowering learners and educators through accessible funding",
      gradient: "from-purple-500 to-violet-500",
      projects: "7 projects",
      amount: "$230K",
    },
  ]

  const achievements = [
    {
      icon: Zap,
      title: "100% Transparent",
      description: "Every transaction is on-chain and verifiable",
      color: "text-yellow-500",
    },
    {
      icon: TrendingUp,
      title: "Sustainable Growth",
      description: "Continuous yield generation for long-term impact",
      color: "text-green-500",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Decisions made by contributors and stakeholders",
      color: "text-blue-500",
    },
  ]

  return (
    <section id="impact" className="relative px-4 sm:px-6 lg:px-8 py-32 max-w-7xl mx-auto overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(168,85,247,0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(236,72,153,0.1),transparent_60%)]" />
      
      <div className="relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-6 backdrop-blur-sm">
            <Heart className="w-4 h-4 text-green-500" />
            <p className="text-sm font-medium text-green-500">Real Impact</p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-500 via-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Making a Real Impact
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            See how DigiKosh is transforming the way teams and projects receive sustainable funding
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card
                key={idx}
                className={`group relative overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all duration-500 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm hover:scale-105 hover:shadow-2xl`}
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
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-foreground via-primary to-purple-500 bg-clip-text text-transparent">
            Impact Areas
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {impactAreas.map((area, idx) => {
              const Icon = area.icon
              return (
                <Card
                  key={idx}
                  className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-500 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm hover:shadow-2xl"
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
                className="group p-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl text-center"
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
        <div className="mt-20 text-center">
          <div className="inline-block p-10 rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/10 via-blue-500/10 to-purple-500/10 border-2 border-primary/20 backdrop-blur-md">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-pink-500" />
              <p className="text-2xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Join the Movement
              </p>
            </div>
            <p className="text-lg text-foreground/80">
              Be part of a sustainable funding revolution
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

