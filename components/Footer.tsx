"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Server, Github, Twitter, MessageSquare, Shield, CheckCircle2 } from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  if (isDashboard) return null

  return (
    <footer className="border-t border-border/40 bg-background/60">
      <div className="container px-4 py-12 md:py-16 mx-auto sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">
              <Server className="h-6 w-6 text-purple-500" />
              <span>AETHER<span className="font-light text-foreground">CLOUD</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ultra-low latency, decentralized NVMe virtual servers, bare metal instances, and worldwide edge computing solutions.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-foreground transition-colors"><Github className="h-5 w-5" /></a>
              <a href="#" className="hover:text-foreground transition-colors"><MessageSquare className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h4 className="font-semibold text-sm mb-4 tracking-wider uppercase text-foreground/80">Compute</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Virtual Private Servers (VPS)</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Bare Metal Servers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">GPU Cloud (NVIDIA H100)</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Serverless Functions</a></li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div>
            <h4 className="font-semibold text-sm mb-4 tracking-wider uppercase text-foreground/80">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Global Pricing</Link></li>
              <li><Link href="/features" className="hover:text-foreground transition-colors">Edge Locations</Link></li>
              <li><a href="#" className="hover:text-foreground transition-colors">DDoS Shield</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Aether API Docs</a></li>
            </ul>
          </div>

          {/* Column 4: Trust & Status */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm mb-4 tracking-wider uppercase text-foreground/80">Trust</h4>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg w-fit">
              <CheckCircle2 className="h-4 w-4 animate-pulse" />
              <span>All Systems Operational (99.99%)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-2 rounded-lg w-fit">
              <Shield className="h-4 w-4" />
              <span>Fully DDoS Protected</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} AetherCloud Technologies LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">SLA Agreement</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
