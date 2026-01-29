/**
 * Premium CreateGoalPage Component
 * High-stakes interaction for defining commitments and staking capital
 */

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import {
  IoCheckmarkCircle,
  IoRocket,
  IoCalendar,
  IoShieldCheckmark,
  IoFlame,
  IoSparkles
} from 'react-icons/io5'
import { Button } from '../components/Button'
import { Card, CardHeader, CardBody, CardTitle } from '../components/Card'
import { Input, Textarea } from '../components/Input'
import { Badge } from '../components/Badge'
import { Alert } from '../components/Alert'
import { Layout } from '../components/Layout'
import { goalAPI, Goal } from '../utils/api'
import { Link } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { TokenAmountInput, GasEstimate } from '../components/Web3Components'
import { cn } from '../utils/cn'

export function CreateGoalPage() {
  const formRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [goalId, setGoalId] = useState<string | null>(null)
  const toast = useToast()

  // Form State
  const [formData, setFormData] = useState({
    user_id: localStorage.getItem('userId') || 'user_' + Math.random().toString(36).substr(2, 6),
    description: '',
    stake_amount: '0.05',
    duration_days: 7,
    personality: 'strict'
  })

  // Errors State
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (formRef.current && !success) {
      gsap.from('.form-step', {
        duration: 0.8,
        opacity: 0,
        y: 30,
        stagger: 0.1,
        ease: 'power4.out',
      })
    }
  }, [success])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.description.trim()) {
      newErrors.description = 'What exactly are you committing to?'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Please be more specific with your commitment.'
    }

    if (parseFloat(formData.stake_amount) <= 0) {
      newErrors.stake_amount = 'A stake is required to enforce accountability.'
    }

    if (formData.duration_days < 1) {
      newErrors.duration_days = 'Minimum duration is 1 day.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'description' || name === 'personality' ? value : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      toast.error('Please refine your commitment details.')
      return
    }

    setIsLoading(true)
    try {
      const goal: Goal = {
        goal_id: 'goal_' + Math.random().toString(36).substr(2, 9),
        user_id: formData.user_id,
        description: formData.description,
        stake_amount: parseFloat(formData.stake_amount),
        duration_days: formData.duration_days,
      }

      const response = await goalAPI.create(goal)
      setGoalId(response.goal_id)
      setSuccess(true)
      toast.success(`Protocol Initiated. ${formData.stake_amount} ETH Locked.`)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate protocol.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (success && goalId) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto py-12">
          <Card variant="gradient" shine className="text-center py-12 animate-celebrate">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 animate-ping bg-indigo-500 rounded-full opacity-20" />
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl relative z-10">
                  <IoCheckmarkCircle className="w-12 h-12" />
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-heading font-black dark:text-white mb-4">Protocol Initiated</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto font-medium">
              Your commitment is now locked in a smart contract. The agent is watching.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10 text-left">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Locked Stake</span>
                <span className="font-bold dark:text-white">{formData.stake_amount} ETH</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Time Horizon</span>
                <span className="font-bold dark:text-white">{formData.duration_days} Days</span>
              </div>
              <div className="col-span-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Protocol ID</span>
                <span className="font-mono text-xs dark:text-white truncate block">{goalId}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/dashboard">
                <Button variant="gradient" fullWidth size="xl" icon={<IoRocket />}>Go to Console</Button>
              </Link>
              <Button variant="ghost" fullWidth onClick={() => setSuccess(false)}>Launch Another Commitment</Button>
            </div>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center form-step">
          <Badge variant="primary" className="mb-4">New Commitment</Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-black dark:text-white tracking-tight leading-tight">
            Initiate Accountability<br /><span className="gradient-text">Protocol</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto">
            Locked capital. Verified proof. Absolute consequences.
            Define your journey and let the agent enforce your success.
          </p>
        </div>

        <div ref={formRef} className="grid lg:grid-cols-5 gap-8">

          {/* Main Form Area */}
          <div className="lg:col-span-3 space-y-8">
            <Card variant="elevated" className="form-step">
              <CardBody className="space-y-8">
                {error && <Alert variant="error" title="Initiation Failed">{error}</Alert>}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step 1: Definition */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                      <h3 className="text-lg font-heading font-bold dark:text-white">Commitment Definition</h3>
                    </div>

                    <Textarea
                      label="Your Mission"
                      name="description"
                      placeholder="vague goals fail. Be specific: 'I will go to the gym 5x this week and upload a selfie each time.'"
                      value={formData.description}
                      onChange={handleInputChange}
                      error={errors.description}
                      rows={4}
                      className="text-lg font-medium"
                      showCharCount
                      maxLength={140}
                    />
                  </div>

                  {/* Step 2: Parameters */}
                  <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                      <h3 className="text-lg font-heading font-bold dark:text-white">Protocol Parameters</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <TokenAmountInput
                        value={formData.stake_amount}
                        onChange={(val) => setFormData(p => ({ ...p, stake_amount: val }))}
                        symbol="ETH"
                        balance="1.42" // Mock
                        usdValue={(parseFloat(formData.stake_amount) * 2400).toFixed(2)}
                        error={errors.stake_amount}
                      />

                      <Input
                        label="Time Horizon (Days)"
                        name="duration_days"
                        type="number"
                        leftIcon={<IoCalendar />}
                        value={formData.duration_days}
                        onChange={handleInputChange}
                        error={errors.duration_days}
                        className="text-lg font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Step 3: Agent Personality */}
                  <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                      <h3 className="text-lg font-heading font-bold dark:text-white">Agent Persona</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { id: 'motivational', label: 'Mentor', icon: <IoSparkles /> },
                        { id: 'strict', label: 'Judge', icon: <IoShieldCheckmark /> },
                        { id: 'roast', label: 'Roaster', icon: <IoFlame /> }
                      ].map(mode => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, personality: mode.id }))}
                          className={cn(
                            'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group',
                            formData.personality === mode.id
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20'
                              : 'border-gray-100 dark:border-gray-800 hover:border-indigo-300'
                          )}
                        >
                          <span className="text-2xl group-hover:scale-125 transition-transform">{mode.icon}</span>
                          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{mode.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <Button
                      type="submit"
                      variant="gradient"
                      size="xl"
                      isLoading={isLoading}
                      fullWidth
                      className="h-16 shadow-2xl shadow-indigo-500/30"
                      icon={<IoRocket />}
                    >
                      {isLoading ? 'Initiating Protocol...' : 'Initiate Protocol & Lock Stake'}
                    </Button>
                    <p className="text-center text-[10px] text-gray-500 mt-4 uppercase font-black tracking-widest">
                      By clicking, you authorize the blockchain smart contract to manage your funds.
                    </p>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Right Column: Information / Sidemenu */}
          <div className="lg:col-span-2 space-y-8">
            <Card variant="glass" shine className="form-step">
              <CardHeader>
                <CardTitle>Protocol Rules</CardTitle>
              </CardHeader>
              <CardBody className="space-y-6">
                {[
                  { icon: <IoShieldCheckmark className="text-success-500" />, text: "Funds are locked in a non-custodial smart contract." },
                  { icon: <IoSparkles className="text-indigo-500" />, text: "AI agent verification is final and binding." },
                  { icon: <IoFlame className="text-error-500" />, text: "Failure to provide proof results in total stake forfeiture." },
                  { icon: <IoCheckmarkCircle className="text-cyan-500" />, text: "Success increases your protocol rank and rewards." }
                ].map((rule, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">{rule.icon}</div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                      {rule.text}
                    </p>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card variant="elevated" className="form-step">
              <CardHeader>
                <CardTitle>Cost Estimate</CardTitle>
              </CardHeader>
              <CardBody>
                <GasEstimate
                  gasLimit="240,000"
                  gasPrice="0.05"
                  estimatedCost="0.000012"
                  className="mb-6"
                />
                <Alert variant="info" className="py-2 px-3 text-xs leading-tight">
                  Gas fees on Base are extremely low. Your main cost is the stake itself.
                </Alert>
              </CardBody>
            </Card>

            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 text-center form-step">
              <div className="text-4xl mb-4">💡</div>
              <h4 className="font-bold mb-2 dark:text-white">Pro Tip</h4>
              <p className="text-sm text-gray-500">
                The more specific your goal, the higher the verification success rate. Mention what kind of proof you'll provide!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
