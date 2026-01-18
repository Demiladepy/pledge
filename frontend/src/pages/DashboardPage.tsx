import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTrendingUp,
  IoPerson,
  IoRefresh,
} from 'react-icons/io5'
import { Button } from '../components/Button'
import { Card, CardHeader, CardBody } from '../components/Card'
import { Input } from '../components/Input'
import { Badge } from '../components/Badge'
import { Layout } from '../components/Layout'
import { LoadingState } from '../components/Loader'
import { Alert } from '../components/Alert'
import { userAPI, UserStats } from '../utils/api'
import { Link } from 'react-router-dom'

export function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<(HTMLDivElement | null)[]>([])

  const [userId, setUserId] = useState(
    localStorage.getItem('userId') || 'user_' + Math.random().toString(36).substr(2, 9),
  )
  const [inputUserId, setInputUserId] = useState(userId)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('userId', userId)
  }, [userId])

  const fetchStats = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await userAPI.getStats(id)
      setStats(data)

      // Animate stats cards
      gsap.from(statsRef.current, {
        duration: 0.6,
        opacity: 0,
        y: 10,
        stagger: 0.05,
        ease: 'power2.out',
      })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load user stats. Try another ID.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats(userId)
  }, [userId])

  const handleChangeUser = () => {
    if (inputUserId.trim()) {
      setUserId(inputUserId)
    }
  }

  const statCards = [
    {
      label: 'Total Goals',
      value: stats?.total_goals || 0,
      icon: IoTrendingUp,
      color: 'text-blue-600',
    },
    {
      label: 'Approved',
      value: stats?.approved_count || 0,
      icon: IoCheckmarkCircle,
      color: 'text-success',
    },
    {
      label: 'Rejected',
      value: stats?.rejected_count || 0,
      icon: IoCloseCircle,
      color: 'text-danger',
    },
    {
      label: 'Success Rate',
      value: stats ? `${(stats.approval_rate * 100).toFixed(1)}%` : '0%',
      icon: IoTrendingUp,
      color: 'text-primary',
    },
  ]

  return (
    <Layout>
      <div ref={containerRef} className="space-y-8">
        {/* User Selector */}
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
          </CardHeader>
          <CardBody>
            <div className="flex gap-2 flex-col sm:flex-row">
              <Input
                label="User ID"
                value={inputUserId}
                onChange={(e) => setInputUserId(e.target.value)}
                placeholder="Enter your user ID"
                className="flex-1"
              />
              <div className="flex gap-2 sm:self-end">
                <Button
                  onClick={handleChangeUser}
                  variant="secondary"
                  icon={<IoPerson />}
                >
                  Load User
                </Button>
                <Button
                  onClick={() => fetchStats(userId)}
                  variant="secondary"
                  icon={<IoRefresh />}
                >
                  Refresh
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Current User: <code className="bg-gray-100 px-2 py-1 rounded">{userId}</code>
            </p>
          </CardBody>
        </Card>

        {error && <Alert type="error">{error}</Alert>}

        <LoadingState isLoading={isLoading}>
          {stats && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, idx) => {
                  const Icon = card.icon
                  return (
                    <div
                      key={card.label}
                      ref={(el) => {
                        if (el) statsRef.current[idx] = el
                      }}
                    >
                      <Card>
                        <CardBody className="text-center space-y-2">
                          <Icon className={`w-8 h-8 mx-auto ${card.color}`} />
                          <p className="text-2xl font-bold text-gray-900">
                            {card.value}
                          </p>
                          <p className="text-sm text-gray-600">{card.label}</p>
                        </CardBody>
                      </Card>
                    </div>
                  )
                })}
              </div>

              {/* Profile Section */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Streak */}
                  <Card>
                    <CardHeader>
                      <h2 className="text-xl font-bold text-gray-900">
                        Success Streak 🔥
                      </h2>
                    </CardHeader>
                    <CardBody className="text-center space-y-4">
                      <div className="text-6xl font-bold text-primary">
                        {stats.current_streak}
                      </div>
                      <p className="text-gray-600">
                        consecutive successful goals completed
                      </p>
                      <div className="bg-blue-50 p-4 rounded">
                        <p className="text-sm text-gray-700">
                          Keep the streak alive by submitting verified proof for your
                          next goal!
                        </p>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Financial Info */}
                  <Card>
                    <CardHeader>
                      <h2 className="text-xl font-bold text-gray-900">
                        Financial Status
                      </h2>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-gray-700">Total Stake Locked</span>
                        <span className="text-2xl font-bold text-primary">
                          ${stats.total_stake_locked.toFixed(2)}
                        </span>
                      </div>
                      <Alert type="info">
                        <strong>Note:</strong> Stakes are locked until goal completion
                        or duration expires. Submit proof when ready!
                      </Alert>
                    </CardBody>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4 h-fit">
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-bold text-gray-900">
                        Quick Actions
                      </h3>
                    </CardHeader>
                    <CardBody className="space-y-3">
                      <Link to="/create-goal" className="block">
                        <Button className="w-full" variant="success">
                          New Goal
                        </Button>
                      </Link>
                      <Link to="/submit-proof" className="block">
                        <Button className="w-full" variant="primary">
                          Submit Proof
                        </Button>
                      </Link>
                      <Button className="w-full" variant="secondary" disabled>
                        Referral Link (Coming)
                      </Button>
                    </CardBody>
                  </Card>

                  {/* Mode Info */}
                  <Card>
                    <CardBody className="space-y-2">
                      <p className="text-sm text-gray-600">Current Mode</p>
                      <Badge variant="primary">{stats.personality_mode}</Badge>
                      <p className="text-xs text-gray-500 mt-2">
                        Personality adapts based on your success rate
                      </p>
                    </CardBody>
                  </Card>
                </div>
              </div>

              {/* Stats Summary */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-gray-900">
                    Performance Summary
                  </h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Success Rate</span>
                        <span className="font-semibold text-primary">
                          {(stats.approval_rate * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(stats.approval_rate * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 pt-4">
                      <div className="text-center p-3 bg-green-50 rounded">
                        <p className="text-2xl font-bold text-success">
                          {stats.approved_count}
                        </p>
                        <p className="text-sm text-gray-600">Goals Approved</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded">
                        <p className="text-2xl font-bold text-danger">
                          {stats.rejected_count}
                        </p>
                        <p className="text-sm text-gray-600">Goals Rejected</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <p className="text-2xl font-bold text-primary">
                          {stats.total_goals}
                        </p>
                        <p className="text-sm text-gray-600">Total Goals</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </LoadingState>
      </div>
    </Layout>
  )
}
