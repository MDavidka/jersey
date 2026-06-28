"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCloudStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Server, Shield, Key, Terminal, ArrowRight, Github, Mail, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, user } = useCloudStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [activeTab, setActiveTab] = useState<'password' | 'passwordless'>('password')
  const [error, setError] = useState('')

  const redirectPath = searchParams ? searchParams.get('redirect') || '/dashboard' : '/dashboard'

  // If already logged in, redirect
  useEffect(() => {
    if (user?.isLoggedIn && !loading) {
      router.push(redirectPath)
    }
  }, [user, router, redirectPath, loading])

  // Sequential loading steps for extreme high-fidelity simulation
  const loadingSteps = [
    'Contacting Aether Auth Server...',
    'Exchanging ECDSA key signatures...',
    'Verifying credentials...',
    'Decrypting workspace environment...',
    'Redirecting to Console Panel...'
  ]

  useEffect(() => {
    if (loading && loadingStep < loadingSteps.length) {
      const timer = setTimeout(() => {
        setLoadingStep((prev) => prev + 1)
      }, 700)
      return () => clearTimeout(timer)
    } else if (loading && loadingStep >= loadingSteps.length) {
      router.push(redirectPath)
    }
  }, [loading, loadingStep, router, redirectPath])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address.')
      return
    }

    if (activeTab === 'password' && !password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)
    setLoadingStep(0)
    
    try {
      await login(email)
    } catch (err) {
      setError('Authentication failed. Please check your credentials.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center max-w-md w-full space-y-6 z-10">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
            <Server className="h-12 w-12 text-purple-500 animate-bounce relative z-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Initializing Session</h2>
            <p className="text-xs text-muted-foreground font-mono">User: {email}</p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted border border-border/40 h-2 rounded-full overflow-hidden relative">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
            />
          </div>

          {/* Step log */}
          <div className="p-3 bg-card/60 border border-border/40 rounded-lg min-h-[50px] flex items-center justify-center">
            <p className="text-xs text-purple-300 font-mono animate-pulse">
              ⚡ {loadingSteps[loadingStep] || 'Finalizing secure handshake...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex grid-cols-1 lg:grid lg:grid-cols-12 relative overflow-hidden">
      {/* Glow background for mobile */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none lg:hidden" />

      {/* Left side: branding/marketing (hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-5 bg-card/40 border-r border-border/40 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-950/10 to-transparent pointer-events-none" />
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent relative z-10">
          <Server className="h-6 w-6 text-purple-500" />
          <span>AETHER<span className="font-light text-white">CLOUD</span></span>
        </Link>

        {/* Feature block */}
        <div className="space-y-6 relative z-10">
          <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-300 gap-1">
            <Shield className="h-3 w-3" /> Secure Console Access
          </Badge>
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Manage your global infrastructure from one unified dashboard.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Provision virtual servers, monitor real-time resource logs, manage payments, and generate production API keys with multi-factor security.
          </p>
        </div>

        {/* Footer info */}
        <div className="text-xs text-muted-foreground relative z-10">
          <p>© {new Date().getFullYear()} AetherCloud Technologies. Protected by 256-bit AES encryption.</p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 w-full">
        <div className="max-w-md w-full space-y-8">
          
          {/* Mobile Logo Header */}
          <div className="text-center lg:text-left space-y-2">
            <Link href="/" className="inline-flex lg:hidden items-center gap-2 font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-4">
              <Server className="h-6 w-6 text-purple-500" />
              <span>AETHER<span className="font-light text-foreground">CLOUD</span></span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Console Sign In</h1>
            <p className="text-sm text-muted-foreground">Access your virtual servers and deployment logs.</p>
          </div>

          {/* Form Card */}
          <Card className="border-border/60 bg-card/20 backdrop-blur-md">
            <CardContent className="p-6 sm:p-8 space-y-6">
              
              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-muted rounded-lg border border-border/40">
                <button
                  type="button"
                  onClick={() => setActiveTab('password')}
                  className={`py-1.5 rounded text-xs font-semibold transition-all ${
                    activeTab === 'password' 
                      ? 'bg-background text-white shadow-sm' 
                      : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('passwordless')}
                  className={`py-1.5 rounded text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                    activeTab === 'passwordless' 
                      ? 'bg-background text-white shadow-sm' 
                      : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  <Sparkles className="h-3 w-3 text-purple-400" />
                  Passwordless OTP
                </button>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive-foreground rounded-lg text-xs font-medium">
                  ⚠ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-background/40"
                    />
                  </div>
                </div>

                {/* Password / OTP */}
                {activeTab === 'password' ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Password</label>
                      <a href="#" className="text-[10px] text-purple-400 hover:underline">Forgot password?</a>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9 bg-background/40"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg space-y-1">
                    <h4 className="text-xs font-bold text-purple-300">⚡ Instant Passwordless Login</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Enter your email and click the button below. We will simulate sending a 6-digit cryptographic verification code to bypass password requirements.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button type="submit" variant="glow" className="w-full gap-2 mt-2">
                  Authenticate Workspace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              {/* Social Login Divider */}
              <div className="relative flex items-center justify-center py-2">
                <div className="absolute w-full border-t border-border/40" />
                <span className="relative bg-card px-3 text-[10px] uppercase text-muted-foreground tracking-wider">Or continue with</span>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => { setEmail('developer-github@aethercloud.io'); setPassword('github-oauth'); }}
                  className="gap-2 border-border/60 hover:bg-muted/30"
                >
                  <Github className="h-4 w-4" />
                  GitHub Demo
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => { setEmail('admin@aethercloud.io'); setPassword('admin-demo'); }}
                  className="gap-2 border-border/60 hover:bg-muted/30 text-purple-400 hover:text-purple-300"
                >
                  <Terminal className="h-4 w-4" />
                  Admin Demo
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* Signup link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="text-purple-400 hover:underline font-semibold">
              Create an account (+ $100 credits)
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
