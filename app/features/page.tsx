"use client"

import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, Globe, HardDrive, Cpu, Terminal, Zap, Check, 
  RefreshCw, Lock, Radio, Server, Code
} from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    {
      icon: Cpu,
      title: 'Next-Gen AMD EPYC & Intel Xeon',
      desc: 'All host nodes run premium server CPUs with 3.4GHz+ base clock speeds. Multi-threading is fully exposed for maximum query execution.',
      badge: 'Compute'
    },
    {
      icon: HardDrive,
      title: 'Enterprise PCIe NVMe SSDs',
      desc: 'Raid-10 arrays yield write speeds up to 5,000MB/s. Automatic bad-sector mapping and hot-swap replacement keeps data durable.',
      badge: 'Storage'
    },
    {
      icon: Globe,
      title: 'Anycast Global IP Routing',
      desc: 'A single global IP addresses routes traffic intelligently to the closest geographical datacenter to decrease latency.',
      badge: 'Network'
    },
    {
      icon: Shield,
      title: '1.2 Tbps DDoS Shield Protection',
      desc: 'Intelligent traffic scrubbers inspect packets at wire speed. Legitimate user requests pass through while malicious botnets are dropped.',
      badge: 'Security'
    },
    {
      icon: RefreshCw,
      title: 'Automated Daily Backups',
      desc: 'Hourly snapshotting with zero performance penalty. Restore full virtual server images or individual files in a single click.',
      badge: 'Backups'
    },
    {
      icon: Code,
      title: 'Full Developer API & CLI',
      desc: 'Automate server creation, destruction, and resizing via standard REST endpoints or our native Node/Go client SDKs.',
      badge: 'Automation'
    }
  ]

  const apiCode = `const Aether = require('@aether/sdk')('ae_live_8f3c9d1a7b...');

// Provision a developer node instantly
async function main() {
  const server = await Aether.servers.create({
    name: "api-worker-01",
    region: "us-east-1",
    plan: "aether-developer",
    image: "ubuntu-22.04"
  });
  
  console.log(\`Server running at \${server.ip_address}\`);
}
main();`

  return (
    <div className="relative py-16 md:py-24 bg-background overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/3 right-1/4 translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

      <div className="container px-4 mx-auto sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Engineered for <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">Extreme Performance</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our cloud infrastructure is custom-built from the silicon up. We don't resell white-labeled VPS. We own and operate our physical host cluster servers.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <Card key={feat.title} className="p-6 bg-card/40 border border-border/60 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{feat.badge}</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2.5 text-foreground">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </Card>
            )
          })}
        </div>

        {/* Developer API Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-border/40 pt-20">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Developer-First
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Fully Automated REST API
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every action inside the Aether Cloud console is powered by our public REST API. Automate server provisioning, snapshotting, and firewall configurations using standard webhooks or our SDKs.
            </p>

            <ul className="space-y-3 pt-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>JSON Web Token (JWT) API Authentication</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Webhooks for Server State Transitions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Terraform & Ansible Providers Available</span>
              </li>
            </ul>

            <div className="pt-4">
              <Link href="/signup">
                <Button variant="glow" className="gap-2">
                  Create Developer Account
                  <Terminal className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 bg-black/60 border border-border/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden font-mono text-xs text-muted-foreground">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/40" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/40" />
                <span className="h-3 w-3 rounded-full bg-green-500/40" />
              </div>
              <span className="text-xs text-muted-foreground">deploy.js</span>
            </div>
            <pre className="overflow-x-auto text-purple-200 leading-relaxed terminal-scroll">
              <code>{apiCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
