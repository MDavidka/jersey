"use client"

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Globe2, ShieldCheck, Cpu, HardDrive, Terminal, RefreshCw, Layers, Radio, Network } from 'lucide-react'
import Link from 'next/link'

export default function FeaturesPage() {
  const [selectedRegion, setSelectedRegion] = useState('us-east')

  const regions = [
    { id: 'us-east', name: 'US East (N. Virginia)', ping: '8ms', status: 'Optimal' },
    { id: 'eu-west', name: 'EU West (Frankfurt)', ping: '12ms', status: 'Optimal' },
    { id: 'ap-southeast', name: 'Asia Pacific (Singapore)', ping: '24ms', status: 'Optimal' },
    { id: 'us-west', name: 'US West (Oregon)', ping: '15ms', status: 'Optimal' },
    { id: 'sa-east', name: 'South America (São Paulo)', ping: '38ms', status: 'Optimal' },
  ]

  return (
    <div className="min-h-screen bg-background py-16 sm:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container px-4 mx-auto sm:px-6 relative z-10 space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-300">
            Platform Capabilities
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Built for performance.<br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Engineered for scale.
            </span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Discover the high-performance network fabric, advanced security protocols, and developer-first workflows that power AetherCloud.
          </p>
        </div>

        {/* Feature Grid with Detailed Explainers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Card 1: Network */}
          <Card className="bg-card/40 border-border/40 hover:border-purple-500/20 transition-all duration-300">
            <CardContent className="p-8 space-y-6">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl w-fit">
                <Globe2 className="h-6 w-6 text-purple-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Global Fiber Anycast</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AetherCloud runs a proprietary 100 Gbps dark fiber ring connecting all core regions. Our smart Anycast routing resolves DNS requests at the edge, sending requests directly to the closest hypervisor.
                </p>
              </div>
              <div className="border-t border-border/40 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Port speed</div>
                  <div className="text-lg font-bold text-purple-400">10 Gbps</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase">DNS resolution</div>
                  <div className="text-lg font-bold text-purple-400">&lt; 1.5ms</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Security */}
          <Card className="bg-card/40 border-border/40 hover:border-blue-500/20 transition-all duration-300">
            <CardContent className="p-8 space-y-6">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl w-fit">
                <ShieldCheck className="h-6 w-6 text-blue-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">12 Tbps DDoS Mitigation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Always-on protection. Our global scrubbing centers monitor network flows in real-time. When malicious traffic is detected, it is immediately rerouted and filtered at the edge, before it ever reaches your virtual server.
                </p>
              </div>
              <div className="border-t border-border/40 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Scrubbing capacity</div>
                  <div className="text-lg font-bold text-blue-400">12.4 Tbps</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Attack detection</div>
                  <div className="text-lg font-bold text-blue-400">&lt; 300ms</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Storage */}
          <Card className="bg-card/40 border-border/40 hover:border-emerald-500/20 transition-all duration-300">
            <CardContent className="p-8 space-y-6">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit">
                <HardDrive className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">PCIe Gen4 NVMe Storage</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Say goodbye to slow disk I/O. All virtual instances are backed by enterprise-grade NVMe drives configured in RAID-10. Achieve read speeds up to 7,400 MB/s for lightning-fast database queries.
                </p>
              </div>
              <div className="border-t border-border/40 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Read speed</div>
                  <div className="text-lg font-bold text-emerald-400">7,400 MB/s</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Write IOPS</div>
                  <div className="text-lg font-bold text-emerald-400">120,000+</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Compute */}
          <Card className="bg-card/40 border-border/40 hover:border-pink-500/20 transition-all duration-300">
            <CardContent className="p-8 space-y-6">
              <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl w-fit">
                <Cpu className="h-6 w-6 text-pink-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">AMD EPYC™ 9004 Processors</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Run your compute-heavy apps on the newest AMD Zen 4 architecture. Features high-frequency cores, native AVX-512 support, and secure encrypted virtualization (SEV) to keep your workloads secure.
                </p>
              </div>
              <div className="border-t border-border/40 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Base Frequency</div>
                  <div className="text-lg font-bold text-pink-400">3.7 GHz</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Memory Type</div>
                  <div className="text-lg font-bold text-pink-400">DDR5 ECC</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Region Latency Lab */}
        <section className="border border-border/40 rounded-2xl bg-card/20 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-300">
                Latency Interactive Lab
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Test Network Response</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Click on any global region to simulate real-time network latency. Experience how AetherCloud Anycast routing keeps speeds fast worldwide.
              </p>
              <div className="space-y-2 pt-2">
                {regions.map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => setSelectedRegion(reg.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-all text-left ${
                      selectedRegion === reg.id
                        ? 'border-purple-500 bg-purple-500/10 text-white font-semibold'
                        : 'border-border/60 hover:bg-muted/20 text-muted-foreground'
                    }`}
                  >
                    <span>{reg.name}</span>
                    <Badge variant={selectedRegion === reg.id ? 'default' : 'secondary'}>
                      {reg.ping}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Graph/Visual */}
            <div className="lg:col-span-7 bg-muted/20 border border-border/40 p-6 rounded-xl space-y-6">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-semibold text-white">Route Diagnostics</span>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              <div className="space-y-4 font-mono text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-purple-300">
                  <span className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">1</span>
                  <span>Tracing route to aether-edge-{selectedRegion}.aethercloud.io</span>
                </div>
                <div className="pl-6 border-l-2 border-dashed border-border/60 space-y-2">
                  <p className="text-emerald-400">✔ Client IP: 198.51.100.12 (Anycast Resolved)</p>
                  <p>✔ Hop 1: aether-gateway-edge.net (0.4ms)</p>
                  <p>✔ Hop 2: fiber-backbone-backplane.net (1.8ms)</p>
                  <p className="text-purple-400 font-bold">✔ Hop 3: target-hypervisor-{selectedRegion} ({regions.find(r => r.id === selectedRegion)?.ping})</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 pt-2 font-semibold">
                  <Radio className="h-4 w-4 animate-pulse" />
                  <span>Connection: Stable • Packet Loss: 0.00%</span>
                </div>
              </div>

              {/* Ping metrics comparison */}
              <div className="p-4 bg-background/50 border border-border/40 rounded-lg">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Hyperscaler Comparison (Lower is better)</h4>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>AetherCloud Edge</span>
                      <span className="font-bold text-emerald-400">{regions.find(r => r.id === selectedRegion)?.ping}</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '15%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>AWS / GCP Standard</span>
                      <span className="font-bold text-amber-400">42ms</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '55%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Traditional VPS Provider</span>
                      <span className="font-bold text-rose-400">89ms</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center space-y-6 max-w-2xl mx-auto pt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Experience high-performance cloud hosting today</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Get started with $100 in free credits. Deploy a virtual server in less than 3 seconds with zero upfront commitment.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button variant="glow" size="lg">Deploy Instant Server</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="hover:bg-muted/30">View Pricing Plans</Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
