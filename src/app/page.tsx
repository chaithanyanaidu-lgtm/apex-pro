"use client";

import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Pricing from '@/components/landing/Pricing'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-apex-text selection:bg-apex-accent selection:text-bg">
      <Navbar />
      <Hero />

      {/* Ticker Section from original design */}
      <div className="ticker bg-apex-accent py-2.5 overflow-hidden whitespace-nowrap">
        <div className="ticker-inner inline-block animate-tick font-mono text-[0.7rem] font-bold tracking-[3px] uppercase text-bg">
          TRAIN. EAT. DOMINATE. &nbsp; • &nbsp; SCIENTIFIC PRECISION &nbsp; • &nbsp; ELITE PERFORMANCE &nbsp; • &nbsp; BEYOND LIMITS &nbsp; • &nbsp;
          TRAIN. EAT. DOMINATE. &nbsp; • &nbsp; SCIENTIFIC PRECISION &nbsp; • &nbsp; ELITE PERFORMANCE &nbsp; • &nbsp; BEYOND LIMITS &nbsp; • &nbsp;
        </div>
      </div>

      <Features />
      <Pricing />

      {/* CTA Band from original design */}
      <section className="bg-apex-accent py-[90px] px-6 lg:px-[60px] flex flex-col lg:flex-row justify-between items-center gap-10">
        <h2 className="font-display text-[44px] lg:text-[72px] text-bg leading-none uppercase">
          FORGE YOUR <br className="hidden lg:block" />APEX
        </h2>
        <button className="bg-bg text-apex-accent px-10 py-4 text-[0.9rem] font-bold tracking-[2px] uppercase transition-colors hover:bg-zinc-900 border-none w-full lg:w-auto">
          JOIN THE ELITE
        </button>
      </section>

      <Footer />
    </main>
  )
}
