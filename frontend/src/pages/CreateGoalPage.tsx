import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { Button } from '../components/Button'
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card'
import { Input } from '../components/Input'
import { Textarea } from '../components/Textarea'
import { Alert } from '../components/Alert'
import { Layout } from '../components/Layout'
import { goalAPI, Goal } from '../utils/api'
import { Link } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'

export function CreateGoalPage() {
  const formRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [goalId, setGoalId] = useState<string | null>(null)
  const toast = useToast()

  const [formData, setFormData] = useState({
    user_id: 'user_' + Math.random().toString(36).substr(2, 9),
    description: '',
    stake_amount: 50,
    duration_days: 30,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (formRef.current && !success) {
      gsap.from(formRef.current, {
        duration: 0.6,
        opacity: 0,
        y: 20,
        ease: 'power2.out',
      })
    }
  }, [success])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.description.trim()) {
      newErrors.description = 'Goal description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Goal description must be at least 10 characters'
    }

    if (formData.stake_amount < 10) {
      newErrors.stake_amount = 'Minimum stake is $10'
    }

    if (formData.duration_days < 1 || formData.duration_days > 365) {
      newErrors.duration_days = 'Duration must be between 1 and 365 days'
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
      [name]: name === 'description' ? value : Number(value) || value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const goal: Goal = {
        goal_id: 'goal_' + Math.random().toString(36).substr(2, 9),
        user_id: formData.user_id,
        description: formData.description,
        stake_amount: formData.stake_amount,
        duration_days: formData.duration_days,
      }

      const response = await goalAPI.create(goal)
      setGoalId(response.goal_id)
      setSuccess(true)
      toast.success(`Goal created! $${formData.stake_amount} locked.`)

      // Animate success state
      if (formRef.current) {
        gsap.to(formRef.current, {
          duration: 0.5,
          opacity: 0,
          y: -20,
          ease: 'power2.in',
        })
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create goal. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (success && goalId) {
    return (
      <Layout>
        <div className="max-w-md mx-auto py-12">
          <Card>
            <CardBody className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping bg-success rounded-full opacity-20"></div>
                  <IoCheckmarkCircle className="w-16 h-16 text-success relative" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Goal Created!</h2>
              <div className="bg-blue-50 p-4 rounded text-left space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Goal ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">
                    {goalId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Your User ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">
                    {formData.user_id}
                  </p>
                </div>
              </div>
              <p className="text-gray-600">
                Your stake of <strong>${formData.stake_amount}</strong> is now locked for{' '}
                <strong>{formData.duration_days}</strong> days.
              </p>
            </CardBody>
            <CardFooter className="flex gap-2">
              <Link to="/submit-proof" className="flex-1">
                <Button className="w-full" variant="success">
                  Submit Proof
                </Button>
              </Link>
              <Link to="/dashboard" className="flex-1">
                <Button className="w-full" variant="secondary">
                  Dashboard
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div ref={formRef}>
          <Card>
            <CardHeader>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Create a New Goal
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Define your goal and stake cryptocurrency to stay accountable.
              </p>
            </CardHeader>

            <CardBody>
              {error && (
                <Alert type="error" title="Error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Textarea
                  label="Goal Description"
                  name="description"
                  placeholder="What goal do you want to achieve? Be specific and measurable."
                  value={formData.description}
                  onChange={handleInputChange}
                  error={errors.description}
                  rows={4}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Stake Amount (USD)"
                    name="stake_amount"
                    type="number"
                    min="10"
                    max="10000"
                    step="10"
                    value={formData.stake_amount}
                    onChange={handleInputChange}
                    error={errors.stake_amount}
                    helperText="Minimum $10, locked until goal completion"
                  />

                  <Input
                    label="Duration (Days)"
                    name="duration_days"
                    type="number"
                    min="1"
                    max="365"
                    value={formData.duration_days}
                    onChange={handleInputChange}
                    error={errors.duration_days}
                    helperText="How long do you have to complete this goal?"
                  />
                </div>

                <Alert type="info">
                  <strong>How it works:</strong> Your stake is locked in a smart contract.
                  Once you submit proof, our AI verifies it. If approved, your stake is
                  returned + you build your streak. If rejected, you lose the stake.
                </Alert>

                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Creating Goal...' : 'Create Goal & Lock Stake'}
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
