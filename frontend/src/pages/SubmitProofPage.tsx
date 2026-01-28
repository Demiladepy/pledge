/**
 * Premium SubmitProofPage Component
 * Evidence submission portal with AI oracle verification
 */

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import {
  IoCloudUpload,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoShieldCheckmark,
  IoSearch,
  IoAlertCircle,
  IoSparkles,
  IoArrowForward,
  IoImage,
  IoFlash,
  IoScan,
  IoRocket
} from 'react-icons/io5'
import { Button } from '../components/Button'
import { Card, CardHeader, CardBody, CardFooter, CardTitle } from '../components/Card'
import { Input } from '../components/Input'
import { Alert } from '../components/Alert'
import { Badge } from '../components/Badge'
import { Layout } from '../components/Layout'
import { proofAPI, VerificationResult } from '../utils/api'
import { Link } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { cn } from '../utils/cn'

export function SubmitProofPage() {
  const formRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const toast = useToast()

  const [isDragging, setIsDragging] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)

  const [formData, setFormData] = useState({
    goal_id: '',
    user_id: localStorage.getItem('userId') || '',
  })

  useEffect(() => {
    if (formRef.current && !result) {
      gsap.from('.step-child', {
        duration: 0.8,
        opacity: 0,
        y: 20,
        stagger: 0.1,
        ease: 'power4.out',
      })
    }
  }, [result])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) processFile(files[0])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0])
  }

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type. Please upload an image.')
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.goal_id || !imageFile) {
      toast.error('Goal ID and Proof Image are required.')
      return
    }

    setIsLoading(true)
    try {
      const verificationResult = await proofAPI.submit(
        formData.goal_id,
        formData.user_id,
        imageFile,
      )
      setResult(verificationResult)

      if (verificationResult.verdict === 'APPROVED') {
        toast.success('Evidence verified by Agent Oracle.')
      } else {
        toast.error(`Verification rejected: ${verificationResult.verdict}`)
      }
    } catch (err) {
      toast.error('Submission failed. System instability detected.')
    } finally {
      setIsLoading(false)
    }
  }

  if (result) {
    const isApproved = result.verdict === 'APPROVED'
    return (
      <Layout>
        <div className="max-w-3xl mx-auto py-12" ref={resultRef}>
          <Card variant="elevated" shine className="overflow-hidden">
            <div className={cn(
              "py-12 text-center relative",
              isApproved ? "bg-success-500/10" : "bg-error-500/10"
            )}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 scale-150">
                {isApproved ? <IoCheckmarkCircle className="text-9xl" /> : <IoCloseCircle className="text-9xl" />}
              </div>

              <div className="relative z-10 space-y-4">
                <div className={cn(
                  "w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-xl mb-6",
                  isApproved ? "bg-success-500 text-white" : "bg-error-500 text-white"
                )}>
                  {isApproved ? <IoCheckmarkCircle className="w-12 h-12" /> : <IoCloseCircle className="w-12 h-12" />}
                </div>

                <h2 className="text-4xl font-heading font-black dark:text-white tracking-tight">
                  {isApproved ? "Verification Approved" : "Verification Rejected"}
                </h2>

                <div className="flex justify-center gap-3">
                  <Badge variant={isApproved ? "success" : "danger"} size="lg" dot pulse>
                    Score: {(result.confidence * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>

            <CardBody className="py-12 space-y-8">
              <Alert variant={isApproved ? "success" : "error"} title="Oracle Report" className="text-lg">
                {result.message}
              </Alert>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Agent Reasoning</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-2 border-gray-100 dark:border-gray-800 pl-4 py-2">
                    "{result.reasoning}"
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Submitted Evidence</h4>
                  {imagePreview && (
                    <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 aspect-video relative group cursor-zoom-in">
                      <img src={imagePreview} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Proof" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-3xl">
                        <IoSearch />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {result.fraud_signals.length > 0 && (
                <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-4 text-amber-700 dark:text-amber-500">
                    <IoAlertCircle className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-widest text-xs">Anomaly Detected</span>
                  </div>
                  <ul className="space-y-2">
                    {result.fraud_signals.map((s, i) => (
                      <li key={i} className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-amber-500" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardBody>

            <CardFooter className="bg-gray-50/50 dark:bg-gray-950/50 p-8 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button variant="outline" fullWidth onClick={() => setResult(null)}>Upload New Proof</Button>
                <Link to="/dashboard" className="flex-1">
                  <Button variant="gradient" fullWidth icon={<IoArrowForward />}>View Success Chain</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center step-child">
          <Badge variant="secondary" className="mb-4">Oracle Verification</Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-black dark:text-white tracking-tight leading-tight">
            Submit Commitment<br /><span className="gradient-text">Evidence</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto font-medium">
            Upload artifacts for AI evaluation. The Agent Oracle will perform a cross-network
            analysis for authenticity and goal alignment.
          </p>
        </div>

        <div ref={formRef} className="grid lg:grid-cols-5 gap-8">

          <div className="lg:col-span-3 space-y-8">
            <Card variant="elevated" className="step-child overflow-hidden">
              <CardBody className="p-0">
                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                  {/* Goal ID Input */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <IoScan className="text-indigo-600" />
                      <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">Protocol Link</h4>
                    </div>
                    <Input
                      placeholder="Protocol ID (e.g. goal_x82f...)"
                      value={formData.goal_id}
                      onChange={(e) => setFormData(p => ({ ...p, goal_id: e.target.value }))}
                      className="bg-gray-50 dark:bg-gray-900 border-none !p-4 font-mono font-bold"
                      leftIcon={<IoRocket />}
                    />
                  </div>

                  {/* Upload Zone */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <IoImage className="text-indigo-600" />
                      <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">Evidence Artifact</h4>
                    </div>

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('proof-upload')?.click()}
                      className={cn(
                        "relative rounded-3xl border-4 border-dashed transition-all duration-300 group cursor-pointer aspect-video flex flex-col items-center justify-center p-8 text-center",
                        isDragging
                          ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[0.98]"
                          : "border-gray-200 dark:border-gray-800 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                      )}
                    >
                      <input
                        id="proof-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept="image/*"
                      />

                      {imagePreview ? (
                        <div className="absolute inset-0 p-4">
                          <img src={imagePreview} className="w-full h-full object-cover rounded-2xl shadow-2xl" alt="Preview" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white">
                            <div className="flex flex-col items-center gap-2">
                              <IoCloudUpload className="text-4xl" />
                              <span className="font-bold">Replace Artfact</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3">
                            <IoCloudUpload className="text-3xl text-gray-400 group-hover:text-indigo-600 transition-colors" />
                          </div>
                          <div>
                            <p className="text-xl font-bold dark:text-white">Drag & drop evidence</p>
                            <p className="text-gray-400 mt-1 max-w-xs">High-resolution artifacts (PNG, JPG) up to 10MB recommended for oracle stability.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="gradient"
                      size="xl"
                      fullWidth
                      isLoading={isLoading}
                      className="h-16 shadow-2xl shadow-indigo-500/20"
                      icon={<IoFlash />}
                    >
                      {isLoading ? "Consulting Agent Oracle..." : "Submit for Verification"}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card variant="glass" className="step-child">
              <CardHeader>
                <CardTitle>Verification Protocol</CardTitle>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex flex-shrink-0 items-center justify-center">
                    <IoShieldCheckmark />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm dark:text-white">Metadata Analysis</h5>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Agent Oracle audits EXIF data and timestamps to ensure evidence is recently collected.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex flex-shrink-0 items-center justify-center">
                    <IoSparkles />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm dark:text-white">Semantic Logic</h5>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Cross-referencing artifact content with your commitment definition for semantic alignment.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex flex-shrink-0 items-center justify-center">
                    <IoAlertCircle />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm dark:text-white">Fraud Countermeasures</h5>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Deep analysis for digital manipulation, AI generation, or recycled artifacts.</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card variant="elevated" shine className="bg-gray-900 border-none text-white step-child">
              <CardBody className="text-center py-8">
                <div className="text-4xl mb-4">🔮</div>
                <h4 className="font-heading font-black text-xl mb-2">Oracle Prediction</h4>
                <p className="text-gray-400 text-sm mb-6">Based on your recent 5 commitments, the Oracle expects 94% verification success.</p>
                <div className="flex justify-center gap-1">
                  {[1, 1, 1, 1, 0].map((s, i) => (
                    <div key={i} className={cn("w-2 h-2 rounded-full", s ? "bg-success-500" : "bg-gray-700")} />
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

        </div>
      </div>
    </Layout>
  )
}
