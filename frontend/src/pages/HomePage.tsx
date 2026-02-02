/**
 * Premium HomePage Component
 * High-conversion landing page with modern Web3 aesthetics
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import {
  IoArrowForward,
  IoSparkles,
  IoShieldCheckmark,
  IoLockClosed,
  IoCheckmarkCircle,
  IoTrendingUp,
  IoPeople,
  IoWallet,
  IoStatsChart
} from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Layout } from '../components/Layout'
import { Badge } from '../components/Badge'
import { cn } from '../utils/cn'

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mark body as GSAP ready for CSS fallback system
    document.body.classList.add('gsap-ready')
    
    const ctx = gsap.context(() => {
      // Set initial state explicitly to ensure visibility
      gsap.set('.hero-child', { opacity: 1, y: 0 })
      
      // Hero Animation
      gsap.from('.hero-child', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power4.out',
        clearProps: 'all' // Clear inline styles after animation completes
      })

      // Floating Animation for Hero Image/Icon
      gsap.to('.float-element', {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })
    })

    return () => ctx.revert()
  }, [])

  const features = [
    {
      title: 'Define Your Mission',
      description: 'Set clear, measurable goals. Whether it\'s hitting the gym, finishing a repo, or waking up early.',
      icon: IoSparkles,
      color: 'indigo'
    },
    {
      title: 'Stake Your Claim',
      description: 'Lock cryptocurrency into a secure smart contract escrow. Your commitment is now backed by skin in the game.',
      icon: IoWallet,
      color: 'cyan'
    },
    {
      title: 'AI Verification',
      description: 'Submit proof via images or data. Our advanced AI agents verify your progress with uncompromising accuracy.',
      icon: IoShieldCheckmark,
      color: 'indigo'
    },
    {
      title: 'Success or Forfeit',
      description: 'Complete the goal and get your stake back. Fail, and your funds are distributed according to the contract rules.',
      icon: IoLockClosed,
      color: 'cyan'
    }
  ]

  return (
    <Layout>
      <div className="relative overflow-visible">
        {/* Decorative Blobs */}
        <div className="absolute top-[-100px] left-[-200px] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute top-[200px] right-[-200px] w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '1s' }} />

        {/* Hero Section */}
        <section ref={heroRef} className="relative py-20 lg:py-32 flex flex-col items-center text-center">
          <div className="hero-child inline-block mb-6">
            <Badge variant="primary" pulse dot className="px-4 py-2 text-xs uppercase tracking-widest font-bold">
              v1.0 is Now Live on Base
            </Badge>
          </div>

          <h1 className="hero-child text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight dark:text-white mb-8 leading-[1.05]">
            Accountability<br />
            <span className="gradient-text">Enforced by AI.</span>
          </h1>

          <p className="hero-child text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The world's first AI-powered accountability agent.
            Lock your stake, submit your proof, and let the agent ensure you never fail your promises again.
          </p>

          <div className="hero-child flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/create-goal">
              <Button variant="gradient" size="xl" className="px-10 py-5 text-lg shadow-2xl hover-glow-primary" icon={<IoArrowForward />}>
                Create Your First Goal
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="glass" size="xl" className="px-10 py-5 text-lg">
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Hero Visual */}
          <div className="hero-child mt-24 relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden glass-strong border border-white/20 shadow-[0_0_80px_rgba(99,102,241,0.15)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
            <div className="p-4 md:p-8 bg-black/[0.02] dark:bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1.5 font-bold">
                  <div className="w-3 h-3 rounded-full bg-red-400/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/50" />
                  <div className="w-3 h-3 rounded-full bg-green-400/50" />
                </div>
                <div className="h-6 px-4 bg-white/10 rounded-full text-[10px] text-gray-400 font-mono flex items-center">
                  pledgeagent.finance/dashboard
                </div>
              </div>

              {/* Mock Dashboard Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                <div className="col-span-1 space-y-4">
                  <div className="h-32 rounded-2xl glass-strong border border-white/10" />
                  <div className="h-48 rounded-2xl glass-strong border border-white/10" />
                </div>
                <div className="col-span-2">
                  <div className="h-full rounded-2xl glass-strong border border-white/10 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl text-white/5 opacity-10">
                      <IoStatsChart />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-24 border-y border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="container-custom grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: 'Total Value Staked', value: '$840,293', icon: <IoWallet /> },
              { label: 'Success Rate', value: '92.4%', icon: <IoCheckmarkCircle /> },
              { label: 'Active Users', value: '12.8k+', icon: <IoPeople /> },
              { label: 'AI Verifications', value: '450k+', icon: <IoTrendingUp /> }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-4 text-2xl">
                  {stat.icon}
                </div>
                <div className="text-4xl font-heading font-black text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features / How it works */}
        <section ref={featuresRef} className="py-32">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-4">Our Protocol</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold dark:text-white mb-6">
              How the Agent Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A transparent, decentralized accountability system powered by advanced AI.
              Simple, uncompromising, and highly effective.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <Card key={i} variant="elevated" hover shine className="group">
                <div className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg',
                  feature.color === 'indigo'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-cyan-500 text-white'
                )}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4 dark:text-white group-hover:gradient-text">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="rounded-[40px] bg-gradient-to-br from-indigo-600 to-indigo-900 p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            {/* Shapes */}
            <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-white/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-cyan-500/20 blur-[80px] rounded-full" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-8">
                Ready to become<br />
                unforgettable?
              </h2>
              <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
                Join 12,000+ top performers who use PledgeAgent to master their consistency.
                Your future self will thank you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/create-goal" className="w-full sm:w-auto">
                  <Button variant="white" size="xl" className="w-full sm:w-auto px-12 py-5 font-bold shadow-xl">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/how-it-works" className="w-full sm:w-auto">
                  <Button variant="glass" size="xl" className="w-full sm:w-auto px-12 py-5 text-white border-white/20">
                    See the Protocol
                  </Button>
                </Link>
              </div>
              <p className="mt-8 text-indigo-200/60 text-sm font-bold uppercase tracking-widest">
                No credit card required • Gas fees on Base are &lt; $0.01
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
