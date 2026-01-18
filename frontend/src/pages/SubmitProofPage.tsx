import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { IoCloudUpload, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'
import { Button } from '../components/Button'
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card'
import { Input } from '../components/Input'
import { Alert } from '../components/Alert'
import { Badge } from '../components/Badge'
import { Layout } from '../components/Layout'
import { Loader } from '../components/Loader'
import { proofAPI, VerificationResult } from '../utils/api'
import { Link } from 'react-router-dom'

export function SubmitProofPage() {
  const formRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<HTMLDivElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    goal_id: '',
    user_id: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (formRef.current && !result) {
      gsap.from(formRef.current, {
        duration: 0.6,
        opacity: 0,
        y: 20,
        ease: 'power2.out',
      })
    }
  }, [result])

  useEffect(() => {
    if (resultRef.current && result) {
      gsap.from(resultRef.current, {
        duration: 0.6,
        opacity: 0,
        scale: 0.95,
        ease: 'back.out',
      })
    }
  }, [result])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0])
    }
  }

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, etc.)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB')
      return
    }

    setImageFile(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.goal_id.trim()) {
      newErrors.goal_id = 'Goal ID is required'
    }

    if (!formData.user_id.trim()) {
      newErrors.user_id = 'User ID is required'
    }

    if (!imageFile) {
      newErrors.image = 'Please select an image file'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const verificationResult = await proofAPI.submit(
        formData.goal_id,
        formData.user_id,
        imageFile!,
      )
      setResult(verificationResult)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit proof. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setImageFile(null)
    setImagePreview(null)
    setFormData({ goal_id: '', user_id: '' })
  }

  if (result) {
    const isApproved = result.verdict === 'APPROVED'

    return (
      <Layout>
        <div className="max-w-2xl mx-auto" ref={resultRef}>
          <Card>
            <CardBody className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className={`absolute inset-0 animate-ping rounded-full opacity-20 ${
                      isApproved ? 'bg-success' : 'bg-danger'
                    }`}
                  ></div>
                  {isApproved ? (
                    <IoCheckmarkCircle className="w-20 h-20 text-success relative" />
                  ) : (
                    <IoCloseCircle className="w-20 h-20 text-danger relative" />
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900">
                  {isApproved ? 'Proof Approved! 🎉' : 'Proof Rejected'}
                </h2>
                <Badge variant={isApproved ? 'success' : 'danger'}>
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </Badge>
              </div>

              <Alert type={isApproved ? 'success' : 'error'}>
                <p className="text-lg font-semibold mb-2">{result.message}</p>
                <p className="text-sm mt-2">{result.recommendation}</p>
              </Alert>

              {result.fraud_signals.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded text-left">
                  <p className="font-semibold text-yellow-900 mb-2">
                    Detected Signals:
                  </p>
                  <ul className="space-y-1">
                    {result.fraud_signals.map((signal, idx) => (
                      <li key={idx} className="text-sm text-yellow-800">
                        • {signal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {imagePreview && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Submitted Image:</p>
                  <img
                    src={imagePreview}
                    alt="Submitted proof"
                    className="w-full rounded-lg max-h-80 object-cover"
                  />
                </div>
              )}
            </CardBody>

            <CardFooter className="flex gap-2">
              <Button onClick={handleReset} variant="secondary" className="flex-1">
                Submit Another
              </Button>
              <Link to="/dashboard" className="flex-1">
                <Button className="w-full" variant="success">
                  View Dashboard
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
      <div className="max-w-2xl mx-auto" ref={formRef}>
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold text-gray-900">Submit Proof</h1>
            <p className="text-gray-600 mt-2">
              Upload an image as proof of completing your goal. Our AI will verify it.
            </p>
          </CardHeader>

          <CardBody>
            {error && (
              <Alert type="error" title="Error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proof Image
                </label>
                <div
                  ref={dragRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${errors.image ? 'border-danger' : ''}`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-input"
                  />
                  <label htmlFor="image-input" className="cursor-pointer">
                    <IoCloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">
                      Drag and drop your image here
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      or click to select a file
                    </p>
                  </label>
                </div>
                {errors.image && (
                  <p className="mt-1 text-sm text-danger">{errors.image}</p>
                )}
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Preview</p>
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full rounded-lg max-h-80 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Goal and User IDs */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Goal ID"
                  name="goal_id"
                  placeholder="e.g., goal_abc123..."
                  value={formData.goal_id}
                  onChange={handleInputChange}
                  error={errors.goal_id}
                  helperText="Copy from your goal creation"
                />

                <Input
                  label="Your User ID"
                  name="user_id"
                  placeholder="e.g., user_xyz789..."
                  value={formData.user_id}
                  onChange={handleInputChange}
                  error={errors.user_id}
                  helperText="Your unique user identifier"
                />
              </div>

              <Alert type="info">
                <strong>How verification works:</strong> Our AI analyzes your image
                against your goal description. It checks for authenticity, metadata,
                and fraud signals. Results are instant.
              </Alert>

              <Button
                type="submit"
                variant="success"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader size="sm" />
                    Verifying...
                  </div>
                ) : (
                  'Submit for Verification'
                )}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </Layout>
  )
}
