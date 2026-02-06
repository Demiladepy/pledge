/**
 * Premium DashboardPage Component
 * High-performance, institutional-grade console for tracking progress
 */

import { useState, useEffect } from 'react'
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTrendingUp,
  IoRefresh,
  IoFlame,
  IoWallet,
  IoRocket,
  IoFlash,
  IoSearch,
  IoShieldCheckmark,
  IoCloudOffline,
  IoCheckmarkDone
} from 'react-icons/io5'
import { Button, IconButton } from '../components/Button'
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../components/Card'
import { Input } from '../components/Input'
import { Badge } from '../components/Badge'
import { Layout } from '../components/Layout'
import { Alert } from '../components/Alert'
import { userAPI, systemAPI, UserStats, ActivityItem, SystemStatus } from '../utils/api'
import { Link } from 'react-router-dom'
import { AddressDisplay } from '../components/Web3Components'
import { cn } from '../utils/cn'

export function DashboardPage() {
  const [userId, setUserId] = useState(
    localStorage.getItem('userId') || 'anon_' + Math.random().toString(36).substr(2, 6),
  )
  const [inputUserId, setInputUserId] = useState(userId)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('userId', userId)
    fetchAllData(userId)
  }, [userId])

  // Auto-refresh every 30 seconds for real-time feel
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData(userId)
    }, 30000)
    return () => clearInterval(interval)
  }, [userId])

  const fetchAllData = async (id: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch all data in parallel
      const [statsData, activityData, statusData] = await Promise.all([
        userAPI.getStats(id).catch(() => null),
        userAPI.getActivity(id, 5).catch(() => []),
        systemAPI.getStatus().catch(() => null)
      ])
      
      if (statsData) setStats(statsData)
      setActivity(activityData)
      if (statusData) setSystemStatus(statusData)
      
      if (!statsData) {
        setError('Unable to fetch user stats. Please check backend connection.')
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('Network Error') || err.message.includes('ECONNREFUSED')) {
          setError('Backend server is offline. Start the server with: cd pledgeagent/backend && python -m uvicorn api.main:app --reload')
        } else {
          setError(err.message)
        }
      } else {
        setError('Failed to load dashboard data. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Format relative time
  const formatRelativeTime = (dateStr: string | null) => {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  const handleRefresh = () => {
    fetchAllData(userId)
  }

  const statCards = [
    {
      label: 'Success Rate',
      value: stats ? `${(stats.approval_rate * 100).toFixed(1)}%` : '0%',
      icon: IoTrendingUp,
      color: 'indigo',
    },
    {
      label: 'Active Goals',
      value: stats?.total_goals || 0,
      icon: IoRocket,
      color: 'cyan',
    },
    {
      label: 'Verified Wins',
      value: stats?.approved_count || 0,
      icon: IoCheckmarkCircle,
      color: 'indigo',
    },
    {
      label: 'Total Staked',
      value: stats ? `$${stats.total_stake_locked.toFixed(0)}` : '$0',
      icon: IoWallet,
      color: 'cyan',
    },
  ]

  return (
    <Layout>
      <div className="space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-heading font-black dark:text-white tracking-tight">
              Protocol Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Awaiting verification on {stats?.total_goals || 0} active commitments.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Input
                placeholder="Switch identity..."
                value={inputUserId}
                onChange={(e) => setInputUserId(e.target.value)}
                leftIcon={<IoSearch />}
                className="!py-2.5"
              />
            </div>
            <IconButton
              icon={<IoRefresh className={isLoading ? 'animate-spin' : ''} />}
              variant="glass"
              onClick={handleRefresh}
              aria-label="Refresh stats"
            />
          </div>
        </div>

        {error && <Alert variant="error" title="Sync Error" className="mb-8">{error}</Alert>}

        {/* System Status Indicator */}
        {systemStatus && (
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge variant={systemStatus.database_connected ? 'success' : 'danger'} size="sm">
              {systemStatus.database_connected ? <IoCheckmarkDone className="mr-1" /> : <IoCloudOffline className="mr-1" />}
              DB: {systemStatus.database_connected ? 'Connected' : 'Offline'}
            </Badge>
            <Badge variant={systemStatus.blockchain_connected ? 'success' : 'warning'} size="sm">
              {systemStatus.blockchain_connected ? <IoCheckmarkDone className="mr-1" /> : <IoCloudOffline className="mr-1" />}
              Blockchain: {systemStatus.blockchain_connected ? 'Connected' : 'Offline'}
            </Badge>
            <Badge variant={systemStatus.gemini_enabled ? 'success' : 'warning'} size="sm">
              Gemini AI: {systemStatus.gemini_enabled ? 'Active' : 'Offline'}
            </Badge>
            {systemStatus.opik_enabled ? (
              <a 
                href={systemStatus.opik_dashboard_url || 'https://www.comet.com/opik'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Badge variant="success" size="sm" className="cursor-pointer hover:opacity-80">
                  <IoCheckmarkDone className="mr-1" />
                  Opik Dashboard →
                </Badge>
              </a>
            ) : (
              <Badge variant="secondary" size="sm">
                Opik: Disabled
              </Badge>
            )}
          </div>
        )}

        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))
          ) : (
            statCards.map((card, idx) => (
              <Card key={idx} variant="glass" hover className="flex flex-col items-center justify-center py-8">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110',
                  card.color === 'indigo' ? 'bg-indigo-600 text-white' : 'bg-cyan-500 text-white'
                )}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-heading font-black mb-1 dark:text-white tracking-tight">
                  {card.value}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  {card.label}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Main Console Content */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column: Streaks and Performance */}
          <div className="lg:col-span-2 space-y-8">

            {/* Success Streak */}
            <Card variant="gradient" shine className="relative overflow-hidden min-h-[300px] flex flex-col justify-center text-center py-12">
              <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
              <div className="absolute bottom-[-10%] right-[-10%] w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 mb-6 bg-amber-500/20 text-amber-500 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px] animate-pulse">
                  <IoFlame /> Current Streak
                </div>

                <div className="text-9xl font-heading font-black gradient-text py-2">
                  {isLoading ? '...' : stats?.current_streak || 0}
                </div>

                <h3 className="text-xl font-heading font-bold dark:text-white mt-4">
                  Day Success Streak
                </h3>
                <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                  You're in the top 5% of all users this week. Don't break the chain.
                </p>
              </div>
            </Card>

            {/* Performance Visualization */}
            <Card variant="elevated">
              <CardHeader action={<Badge variant="info">Protocol Adaption</Badge>}>
                <CardTitle>Performance Audit</CardTitle>
                <CardDescription>AI behavior adaptation based on consistency metrics.</CardDescription>
              </CardHeader>
              <CardBody className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Approval Loyalty</span>
                    <span className="text-2xl font-black gradient-text">{(stats?.approval_rate || 0) * 100}%</span>
                  </div>
                  <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-1000 ease-in-out"
                      style={{ width: `${(stats?.approval_rate || 0) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Agent Persona</div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600/10 text-indigo-500 flex items-center justify-center text-xl">
                        <IoFlash />
                      </div>
                      <div>
                        <span className="font-bold dark:text-white block">{stats?.personality_mode || 'Analyzing...'}</span>
                        <span className="text-xs text-gray-400">Adaptive response mode active.</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Risk Exposure</div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-600/10 text-cyan-500 flex items-center justify-center text-xl">
                        <IoShieldCheckmark />
                      </div>
                      <div>
                        <span className="font-bold dark:text-white block">Institutional</span>
                        <span className="text-xs text-gray-400">All protocol guardians active.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column: Actions and Identity */}
          <div className="space-y-8">

            {/* Quick Commit */}
            <Card variant="glass" shine className="bg-indigo-600 text-white border-none shadow-indigo-500/20">
              <CardHeader>
                <CardTitle className="text-white">Protocol Commit</CardTitle>
                <CardDescription className="text-indigo-100">Quickly launch a new goal.</CardDescription>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <Link to="/create-goal">
                    <Button variant="white" fullWidth size="lg" className="font-bold shadow-xl">
                      New Commitment
                    </Button>
                  </Link>
                  <Link to="/submit-proof">
                    <Button variant="glass" fullWidth size="lg" className="border-white/20 text-white font-bold">
                      Submit Proof
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>

            {/* Protocol Identity */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Identity Node</CardTitle>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[2px]">
                    <div className="w-full h-full rounded-[14px] bg-white dark:bg-gray-950 flex items-center justify-center text-4xl">
                      👾
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-black uppercase tracking-widest text-gray-400 block mb-1">Authenticated as</span>
                    <AddressDisplay address={userId} showFull={false} className="border-none bg-transparent !p-0" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Protocol Rank</span>
                    <Badge variant="primary">{stats?.protocol_rank || 'Newcomer'}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Last Proof</span>
                    <span className="font-bold dark:text-white">{formatRelativeTime(stats?.last_proof_date || null)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Total Rewards</span>
                    <span className="font-bold text-success-500">+{stats?.total_rewards || 0} PA</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Live Activity Feed - Real Data */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-2">Protocol Activity</h4>
              <div className="space-y-3">
                {activity.length > 0 ? (
                  activity.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 items-center hover:opacity-100 transition-all">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center",
                        item.event_type === 'verification_success' ? "bg-success-100 dark:bg-success-900/30" : "bg-error-100 dark:bg-error-900/30"
                      )}>
                        {item.event_type === 'verification_success' ? (
                          <IoCheckmarkCircle className="text-success-500" />
                        ) : (
                          <IoCloseCircle className="text-error-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold dark:text-white truncate">{item.description}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">
                          {formatRelativeTime(item.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-400 text-sm">
                    <p>No activity yet.</p>
                    <p className="text-xs mt-1">Submit your first proof to see activity here.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Global Stats or Newsletter etc */}
        <div className="pt-20">
          <Card variant="glass" className="bg-gradient-to-r from-gray-900 to-black text-white py-12 px-8 overflow-hidden relative border-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                <h3 className="text-3xl font-heading font-black mb-4">Master Your Accountability.</h3>
                <p className="text-gray-400 text-lg">PledgeAgent AI is getting smarter. New verification modes launching next month for professional developers and athletes.</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <Button variant="white" size="lg" className="flex-1 md:flex-none font-bold">Read Docs</Button>
                <Button variant="glass" size="lg" className="flex-1 md:flex-none border-white/20 text-white font-bold">Protocol Status</Button>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </Layout>
  )
}
