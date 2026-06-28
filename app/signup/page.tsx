"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCloudStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Server, Shield, Mail, Key, User, ArrowRight, Gift } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const { login, user } = useCloudStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [error, setError] = useState('')

  // If already logged in, redirect
  useEffect(() => {
    if (user?.isLoggedIn && !loading) {
      router.push('/dashboard')
    }
  }, [user, router, loading])

  const loadingSteps = [
    'Creating secure hypervisor tenant...',
    'Allocating $100.00 promotional balance...',
    'Generating default region API keys...',
    'Setting up default logs routing...',
    'Opening dashboard console...'
  ]

  useEffect(() => {
    if (loading && loadingStep < loadingSteps.length) {
      const timer = setTimeout(() => {
        setLoadingStep((prev) => prev + 1)
      }, 700)
      return () => clearTimeout(timer)
    } else if (loading && loadingStep >= loadingSteps.length) {
      router.push('/dashboard')
    }
  }, [loading, loadingStep, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    setLoadingStep(0)
    
    try {
      await login(email)
    } catch (err) {
      setError('Registration failed. Please try again.')
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
            <h2 className="text-xl font-bold text-white tracking-tight">Creating Account</h2>
            <p className="text-xs text-muted-foreground font-mono">Tenant: {email}</p>
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
              ⚡ {loadingSteps[loadingStep] || 'Finalizing tenant creation...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex grid-cols-1 lg:grid lg:grid-cols-12 relative overflow-hidden">
      {/* Left side: branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-5 bg-card/40 border-r border-border/40 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-950/10 to-transparent pointer-events-none" />
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent relative z-10">
          <Server className="h-6 w-6 text-purple-500" />
          <span>AETHER<span className="font-light text-white">CLOUD</span></span>
        </Link>

        {/* Feature block */}
        <div className="space-y-6 relative z-10">
          <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-300 gap-1.5">
            <Gift className="h-3.5 w-3.5" /> Promotional Credit Added
          </Badge>
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Get started with $100.00 free credits.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create an account today and try our Virtual Private Servers, API keys, and terminal console for free. No credit card required to deploy.
          </p>
        </div>

        {/* Footer info */}
        <div className="text-xs text-muted-foreground relative z-10">
          <p>© {new Date().getFullYear()} AetherCloud Technologies. Protected by 256-bit AES encryption.</p>
        </div>
      </div>

      {/* Right side: Signup Form */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 w-full">
        <div className="max-w-md w-full space-y-8">
          
          {/* Mobile Logo Header */}
          <div className="text-center lg:text-left space-y-2">
            <Link href="/" className="inline-flex lg:hidden items-center gap-2 font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-4">
              <Server className="h-6 w-6 text-purple-500" />
              <span>AETHER<span className="font-light text-foreground">CLOUD</span></span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Create Account</h1>
            <p className="text-sm text-muted-foreground">Get $100 in free cloud hosting credits.</p>
          </div>

          {/* Form Card */}
          <Card className="border-border/60 bg-card/20 backdrop-blur-md">
            <CardContent className="p-6 sm:p-8 space-y-6">
              
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive-foreground rounded-lg text-xs font-medium">
                  ⚠ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Alex Mercer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 bg-background/40"
                    />
                  </div>
                </div>

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

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Password</label>
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

                {/* Terms checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    required
                    className="mt-0.5 rounded border-border bg-background text-purple-600 focus:ring-purple-500" 
                  />
                  <label htmlFor="terms" className="text-[11px] text-muted-foreground leading-snug">
                    I agree to the AetherCloud <a href="#" className="text-purple-400 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>.
                  </label>
                </div>

                {/* Submit Button */}
                <Button type="submit" variant="glow" className="w-full gap-2 mt-2">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

            </CardContent>
          </Card>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:underline font-semibold">
              Sign in to Console
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
