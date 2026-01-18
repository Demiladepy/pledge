import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { IoArrowForward } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Layout } from '../components/Layout'

export function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    // Animate title on mount
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        duration: 0.8,
        opacity: 0,
        y: -20,
        ease: 'power2.out',
      })
    }

    // Stagger animate cards
    gsap.from(cardsRef.current, {
      duration: 0.6,
      opacity: 0,
      y: 20,
      stagger: 0.1,
      ease: 'power2.out',
    })
  }, [])

  const features = [
    {
      title: 'Create Goals',
      description: 'Define your goal and stake cryptocurrency to keep yourself accountable.',
      icon: '🎯',
      route: '/create-goal',
    },
    {
      title: 'Submit Proof',
      description: 'Upload images or evidence to verify you\'ve completed your goal.',
      icon: '📸',
      route: '/submit-proof',
    },
    {
      title: 'Track Progress',
      description: 'Monitor your goals, view statistics, and build your success streak.',
      icon: '📊',
      route: '/dashboard',
    },
  ]

  return (
    <Layout>
      <div ref={containerRef} className="space-y-12">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1
            ref={titleRef}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            Make Your Goals <span className="text-primary">Accountable</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Stake your crypto to commit to your goals. Get verified with AI-powered
            proof checking. Build an unstoppable success streak.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/create-goal">
              <Button size="lg" icon={<IoArrowForward />}>
                Get Started
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.route}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
            >
              <Link to={feature.route}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h2>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-4 mt-12">
          {[
            { label: 'Active Users', value: '1.2K' },
            { label: 'Goals Locked', value: '$580K' },
            { label: 'Success Rate', value: '87%' },
            { label: 'Total Verified', value: '5.4K' },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
