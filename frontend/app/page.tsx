"use client"

import { useState } from "react"
import { LandingHeader } from "@/components/landing-header"
import { LandingHero } from "@/components/landing-hero"
import { LandingService } from "@/components/landing-service"
import { LandingFeatures } from "@/components/landing-features"
import { LandingHowItWorks } from "@/components/landing-how-it-works"
import { LandingImpact } from "@/components/landing-impact"
import { LandingCTA } from "@/components/landing-cta"
import { LandingFooter } from "@/components/landing-footer"
import { WalletConnectModal } from "@/components/wallet-connect-modal"

export default function Home() {
  const [showWalletModal, setShowWalletModal] = useState(false)

  return (
    <>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(11,90,124,0.08),transparent_50%)] animate-float" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(200,134,29,0.08),transparent_50%)] animate-float" style={{ animationDelay: '2s' }} />
      <main className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <LandingHeader onConnectWallet={() => setShowWalletModal(true)} />
        <LandingHero onGetStarted={() => setShowWalletModal(true)} />
        <LandingService />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingImpact />
        <LandingCTA onGetStarted={() => setShowWalletModal(true)} />
        <LandingFooter onGetStarted={() => setShowWalletModal(true)} />
      </main>
      <WalletConnectModal open={showWalletModal} onOpenChange={setShowWalletModal} />
    </>
  )
}
