"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCloudStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Server, Cpu, Database, HardDrive, Zap, Shield, 
  Globe, Clock, Terminal, ChevronRight, Check, ArrowRight,
  TrendingUp, Users, RefreshCw
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { user, addServer } = useCloudStore()

  // Slider state for interactive server configurator
  const [cpu, setCpu] = useState(4) // cores
  const [ram, setRam] = useState(8) // GB
  const [storage, setStorage] = useState(160) // GB
  const [region, setRegion] = useState('us-east (N. Virginia)')
  const [serverName, setServerName] = useState('my-aether-node')
  
  // Calculate cost based on configuration
  const cost = (cpu * 6) + (ram * 2) + (storage * 0.1)
  const finalCost = parseFloat(cost.toFixed(2))

  // Handle instant deployment from landing page
  const handleDeployInstant = () => {
    // Save configuration parameters into local storage or state
    addServer({
      name: serverName,
      region,
      type: 'VPS',
      cpu,
      ram,
      storage,
      cost: finalCost,
      os: 'Ubuntu 22.04 LTS'
    })

    // If user is logged in, go straight to dashboard. Else go to login screen.
    if (user && user.isLoggedIn) {
      router.push('/dashboard/servers')
    } else {
      router.push('/login?redirect=/dashboard/servers')
    }
  }

  // Ping simulations for datacenters
  const [pings, setPings] = useState<Record<string, number>>({
    'New York': 12,
    'Frankfurt': 24,
    'Singapore': 48,
    'Tokyo': 62,
    'London': 18
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setPings({
        'New York': Math.max(8, Math.min(20, Math.round(12 + (Math.random() - 0.5) * 4))),
        'Frankfurt': Math.max(18, Math.min(32, Math.round(24 + (Math.random() - 0.5) * 6))),
        'Singapore': Math.max(40, Math.min(60, Math.round(48 + (Math.random() - 0.5) * 8))),
        'Tokyo': Math.max(52, Math.min(75, Math.round(62 + (Math.random() - 0.5) * 10))),
        'London': Math.max(12, Math.min(26, Math.round(18 + (Math.random() - 0.5) * 4)))
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="container px-4 pt-20 pb-16 md:pt-32 md:pb-24 mx-auto sm:px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs font-medium mb-6 animate-float">
          <Zap className="h-3.5 w-3.5 text-purple-400" />
          <span>Next-Gen NVMe v4 Compute Nodes Now Live</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
          The Developer Cloud built for <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">Extreme Speed</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
          Deploy ultra-low latency Virtual Private Servers, Dedicated Bare Metal, and Serverless Edge environments globally. Backed by 100Gbps network lines and next-gen hardware.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login">
            <Button variant="glow" size="lg" className="w-full sm:w-auto gap-2">
              Deploy a Node Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-border hover:bg-muted/50">
              View Pricing
            </Button>
          </Link>
        </div>

        {/* Live stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-20 border-t border-border/40 pt-10">
          <div className="text-center p-4">
            <div className="text-3xl sm:text-4xl font-bold text-foreground">99.999%</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Uptime SLA Guaranteed</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl sm:text-4xl font-bold text-foreground">{"< 1.2ms"}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Internal Network Latency</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl sm:text-4xl font-bold text-foreground">240,000+</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Active Containers</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl sm:text-4xl font-bold text-foreground">18</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Global Edge Regions</p>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE SERVER CONFIGURATOR */}
      <section className="container px-4 py-16 mx-auto sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Configure Your Dream Node
          </h2>
          <p className="text-muted-foreground">
            Adjust the sliders to build your virtual environment and watch your estimated price update in real-time. Deploy directly into production with one click.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Slider Controls */}
          <div className="lg:col-span-7 bg-card border border-border/60 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-purple-400" />
                  CPU Core Allocation
                </label>
                <span className="text-sm font-mono text-purple-400 font-semibold bg-purple-500/10 px-2.5 py-0.5 rounded-full">
                  {cpu} vCPUs (Intel Xeon)
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="32" 
                step="1"
                value={cpu} 
                onChange={(e) => setCpu(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg bg-secondary appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 Core</span>
                <span>8 Cores</span>
                <span>16 Cores</span>
                <span>32 Cores</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-400" />
                  System Memory (RAM)
                </label>
                <span className="text-sm font-mono text-blue-400 font-semibold bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                  {ram} GB ECC DDR5
                </span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="128" 
                step="2"
                value={ram} 
                onChange={(e) => setRam(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg bg-secondary appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>2 GB</span>
                <span>32 GB</span>
                <span>64 GB</span>
                <span>128 GB</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-pink-400" />
                  NVMe Raid-10 Storage
                </label>
                <span className="text-sm font-mono text-pink-400 font-semibold bg-pink-500/10 px-2.5 py-0.5 rounded-full">
                  {storage} GB PCIe Gen4
                </span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="1000" 
                step="20"
                value={storage} 
                onChange={(e) => setStorage(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg bg-secondary appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>20 GB</span>
                <span>250 GB</span>
                <span>500 GB</span>
                <span>1000 GB</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/40">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-medium">Server Location</label>
                <select 
                  value={region} 
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-background/50 border border-border/80 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="us-east (N. Virginia)">us-east (N. Virginia)</option>
                  <option value="eu-west (Frankfurt)">eu-west (Frankfurt)</option>
                  <option value="ap-southeast (Singapore)">ap-southeast (Singapore)</option>
                  <option value="ap-northeast (Tokyo)">ap-northeast (Tokyo)</option>
                  <option value="eu-central (London)">eu-central (London)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-medium">Server Hostname</label>
                <input 
                  type="text" 
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="e.g. production-node-1"
                  className="w-full bg-background/50 border border-border/80 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-purple-950/15 via-blue-950/10 to-background border border-purple-500/20 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  Configured Node
                </span>
                <h3 className="text-2xl font-bold mt-4 text-foreground">Aether VPS Standard</h3>
                <p className="text-sm text-muted-foreground mt-1">High-performance isolated execution container.</p>
              </div>

              <div className="space-y-3.5 border-t border-b border-border/40 py-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-400" />
                    vCPU Allocation
                  </span>
                  <span className="font-mono font-medium text-foreground">{cpu} Cores</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-400" />
                    System Memory
                  </span>
                  <span className="font-mono font-medium text-foreground">{ram} GB DDR5</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-400" />
                    Storage Space
                  </span>
                  <span className="font-mono font-medium text-foreground">{storage} GB NVMe</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-400" />
                    Network Outbound
                  </span>
                  <span className="font-mono font-medium text-foreground">10 TB Included</span>
                </div>
              </div>

              <div className="text-center py-2">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold text-foreground tracking-tight">${finalCost}</span>
                  <span className="text-muted-foreground text-sm">/ month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Estimated ${(finalCost / 720).toFixed(4)} / hour billing
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Button 
                variant="glow" 
                size="lg" 
                className="w-full gap-2 text-base py-6"
                onClick={handleDeployInstant}
              >
                <Terminal className="h-5 w-5" />
                Deploy Instantly
              </Button>
              <p className="text-[11px] text-center text-muted-foreground mt-3 leading-normal">
                Instant provisioning. You can resize, upgrade, or destroy this server at any time from the control panel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE BENEFITS / FEATURES */}
      <section className="container px-4 py-20 mx-auto sm:px-6 border-t border-border/40 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Engineered for Mission-Critical Apps
          </h2>
          <p className="text-muted-foreground">
            AetherCloud provides the ultimate developer hosting experience. Stop fighting slow hypervisors and complex server setups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 bg-card/40 border-border/50 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-500/20 transition-colors">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Hyper-Scale NVMe Storage</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Equipped with enterprise PCIe Gen4 NVMe arrays yielding up to 7,500MB/s read speeds. Databases query instantly, code compiles in milliseconds.
            </p>
          </Card>

          <Card className="p-6 bg-card/40 border-border/50 hover:border-blue-500/30 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-500/20 transition-colors">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Global Anycast Network</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A single virtual IP routed via our Anycast network to 18 global pops. Automatically redirects traffic to the closest server node during spikes.
            </p>
          </Card>

          <Card className="p-6 bg-card/40 border-border/50 hover:border-pink-500/30 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6 group-hover:bg-pink-500/20 transition-colors">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">1.2 Tbps DDoS Shield</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Real-time traffic inspection block threats at layer 3, 4 and 7 in less than 3 milliseconds. Keep your applications online through massive botnets.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. LATENCY MAP SECTION */}
      <section className="container px-4 py-16 mx-auto sm:px-6 border-t border-border/40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Ultra-Low Latency
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Global Edge Backbone
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We deploy our hypervisors directly in Tier-IV datacenters connected to primary Tier-1 transit providers. See live ping metrics from your current browser session to our core nodes below.
            </p>

            <div className="space-y-3 pt-4">
              {Object.entries(pings).map(([loc, ping]) => (
                <div key={loc} className="flex items-center justify-between bg-card/50 border border-border/60 rounded-lg px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-foreground">{loc} Datacenter</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-semibold">
                    <span>{ping} ms</span>
                    <Clock className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Network Map Visualization */}
          <div className="lg:col-span-7 bg-card/30 border border-border/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden min-h-[400px] flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            
            <div className="relative z-10 flex justify-between items-center border-b border-border/40 pb-4">
              <div>
                <h4 className="font-bold text-foreground">Network Routing Visualizer</h4>
                <p className="text-xs text-muted-foreground">Dynamic pathing across BGP lines</p>
              </div>
              <div className="flex items-center gap-2 text-xs bg-purple-500/15 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-full">
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>BGP Auto-Optimizing</span>
              </div>
            </div>

            {/* Glowing Map Mock */}
            <div className="relative z-10 h-64 flex items-center justify-center">
              <div className="absolute h-48 w-48 rounded-full border border-purple-500/10 animate-ping opacity-30" />
              <div className="absolute h-32 w-32 rounded-full border border-blue-500/20 animate-pulse" />
              
              {/* Core Node */}
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30 z-20">
                <Server className="h-5 w-5 text-white animate-bounce" />
              </div>

              {/* Surrounding Node Pins */}
              <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-purple-400 shadow-glow" />
                <span className="text-[10px] font-mono text-muted-foreground mt-1">US-East</span>
              </div>
              <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-blue-400 shadow-glow" />
                <span className="text-[10px] font-mono text-muted-foreground mt-1">EU-West</span>
              </div>
              <div className="absolute top-1/3 right-1/3 flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-pink-400 shadow-glow" />
                <span className="text-[10px] font-mono text-muted-foreground mt-1">AP-South</span>
              </div>
            </div>

            <div className="relative z-10 bg-black/40 border border-border/80 rounded-xl p-4 text-xs font-mono space-y-1">
              <p className="text-purple-400">{"$ traceroute api.aethercloud.io"}</p>
              <p className="text-muted-foreground">1  aether-core-router.nyc.anycast.net (1.2ms)</p>
              <p className="text-muted-foreground">2  tier1-transit-backbone.edge.net (4.8ms)</p>
              <p className="text-emerald-400">3  host-node-99.ubuntu22.aether.io (11.5ms) - SUCCESS</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="container px-4 py-20 mx-auto sm:px-6 text-center relative z-10">
        <div className="bg-gradient-to-r from-purple-950/20 via-blue-950/15 to-purple-950/20 border border-purple-500/20 rounded-3xl p-8 md:p-16 max-w-5xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
            Ready to experience true performance?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-base sm:text-lg">
            Create an account today and get $100 in free trial credits automatically applied. No credit card required to start provisioning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button variant="glow" size="lg" className="w-full sm:w-auto px-8 py-6 text-base">
                Claim Your $100 Credit
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-border hover:bg-muted/50 px-8 py-6 text-base">
                Access Sandbox
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
