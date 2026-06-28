"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCloudStore, Server } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Server as ServerIcon, Cpu, Database, HardDrive, Globe, Zap, 
  Terminal, RefreshCw, ChevronRight, Activity, Bell, Plus
} from 'lucide-react'

export default function DashboardOverview() {
  const { servers, user, logs, addFunds } = useCloudStore()

  // Calculate aggregated stats with explicit typing
  const activeServers = servers.filter(s => s.status === 'running')
  const totalServers = servers.length
  
  const avgCpu = activeServers.length > 0 
    ? Math.round(activeServers.reduce((acc: number, s: Server) => acc + s.cpuUsage, 0) / activeServers.length) 
    : 0
    
  const avgRam = activeServers.length > 0 
    ? Math.round(activeServers.reduce((acc: number, s: Server) => acc + s.ramUsage, 0) / activeServers.length) 
    : 0

  const totalBw = Number.parseFloat(
    servers.reduce((acc: number, s: Server) => acc + s.bandwidthUsage, 0).toFixed(1)
  )

  // Simulated live graph points
  const [graphData, setGraphData] = useState<number[]>([42, 38, 45, 52, 48, 55, 60, 58, 50, 48, 52, 45])

  useEffect(() => {
    const interval = setInterval(() => {
      setGraphData((prev) => {
        // Remove first, add random around current average CPU
        const nextPoints = [...prev.slice(1)]
        const base = avgCpu > 0 ? avgCpu : 25
        const variance = (Math.random() - 0.5) * 15
        const nextVal = Math.max(5, Math.min(95, Math.round(base + variance)))
        nextPoints.push(nextVal)
        return nextPoints
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [avgCpu])

  return (
    <div className="space-y-8">
      {/* 1. WELCOME BANNER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Console Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time telemetry and cloud hypervisor controls.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/servers">
            <Button variant="glow" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Server
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => addFunds(50)}
            className="gap-1.5 border-border hover:bg-card/50"
          >
            <Zap className="h-4 w-4 text-purple-400" />
            Add $50 Trial
          </Button>
        </div>
      </div>

      {/* 2. METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Servers */}
        <Card className="p-6 bg-card/40 border border-border/60">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Deployments</span>
              <div className="text-3xl font-extrabold text-foreground">{totalServers}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <ServerIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{activeServers.length} Active Nodes Running</span>
          </div>
        </Card>

        {/* Avg CPU Usage */}
        <Card className="p-6 bg-card/40 border border-border/60">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Cluster CPU Load</span>
              <div className="text-3xl font-extrabold text-foreground">{avgCpu}%</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Cpu className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${avgCpu}%` }} />
            </div>
          </div>
        </Card>

        {/* Avg RAM Usage */}
        <Card className="p-6 bg-card/40 border border-border/60">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Cluster RAM Load</span>
              <div className="text-3xl font-extrabold text-foreground">{avgRam}%</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
              <Database className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-pink-500 transition-all duration-500" style={{ width: `${avgRam}%` }} />
            </div>
          </div>
        </Card>

        {/* Total Bandwidth */}
        <Card className="p-6 bg-card/40 border border-border/60">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Bandwidth</span>
              <div className="text-3xl font-extrabold text-foreground">{totalBw} GB</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Globe className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>Real-time BGP routing active</span>
          </div>
        </Card>
      </div>

      {/* 3. DYNAMIC GRAPH & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Real-time Load Graph */}
        <Card className="lg:col-span-8 p-6 bg-card/40 border border-border/60 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-purple-400" />
                Live Cluster Performance (Aggregate CPU Load)
              </CardTitle>
              <CardDescription className="text-xs">Aggregated CPU activity across your cluster nodes</CardDescription>
            </div>
            <Badge variant="success" className="gap-1 animate-pulse">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Live Telemetry
            </Badge>
          </div>

          {/* SVG Graph */}
          <div className="h-48 w-full flex items-end relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-border/20 w-full h-0" />
              <div className="border-b border-border/20 w-full h-0" />
              <div className="border-b border-border/20 w-full h-0" />
              <div className="border-b border-border/20 w-full h-0" />
            </div>

            {/* SVG Path */}
            <svg className="w-full h-full overflow-visible z-10" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d={`M ${graphData.map((val, idx) => `${(idx / (graphData.length - 1)) * 400},${100 - val}`).join(' L ')}`}
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              <path
                d={`M 0,100 L ${graphData.map((val, idx) => `${(idx / (graphData.length - 1)) * 400},${100 - val}`).join(' L ')} L 400,100 Z`}
                fill="url(#gradient)"
                className="transition-all duration-500"
              />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-muted-foreground mt-4 font-mono">
            <span>45s ago</span>
            <span>30s ago</span>
            <span>15s ago</span>
            <span>Now</span>
          </div>
        </Card>

        {/* Quick Actions Panel */}
        <Card className="lg:col-span-4 p-6 bg-card/40 border border-border/60">
          <CardHeader className="p-0 pb-4 border-b border-border/40">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-purple-400" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-xs">Rapid shortcuts for sandbox control</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-6 space-y-3">
            <Link href="/dashboard/servers" className="block">
              <Button variant="outline" className="w-full justify-between border-border hover:bg-card/50 text-xs">
                <span className="flex items-center gap-2">
                  <ServerIcon className="h-4 w-4 text-purple-400" />
                  Manage Active Servers
                </span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            
            <Link href="/dashboard/billing" className="block">
              <Button variant="outline" className="w-full justify-between border-border hover:bg-card/50 text-xs">
                <span className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-400" />
                  Refill Account Balance
                </span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>

            <Link href="/dashboard/settings" className="block">
              <Button variant="outline" className="w-full justify-between border-border hover:bg-card/50 text-xs">
                <span className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-pink-400" />
                  Generate API Keys
                </span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 4. ACTIVITY LOGS */}
      <Card className="p-6 bg-card/40 border border-border/60">
        <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4.5 w-4.5 text-purple-400 animate-bounce" />
            <h3 className="font-bold text-foreground text-sm sm:text-base">Cluster Event Log</h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Real-time syslog stream</span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto terminal-scroll">
          {logs.slice().reverse().map((log, idx) => (
            <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-black/30 border border-border/40 font-mono text-[11px] leading-relaxed">
              <span className="text-purple-400 shrink-0">[{new Date().toLocaleTimeString()}]</span>
              <span className="text-muted-foreground">{log}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
