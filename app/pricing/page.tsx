"use client"

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Info, HelpCircle, Cpu, Database, HardDrive, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import { useCloudStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const router = useRouter()
  const { user, addServer } = useCloudStore()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Developer Starter',
      badge: 'Popular',
      type: 'VPS',
      cpu: 2,
      ram: 4,
      storage: 80,
      monthlyCost: 15,
      features: [
        '2 vCPU AMD EPYC™ Cores',
        '4 GB DDR5 ECC Memory',
        '80 GB Enterprise NVMe SSD',
        '3 TB Transferred Bandwidth',
        '1 Gbps Port Speed',
        '1 IP Address included',
        'Basic DDoS Protection'
      ]
    },
    {
      name: 'Production Pro',
      badge: 'Best Value',
      type: 'VPS',
      cpu: 4,
      ram: 8,
      storage: 160,
      monthlyCost: 35,
      features: [
        '4 vCPU AMD EPYC™ Cores',
        '8 GB DDR5 ECC Memory',
        '160 GB Enterprise NVMe SSD',
        '6 TB Transferred Bandwidth',
        '5 Gbps Port Speed',
        '2 IP Addresses included',
        'Advanced DDoS Shield (12 Tbps)',
        'Daily Automatic Snapshots'
      ]
    },
    {
      name: 'Enterprise Ultra',
      badge: 'Top Tier',
      type: 'VPS',
      cpu: 8,
      ram: 16,
      storage: 320,
      monthlyCost: 75,
      features: [
        '8 vCPU AMD EPYC™ Cores',
        '16 GB DDR5 ECC Memory',
        '320 GB Enterprise NVMe SSD',
        '10 TB Transferred Bandwidth',
        '10 Gbps Port Speed',
        '4 IP Addresses included',
        'Advanced DDoS Shield (12 Tbps)',
        'Hourly Automatic Snapshots',
        'Dedicated SLA Agreement'
      ]
    }
  ]

  const handleSelectPlan = (plan: typeof plans[0]) => {
    const cost = billingPeriod === 'yearly' ? Math.round(plan.monthlyCost * 0.8) : plan.monthlyCost
    // Add server to store
    addServer({
      name: plan.name.toLowerCase().replace(/\s+/g, '-'),
      region: 'us-east (N. Virginia)',
      type: 'VPS',
      cpu: plan.cpu,
      ram: plan.ram,
      storage: plan.storage,
      cost,
      os: 'Ubuntu 22.04 LTS'
    })

    // Redirect to dashboard or login
    if (user?.isLoggedIn) {
      router.push('/dashboard')
    } else {
      router.push('/login?redirect=/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-background py-16 sm:py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container px-4 mx-auto sm:px-6 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-300">
            Simple Billing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Predictable pricing.<br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              No hidden fees.
            </span>
          </h1>
          <p className="text-muted-foreground text-base">
            Deploy servers with transparent billing. Upgrade, downgrade, or terminate instances at any time. Pay only for what you use.
          </p>

          {/* Billing Period Toggle */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-white font-semibold' : 'text-muted-foreground'}`}>Monthly Billing</span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 bg-purple-950 border border-purple-500/30 rounded-full p-0.5 transition-colors relative flex items-center"
            >
              <div className={`w-4 h-4 bg-purple-400 rounded-full transition-transform ${billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
            <span className={`text-sm flex items-center gap-1.5 ${billingPeriod === 'yearly' ? 'text-white font-semibold' : 'text-muted-foreground'}`}>
              Yearly Billing
              <Badge variant="success" className="text-[10px] py-0 px-2">Save 20%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const cost = billingPeriod === 'yearly' ? Math.round(plan.monthlyCost * 0.8) : plan.monthlyCost
            const isBestValue = plan.badge === 'Best Value'

            return (
              <Card 
                key={plan.name} 
                className={`bg-card/40 border-border/40 relative ${
                  isBestValue ? 'border-purple-500/50 shadow-purple-500/10 shadow-xl' : ''
                }`}
              >
                {isBestValue && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Best Value
                  </div>
                )}
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">High performance AMD EPYC Virtual Server</p>
                  </div>

                  <div className="flex items-baseline gap-1 border-b border-border/40 pb-6">
                    <span className="text-4xl font-extrabold text-white font-mono">${cost}</span>
                    <span className="text-muted-foreground text-sm">/ month</span>
                  </div>

                  {/* Hardware Summary */}
                  <div className="grid grid-cols-3 gap-2 py-3 bg-muted/20 rounded-lg border border-border/40 text-center">
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-muted-foreground uppercase flex items-center justify-center gap-1">
                        <Cpu className="h-3 w-3 text-purple-400" /> CPU
                      </div>
                      <div className="text-xs font-bold font-mono">{plan.cpu} Cores</div>
                    </div>
                    <div className="space-y-0.5 border-x border-border/40">
                      <div className="text-[10px] text-muted-foreground uppercase flex items-center justify-center gap-1">
                        <Database className="h-3 w-3 text-blue-400" /> RAM
                      </div>
                      <div className="text-xs font-bold font-mono">{plan.ram} GB</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-muted-foreground uppercase flex items-center justify-center gap-1">
                        <HardDrive className="h-3 w-3 text-emerald-400" /> Disk
                      </div>
                      <div className="text-xs font-bold font-mono">{plan.storage} GB</div>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <Check className="h-4 w-4 text-purple-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={isBestValue ? 'glow' : 'outline'} 
                    className="w-full mt-4"
                    onClick={() => handleSelectPlan(plan)}
                  >
                    Deploy This Server
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Feature Comparison Table */}
        <section className="max-w-5xl mx-auto border border-border/40 rounded-2xl bg-card/20 overflow-hidden">
          <div className="p-6 border-b border-border/40">
            <h3 className="text-xl font-bold text-white">Full Feature Matrix</h3>
            <p className="text-xs text-muted-foreground">Compare hardware features across various classes of servers</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4 sm:p-5">Feature</th>
                  <th className="p-4 sm:p-5">Virtual Servers (VPS)</th>
                  <th className="p-4 sm:p-5">Bare Metal</th>
                  <th className="p-4 sm:p-5">Serverless Functions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-muted-foreground">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Hypervisor Isolation</td>
                  <td className="p-4 sm:p-5">KVM Virtualization</td>
                  <td className="p-4 sm:p-5">Physical Isolation</td>
                  <td className="p-4 sm:p-5">gVisor Sandbox</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">CPU Architecture</td>
                  <td className="p-4 sm:p-5">AMD EPYC™ Zen 4 Shared</td>
                  <td className="p-4 sm:p-5">AMD EPYC™ Zen 4 Dedicated</td>
                  <td className="p-4 sm:p-5">Shared Ephemeral Cores</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Storage Fabric</td>
                  <td className="p-4 sm:p-5">NVMe RAID-10</td>
                  <td className="p-4 sm:p-5">Direct PCIe Gen4 NVMe</td>
                  <td className="p-4 sm:p-5">Distributed Cloud Object</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Monthly Bandwidth</td>
                  <td className="p-4 sm:p-5">3 TB to 10 TB</td>
                  <td className="p-4 sm:p-5">100 TB to Unmetered</td>
                  <td className="p-4 sm:p-5">Pay per GB transferred</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Root SSH Access</td>
                  <td className="p-4 sm:p-5">Yes (Full root)</td>
                  <td className="p-4 sm:p-5">Yes (Full root + IPMI)</td>
                  <td className="p-4 sm:p-5">No (API Deployment)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  )
}
