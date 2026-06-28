"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCloudStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Cpu, Database, HardDrive, Shield, Zap, Globe, ArrowRight } from 'lucide-react'

export default function PricingPage() {
  const router = useRouter()
  const { addServer, user } = useCloudStore()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const discountFactor = billingCycle === 'yearly' ? 0.8 : 1.0

  const vpsPlans = [
    {
      name: 'Aether Starter',
      cpu: 1,
      ram: 2,
      storage: 40,
      bandwidth: '2 TB',
      price: 10,
      popular: false,
      color: 'border-border'
    },
    {
      name: 'Aether Developer',
      cpu: 2,
      ram: 4,
      storage: 80,
      bandwidth: '5 TB',
      price: 20,
      popular: true,
      color: 'border-purple-500/50 shadow-purple-500/10'
    },
    {
      name: 'Aether Production',
      cpu: 4,
      ram: 8,
      storage: 160,
      bandwidth: '10 TB',
      price: 40,
      popular: false,
      color: 'border-border'
    },
    {
      name: 'Aether Enterprise',
      cpu: 8,
      ram: 16,
      storage: 320,
      bandwidth: '20 TB',
      price: 80,
      popular: false,
      color: 'border-border'
    }
  ]

  const bareMetalPlans = [
    {
      name: 'Titan Core-16',
      cpu: 16,
      ram: 64,
      storage: 1000,
      bandwidth: '100 TB',
      price: 180,
      popular: false,
      color: 'border-border'
    },
    {
      name: 'Titan Core-32 (GPU)',
      cpu: 32,
      ram: 128,
      storage: 2000,
      bandwidth: 'Uncapped',
      price: 360,
      popular: true,
      color: 'border-blue-500/50 shadow-blue-500/10'
    }
  ]

  const handleDeployPlan = (plan: typeof vpsPlans[0], type: 'VPS' | 'Bare Metal') => {
    const finalPrice = Math.round(plan.price * discountFactor)
    addServer({
      name: plan.name.toLowerCase().replace(/\s+/g, '-'),
      region: 'us-east (N. Virginia)',
      type,
      cpu: plan.cpu,
      ram: plan.ram,
      storage: plan.storage,
      cost: finalPrice,
      os: 'Ubuntu 22.04 LTS'
    })

    if (user?.isLoggedIn) {
      router.push('/dashboard/servers')
    } else {
      router.push('/login?redirect=/dashboard/servers')
    }
  }

  return (
    <div className="relative py-16 md:py-24 bg-background overflow-hidden">
      {/* Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      <div className="container px-4 mx-auto sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Transparent, Predictable <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">Pricing</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            No hidden fees, no complex usage calculators. Pay for what you configure. Get 20% off when billing annually.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>Billing Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600/20 border border-purple-500/30 transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-purple-500 transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              Billing Annually
              <Badge variant="success" className="text-[10px] px-2 py-0">Save 20%</Badge>
            </span>
          </div>
        </div>

        {/* 1. VPS PLANS */}
        <div className="space-y-6 mb-20">
          <div className="flex items-center gap-3 border-b border-border/40 pb-4">
            <Cpu className="h-5 w-5 text-purple-400" />
            <h2 className="text-2xl font-bold text-foreground">Standard VPS Instances</h2>
            <Badge variant="secondary">NVMe Raid-10 Included</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vpsPlans.map((plan) => {
              const currentPrice = Math.round(plan.price * discountFactor)
              return (
                <Card key={plan.name} className={`flex flex-col justify-between p-6 bg-card/40 border hover:border-purple-500/30 transition-all duration-300 relative ${plan.color}`}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase bg-purple-600 text-white px-3 py-1 rounded-full border border-purple-400">
                      Most Popular
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">High-performance dev node</p>
                    </div>

                    <div className="flex items-baseline gap-1 py-2">
                      <span className="text-4xl font-extrabold text-foreground">${currentPrice}</span>
                      <span className="text-muted-foreground text-xs">/ mo</span>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-border/40 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">CPU Cores</span>
                        <span className="font-mono text-xs font-semibold">{plan.cpu} vCPUs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">ECC RAM</span>
                        <span className="font-mono text-xs font-semibold">{plan.ram} GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">NVMe Storage</span>
                        <span className="font-mono text-xs font-semibold">{plan.storage} GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">Bandwidth</span>
                        <span className="font-mono text-xs font-semibold">{plan.bandwidth}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant={plan.popular ? 'glow' : 'outline'}
                    className="w-full mt-6 gap-2"
                    onClick={() => handleDeployPlan(plan, 'VPS')}
                  >
                    Deploy Node
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>

        {/* 2. BARE METAL PLANS */}
        <div className="space-y-6 mb-20">
          <div className="flex items-center gap-3 border-b border-border/40 pb-4">
            <Database className="h-5 w-5 text-blue-400" />
            <h2 className="text-2xl font-bold text-foreground">Dedicated Bare Metal</h2>
            <Badge variant="secondary">No Virtualization Overhead</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {bareMetalPlans.map((plan) => {
              const currentPrice = Math.round(plan.price * discountFactor)
              return (
                <Card key={plan.name} className={`flex flex-col justify-between p-8 bg-card/30 border hover:border-blue-500/30 transition-all duration-300 relative ${plan.color}`}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase bg-blue-600 text-white px-3 py-1 rounded-full border border-blue-400">
                      High Performance GPU
                    </span>
                  )}

                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-extrabold text-xl text-foreground">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">Dedicated physical silicon core arrays</p>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-foreground">${currentPrice}</span>
                        <span className="text-muted-foreground text-xs">/ mo</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-b border-border/40 py-6 text-sm">
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-xs block">CPU Configuration</span>
                        <span className="font-mono text-foreground font-semibold flex items-center gap-1.5">
                          <Cpu className="h-3.5 w-3.5 text-blue-400" />
                          {plan.cpu} Cores (AMD EPYC)
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-xs block">DDR5 RAM</span>
                        <span className="font-mono text-foreground font-semibold flex items-center gap-1.5">
                          <Database className="h-3.5 w-3.5 text-blue-400" />
                          {plan.ram} GB Registered
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-xs block">Storage Arrays</span>
                        <span className="font-mono text-foreground font-semibold flex items-center gap-1.5">
                          <HardDrive className="h-3.5 w-3.5 text-blue-400" />
                          {plan.storage} GB Enterprise NVMe
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-xs block">Network Outbound</span>
                        <span className="font-mono text-foreground font-semibold flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-blue-400" />
                          {plan.bandwidth}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-foreground">Hardware SLA Features:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>IPMI Out-of-Band Access</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Dual 10Gbps Uplinks</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Hot-Swappable Drives</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>ECC Error Correction</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant={plan.popular ? 'glow' : 'outline'}
                    className="w-full mt-8 gap-2 py-5"
                    onClick={() => handleDeployPlan(plan, 'Bare Metal')}
                  >
                    Provision Server Node
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>

        {/* 3. TRUST & FAQ */}
        <div className="border-t border-border/40 pt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-10">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h4 className="font-bold text-foreground">How does hourly billing work?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We track server usage down to the exact second. If you deploy a server and destroy it after 4 hours, you only pay for those 4 hours of active compute time.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-foreground">What happens when I run out of bandwidth?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We do not charge overages. If you exceed your monthly allocation, your port speed is throttled to 10Mbps. You can buy additional blocks of bandwidth for $2/TB.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-foreground">Can I upload my own custom ISO?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Absolutely! Our console allows you to mount custom ISOs directly via an HTTP link. You can install any custom OS or kernel you require.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-foreground">Is DDoS protection included in the price?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes, our 1.2 Tbps Anycast DDoS Shield is fully active on all nodes by default with zero configuration required and no extra charge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
