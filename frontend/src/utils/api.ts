import axios, { AxiosInstance } from 'axios'

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45s to allow Render cold start / slow first request
})

// Types for API requests and responses
export interface Goal {
  goal_id: string
  description: string
  stake_amount: number
  duration_days: number
  user_id: string
}

/** Payload for creating a goal – backend expects these fields (no goal_id; backend generates it) */
export interface CreateGoalRequest {
  user_id: string
  description: string
  proof_type: string
  stake_amount: number
  duration_days: number
  penalty_recipient: string
}

export interface GoalResponse {
  goal_id: string
  transaction_hash?: string
  message: string
  stake_locked?: number
  user_id?: string
}

export interface ProofSubmission {
  goal_id: string
  user_id: string
  image_file: File
}

export interface VerificationResult {
  verdict: 'APPROVED' | 'REJECTED' | 'UNCLEAR' | 'FRAUD_DETECTED'
  confidence: number
  message: string
  fraud_signals: string[]
  recommendation?: string
  reasoning?: string
  processing_time_ms?: number
  blockchain_tx?: string
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
  // Extended profile data
  protocol_rank: string
  last_proof_date: string | null
  total_rewards: number
}

export interface ActivityItem {
  id: string
  event_type: 'verification_success' | 'verification_failed' | 'goal_created' | 'stake_locked'
  description: string
  timestamp: string
  goal_id?: string
  user_id: string
}

export interface SystemStatus {
  api_status: string
  database_connected: boolean
  blockchain_connected: boolean
  blockchain_network?: string
  agent_address?: string
  opik_enabled: boolean
  opik_dashboard_url?: string
  contract_address?: string
  gemini_enabled: boolean
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
  create: async (payload: CreateGoalRequest): Promise<GoalResponse> => {
    const response = await apiClient.post<GoalResponse>('/api/goals', payload)
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
    formData.append('proof_image', imageFile)

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
    // Always fetch real data - no mock fallback for production readiness
    const response = await apiClient.get<UserStats>(`/api/user/${userId}/stats`)
    return response.data
  },
  
  getActivity: async (userId: string, limit: number = 10): Promise<ActivityItem[]> => {
    const response = await apiClient.get<ActivityItem[]>(`/api/user/${userId}/activity`, {
      params: { limit }
    })
    return response.data
  },
}

export const metricsAPI = {
  getDashboard: async (): Promise<MetricsDashboard> => {
    const response = await apiClient.get<MetricsDashboard>('/api/metrics/dashboard')
    return response.data
  },
}

export const systemAPI = {
  getStatus: async (): Promise<SystemStatus> => {
    const response = await apiClient.get<SystemStatus>('/api/system/status')
    return response.data
  },
}

// Health check to verify backend connection
export const healthAPI = {
  check: async (): Promise<boolean> => {
    try {
      await apiClient.get('/')
      return true
    } catch {
      return false
    }
  },
}

export default apiClient
