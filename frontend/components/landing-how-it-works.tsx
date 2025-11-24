"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Wallet, TrendingUp, Users, Clock, CheckCircle2, Sparkles } from "lucide-react"

export function LandingHowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Wallet,
      title: "Create Your Vault",
      description: "Set up a vault and deposit funds. Your money stays safe and secure.",
      gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
      bgGradient: "from-violet-500/10 via-purple-500/10 to-fuchsia-500/10",
      borderColor: "border-violet-500/30",
    },
    {
      number: "02",
      icon: TrendingUp,
      title: "Generate Yield Automatically",
      description: "Your funds automatically generate yield through DeFi protocols. No manual work needed.",
      gradient: "from-purple-600 via-fuchsia-600 to-violet-600",
      bgGradient: "from-purple-500/10 via-fuchsia-500/10 to-violet-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      number: "03",
      icon: Users,
      title: "Add Contributors",
      description: "Invite team members and set their allocation percentages. They can be nominated or added directly.",
      gradient: "from-fuchsia-600 via-violet-600 to-purple-600",
      bgGradient: "from-fuchsia-500/10 via-violet-500/10 to-purple-500/10",
      borderColor: "border-fuchsia-500/30",
    },
    {
      number: "04",
      icon: Clock,
      title: "Automatic Distribution",
      description: "Yield is automatically distributed to contributors on schedule. Set it and forget it.",
      gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
      bgGradient: "from-violet-500/10 via-purple-500/10 to-fuchsia-500/10",
      borderColor: "border-violet-500/30",
    },
  ]

  const features = [
    "100% Transparent",
    "Fully Automated",
    "Secure & Safe",
    "Community Governed",
  ]

  return (
    <section id="how-it-works" className="relative px-4 sm:px-6 lg:px-8 py-32 max-w-7xl mx-auto overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
      
      <div className="relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-primary">Simple Process</p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Get started in minutes. Our platform handles everything automatically, so you can focus on what matters.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <Card
                key={idx}
                className={`group relative overflow-hidden border-2 ${step.borderColor} hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm hover:scale-105`}
              >
                {/* Animated gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} />
                
                {/* Number badge */}
                <div className="absolute top-3 right-3 z-10">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-white font-bold text-sm">{step.number}</span>
                  </div>
                </div>

                <CardContent className="p-6 relative z-0">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent pr-12">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">
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
              className="group p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-lg bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  {feature}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-cyan-500/10 border-2 border-primary/20 backdrop-blur-md">
            <p className="text-lg text-foreground/80 mb-2">
              Ready to get started?
            </p>
            <p className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Create your vault in under 5 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

