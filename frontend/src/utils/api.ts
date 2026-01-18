import axios, { AxiosInstance } from 'axios'

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types for API requests and responses
export interface Goal {
  goal_id: string
  description: string
  stake_amount: number
  duration_days: number
  user_id: string
}

export interface GoalResponse {
  goal_id: string
  user_id: string
  message: string
  stake_locked: number
}

export interface ProofSubmission {
  goal_id: string
  user_id: string
  image_file: File
}

export interface VerificationResult {
  verdict: 'APPROVED' | 'REJECTED'
  confidence: number
  message: string
  fraud_signals: string[]
  recommendation: string
}

export interface UserStats {
  user_id: string
  total_goals: number
  approved_count: number
  rejected_count: number
  approval_rate: number
  total_stake_locked: number
  current_streak: number
  personality_mode: string
}

export interface MetricsDashboard {
  total_verifications: number
  approval_rate: number
  fraud_detection_rate: number
  average_confidence: number
  active_users: number
  total_stake_locked: number
}

// API Methods
export const goalAPI = {
  create: async (goal: Goal): Promise<GoalResponse> => {
    const response = await apiClient.post<GoalResponse>('/api/goals', goal)
    return response.data
  },
}

export const proofAPI = {
  submit: async (
    goalId: string,
    userId: string,
    imageFile: File,
  ): Promise<VerificationResult> => {
    const formData = new FormData()
    formData.append('goal_id', goalId)
    formData.append('user_id', userId)
    formData.append('image_file', imageFile)

    const response = await apiClient.post<VerificationResult>(
      '/api/proof/submit',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data
  },
}

export const userAPI = {
  getStats: async (userId: string): Promise<UserStats> => {
    const response = await apiClient.get<UserStats>(`/api/user/${userId}/stats`)
    return response.data
  },
}

export const metricsAPI = {
  getDashboard: async (): Promise<MetricsDashboard> => {
    const response = await apiClient.get<MetricsDashboard>(
      '/api/metrics/dashboard',
    )
    return response.data
  },
}

export default apiClient
