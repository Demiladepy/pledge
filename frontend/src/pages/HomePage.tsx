import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { IoArrowForward, IoSparkles, IoShieldCheckmark, IoAnalytics } from 'react-icons/io5'
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
      icon: IoSparkles,
      route: '/create-goal',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Submit Proof',
      description: 'Upload images or evidence to verify you\'ve completed your goal.',
      icon: IoShieldCheckmark,
      route: '/submit-proof',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Track Progress',
      description: 'Monitor your goals, view statistics, and build your success streak.',
      icon: IoAnalytics,
      route: '/dashboard',
      gradient: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <Layout>
      <div ref={containerRef} className="space-y-12">
        {/* Hero Section */}
        <div className="text-center py-16 md:py-24">
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Make Your Goals{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Accountable
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Stake your crypto to commit to your goals. Get verified with{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">AI-powered</span> proof
            checking. Build an unstoppable success streak.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.route}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el
                }}
              >
                <Link to={feature.route}>
                  <Card
                    hover
                    gradient
                    className="h-full cursor-pointer group relative overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <div className="relative">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {feature.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-16">
          {[
            { label: 'Active Users', value: '1.2K', gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Goals Locked', value: '$580K', gradient: 'from-green-500 to-emerald-500' },
            { label: 'Success Rate', value: '87%', gradient: 'from-purple-500 to-pink-500' },
            { label: 'Total Verified', value: '5.4K', gradient: 'from-orange-500 to-red-500' },
          ].map((stat) => (
            <Card
              key={stat.label}
              hover
              className="text-center relative overflow-hidden group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
              <div className="relative">
                <div
                  className={`text-4xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}
                >
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
