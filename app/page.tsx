"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCloudStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Server, Cpu, Database, HardDrive, Globe2, Zap, ShieldAlert, 
  ArrowRight, CheckCircle, Terminal, HelpCircle, ChevronDown, Play
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { user, addServer } = useCloudStore()
  
  // Interactive Server Configurator State
  const [cpu, setCpu] = useState(4)
  const [ram, setRam] = useState(8)
  const [storage, setStorage] = useState(160)
  const [region, setRegion] = useState('us-east (N. Virginia)')
  const [serverName, setServerName] = useState('aether-node-custom')
  const [deploying, setDeploying] = useState(false)

  // Calculate cost based on slider values
  const cost = Math.round((cpu * 8) + (ram * 2) + (storage * 0.1))

  // Simulated live metrics on the home page
  const [latency, setLatency] = useState(1.4)
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(parseFloat((1.2 + Math.random() * 0.6).toFixed(2)))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Handle instant server deployment from landing page
  const handleInstantDeploy = () => {
    setDeploying(true)
    setTimeout(() => {
      // Add server to store
      addServer({
        name: serverName || 'aether-node-custom',
        region,
        type: 'VPS',
        cpu,
        ram,
        storage,
        cost,
        os: 'Ubuntu 22.04 LTS'
      })
      
      // Navigate to dashboard
      if (user?.isLoggedIn) {
        router.push('/dashboard')
      } else {
        router.push('/login?redirect=/dashboard')
      }
    }, 1200)
  }

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: "What makes AetherCloud faster than traditional cloud providers?",
      a: "AetherCloud relies on a decentralized, ultra-low latency NVMe fabric combined with direct-to-fiber peering. This reduces routing hops, yielding latencies up to 40% lower than legacy hyperscalers."
    },
    {
      q: "Can I upgrade or downgrade my hardware on the fly?",
      a: "Yes! Our virtualized hypervisors support hot-swapping CPU and RAM. You can scale your server up or down directly from the dashboard without requiring a system reboot."
    },
    {
      q: "Is DDoS protection included by default?",
      a: "Absolutely. Every instance deployed on AetherCloud is shielded by our 12 Tbps Global DDoS Mitigation Engine, fully filtering Layer 3/4/7 attacks with zero added latency."
    }
  ]

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Glowing Circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-2/3 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="container px-4 pt-16 pb-20 md:pt-28 md:pb-32 mx-auto sm:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <Badge variant="outline" className="px-3 py-1 border-purple-500/30 bg-purple-500/10 text-purple-300 gap-1.5 animate-bounce">
            <Zap className="h-3 w-3 fill-purple-300" />
            Next-Gen Cloud Platform Now Live
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Deploy Global Compute.<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">
              In 2.4 Seconds.
            </span>
          </h1>
          
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience virtual servers, bare metal, and edge workloads on our low-latency global network. Designed for modern engineers.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link href="/login">
              <Button variant="glow" size="lg" className="w-full sm:w-auto gap-2">
                Deploy Server Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#interactive-config">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-muted hover:bg-muted/30">
                Configure Server
              </Button>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-16 max-w-3xl mx-auto text-left">
            <div className="border border-border/40 p-4 rounded-xl bg-card/40 backdrop-blur-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Avg Provisioning</div>
              <div className="text-2xl font-bold text-purple-400">2.4s</div>
            </div>
            <div className="border border-border/40 p-4 rounded-xl bg-card/40 backdrop-blur-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Network Latency</div>
              <div className="text-2xl font-bold text-blue-400">{latency}ms</div>
            </div>
            <div className="border border-border/40 p-4 rounded-xl bg-card/40 backdrop-blur-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Uptime Guarantee</div>
              <div className="text-2xl font-bold text-emerald-400">99.999%</div>
            </div>
            <div className="border border-border/40 p-4 rounded-xl bg-card/40 backdrop-blur-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">DDoS Protection</div>
              <div className="text-2xl font-bold text-pink-400">12 Tbps</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Server Configurator Section */}
      <section id="interactive-config" className="container px-4 py-20 mx-auto sm:px-6 border-t border-border/40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Description */}
          <div className="lg:col-span-5 space-y-6">
            <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-300">
              Interactive Hardware Lab
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Design your custom server setup.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Drag the sliders to select CPU cores, memory size, and NVMe storage. Watch the pricing adjust instantly.
            </p>
            <ul className="space-y-3">
              {[
                'Enterprise-grade AMD EPYC™ processors',
                '10 Gbps unmetered network port speed',
                'Automated snapshots every 24 hours',
                'Your choice of Ubuntu, Debian, Rocky, or Windows'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle className="h-5 w-5 text-purple-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Interactive Card */}
          <div className="lg:col-span-7">
            <Card className="border-purple-500/20 bg-card/60 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
              <CardContent className="p-6 sm:p-8 space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
                  <div>
                    <h3 className="font-bold text-xl">Cloud Configurator</h3>
                    <p className="text-xs text-muted-foreground">Estimate your cloud deployment instantly</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground uppercase">Server Name:</span>
                    <input 
                      type="text" 
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      className="bg-muted/50 border border-border px-2 py-1 rounded text-xs focus:outline-none focus:border-purple-500 font-mono text-purple-400"
                    />
                  </div>
                </div>

                {/* Slider 1: CPU */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 font-medium text-muted-foreground">
                      <Cpu className="h-4 w-4 text-purple-400" /> CPU Cores
                    </span>
                    <span className="font-bold text-foreground font-mono">{cpu} vCPU Cores</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="32" 
                    value={cpu} 
                    onChange={(e) => setCpu(parseInt(e.target.value))}
                    className="w-full accent-purple-500 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>1 vCPU</span>
                    <span>8 vCPU</span>
                    <span>16 vCPU</span>
                    <span>32 vCPU</span>
                  </div>
                </div>

                {/* Slider 2: RAM */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 font-medium text-muted-foreground">
                      <Database className="h-4 w-4 text-blue-400" /> RAM Size
                    </span>
                    <span className="font-bold text-foreground font-mono">{ram} GB DDR5 RAM</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="128" 
                    value={ram} 
                    onChange={(e) => setRam(parseInt(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>2 GB</span>
                    <span>32 GB</span>
                    <span>64 GB</span>
                    <span>128 GB</span>
                  </div>
                </div>

                {/* Slider 3: Storage */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 font-medium text-muted-foreground">
                      <HardDrive className="h-4 w-4 text-emerald-400" /> NVMe Storage
                    </span>
                    <span className="font-bold text-foreground font-mono">{storage} GB NVMe SSD</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="1000" 
                    value={storage} 
                    onChange={(e) => setStorage(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>20 GB</span>
                    <span>250 GB</span>
                    <span>500 GB</span>
                    <span>1000 GB</span>
                  </div>
                </div>

                {/* Location Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground uppercase font-semibold">Deployment Region</label>
                    <select 
                      value={region} 
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full bg-muted/40 border border-border rounded-lg p-2 text-sm focus:outline-none focus:border-purple-500"
                    >
                      <option value="us-east (N. Virginia)">us-east (N. Virginia)</option>
                      <option value="eu-west (Frankfurt)">eu-west (Frankfurt)</option>
                      <option value="ap-southeast (Singapore)">ap-southeast (Singapore)</option>
                      <option value="us-west (Oregon)">us-west (Oregon)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground uppercase font-semibold">Operating System</label>
                    <select className="w-full bg-muted/40 border border-border rounded-lg p-2 text-sm focus:outline-none focus:border-purple-500">
                      <option value="ubuntu">Ubuntu 22.04 LTS (Recommended)</option>
                      <option value="debian">Debian 12 Bookworm</option>
                      <option value="rocky">Rocky Linux 9</option>
                      <option value="windows">Windows Server 2022</option>
                    </select>
                  </div>
                </div>

                {/* Pricing Output */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-purple-950/20 border border-purple-500/20 rounded-xl">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase">Estimated Monthly Cost</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">${cost}</span>
                      <span className="text-sm text-muted-foreground">/ month</span>
                    </div>
                    <div className="text-[10px] text-purple-300 font-mono">≈ ${(cost / 730).toFixed(4)} / hour</div>
                  </div>
                  <Button 
                    variant="glow" 
                    size="lg" 
                    onClick={handleInstantDeploy} 
                    disabled={deploying}
                    className="w-full sm:w-auto gap-2"
                  >
                    {deploying ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Provisioning...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 fill-white" />
                        Deploy Instantly
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container px-4 py-20 mx-auto sm:px-6 border-t border-border/40 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <Badge variant="outline" className="border-pink-500/30 bg-pink-500/10 text-pink-300">
            Enterprise Scale
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Engineered for high-intensity workloads.
          </h2>
          <p className="text-muted-foreground">
            AetherCloud is packed with tools and infrastructure features that optimize performance, safety, and operational speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <Card className="bg-card/40 border-border/40 hover:border-purple-500/30 transition-all duration-300 group">
            <CardContent className="p-6 space-y-4">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg w-fit group-hover:bg-purple-500/20 transition-colors">
                <Globe2 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-lg text-white">Global Fiber Anycast</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our Anycast DNS and routing fabric guarantees traffic is automatically routed to the closest datacenter, minimizing latency.
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="bg-card/40 border-border/40 hover:border-blue-500/30 transition-all duration-300 group">
            <CardContent className="p-6 space-y-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg w-fit group-hover:bg-blue-500/20 transition-colors">
                <Terminal className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-bold text-lg text-white">Advanced Developer APIs</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Deploy, monitor, scale, and destroy servers using our robust REST API. Fully compatible with Terraform and Ansible.
              </p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="bg-card/40 border-border/40 hover:border-emerald-500/30 transition-all duration-300 group">
            <CardContent className="p-6 space-y-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg w-fit group-hover:bg-emerald-500/20 transition-colors">
                <ShieldAlert className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="font-bold text-lg text-white">12 Tbps Shield</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Always-on DDoS protection monitors and scrubs malicious traffic instantly, keeping your services online under heavy stress.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container px-4 py-20 mx-auto sm:px-6 border-t border-border/40 relative z-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-300">
              Got Questions?
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-sm">Everything you need to know about AetherCloud hosting</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-border/60 rounded-xl bg-card/20 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium text-foreground hover:text-purple-400 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 text-purple-400 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/20 bg-muted/10">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive CTA Banner */}
      <section className="container px-4 py-12 mx-auto sm:px-6 z-10 relative">
        <div className="p-8 sm:p-12 bg-gradient-to-r from-purple-900/40 via-purple-950/20 to-blue-900/40 border border-purple-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Ready to launch your first instance?</h3>
            <p className="text-muted-foreground text-sm max-w-xl">
              Create an account now and receive $100.00 in free credits to test our virtual servers and API integration.
            </p>
          </div>
          <Link href="/signup">
            <Button variant="glow" size="lg" className="w-full md:w-auto gap-2">
              Claim $100 Credit
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
