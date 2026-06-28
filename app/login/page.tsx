"use client"

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCloudStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Server, Shield, ArrowRight, Loader2, Key, Mail } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams?.get('redirect') || '/dashboard'
  
  const { login, user } = useCloudStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  // Loading stage messages for cinematic UX
  const [loadingStage, setLoadingStage] = useState(0)
  const stages = [
    'Authenticating with global access gateway...',
    'Decrypting cluster session keychain...',
    'Fetching active hypervisor telemetry...',
    'Handshaking secure terminal tunnel...',
    'Redirecting to console...'
  ]

  useEffect(() => {
    // If user is already logged in, redirect them
    if (user?.isLoggedIn) {
      router.push(redirectPath)
    }
  }, [user, redirectPath, router])

  // Cycle through loading messages when submitting
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingStage((prev) => {
          if (prev < stages.length - 1) {
            return prev + 1
          }
          return prev
        })
      }, 700)
    }
    return () => clearInterval(interval)
  }, [isSubmitting, stages.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address.')
      return
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setIsSubmitting(true)
    setLoadingStage(0)

    try {
      await login(email)
      // Small delay on final stage
      setTimeout(() => {
        router.push(redirectPath)
      }, 500)
    } catch (err) {
      setError('Authentication gateway failed. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleMagicLink = async () => {
    setError('')
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address to request a magic link.')
      return
    }

    setIsSubmitting(true)
    setLoadingStage(0)

    try {
      await login(email)
      setTimeout(() => {
        router.push(redirectPath)
      }, 500)
    } catch (err) {
      setError('Magic link dispatch failed.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-background overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Cinematic Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-background/95 z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="relative mb-8">
            <div className="h-20 w-20 rounded-full border border-purple-500/20 animate-ping absolute" />
            <div className="h-20 w-20 rounded-full border-t-2 border-purple-500 animate-spin flex items-center justify-center">
              <Server className="h-8 w-8 text-purple-400 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-3 max-w-md">
            <h3 className="text-xl font-bold text-foreground">Secure Connection Initializing</h3>
            <p className="text-sm font-mono text-purple-400 h-6">
              {stages[loadingStage]}
            </p>
            <div className="h-1.5 w-48 bg-secondary rounded-full overflow-hidden mx-auto">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                style={{ width: `${((loadingStage + 1) / stages.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <Card className="w-full max-w-md p-6 sm:p-8 bg-card/40 border border-border/80 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 bg-clip-text text-transparent mb-3">
            <Server className="h-6 w-6 text-purple-500" />
            <span>AETHER<span className="font-light text-foreground">CLOUD</span></span>
          </Link>
          <h2 className="text-lg font-bold text-foreground">Access your Cloud Console</h2>
          <p className="text-xs text-muted-foreground mt-1">Enter your credentials or request a passwordless link</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email" 
                placeholder="alex.mercer@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-muted-foreground">Password</label>
              <a href="#" className="text-[11px] text-purple-400 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="password" 
                placeholder="••••••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" variant="glow" className="w-full gap-2 py-5 mt-2">
            Sign In with Password
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/40" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or passwordless</span></div>
        </div>

        <Button 
          type="button" 
          variant="outline" 
          className="w-full border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-950/10 gap-2"
          onClick={handleMagicLink}
        >
          <Mail className="h-4 w-4 text-purple-400" />
          Send Magic Link
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-8">
          Don't have an account?{' '}
          <Link href="/signup" className="text-purple-400 hover:underline font-semibold">
            Create one (Get $100 Credit)
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
