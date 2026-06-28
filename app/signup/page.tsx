"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCloudStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Server, Terminal, Shield, ArrowRight, Check, Gift } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const { login } = useCloudStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name) {
      setError('Please enter your full name.')
      return
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate account creation & auto-login
      await login(email)
      router.push('/dashboard')
    } catch (err) {
      setError('Account creation failed. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-background overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-4xl w-full relative z-10 items-center">
        {/* Marketing Info */}
        <div className="lg:col-span-5 space-y-6 hidden lg:block">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-300 text-xs font-medium">
            <Gift className="h-3.5 w-3.5 text-emerald-400" />
            <span>$100 Sandbox Credits applied</span>
          </div>
          <h2 className="text-3xl font-extrabold text-foreground leading-tight">Join the Next-Gen Cloud Platform</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Create an account in less than 30 seconds. Explore our high-speed NVMe virtual nodes and Anycast global network with zero commitments.
          </p>

          <div className="space-y-3.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Instant provisioning</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Full root / administrator access</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>18 global datacenter locations</span>
            </div>
          </div>
        </div>

        {/* Signup Card */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 bg-card/40 border border-border/80 shadow-2xl">
            <div className="text-center lg:text-left mb-6">
              <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 bg-clip-text text-transparent mb-3 lg:hidden">
                <Server className="h-6 w-6 text-purple-500" />
                <span>AETHER<span className="font-light text-foreground">CLOUD</span></span>
              </Link>
              <h2 className="text-lg font-bold text-foreground">Create your free account</h2>
              <p className="text-xs text-muted-foreground mt-1">Get $100 credits automatically loaded into your sandbox</p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">Full Name</label>
                <Input 
                  type="text" 
                  placeholder="Alex Mercer" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">Email Address</label>
                <Input 
                  type="email" 
                  placeholder="alex.mercer@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">Password</label>
                <Input 
                  type="password" 
                  placeholder="Min. 6 characters" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex gap-2.5 text-xs text-emerald-400">
                <Gift className="h-4 w-4 shrink-0" />
                <p><strong>Promo Applied:</strong> $100.00 trial credit has been added to your sandbox account balance. Valid for 60 days.</p>
              </div>

              <Button type="submit" variant="glow" className="w-full gap-2 py-5 mt-2" disabled={isSubmitting}>
                {isSubmitting ? 'Creating sandbox...' : 'Create Account & Claim Credit'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-400 hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
