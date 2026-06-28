"use client"

import React from 'react'
import Link from 'next/link'
import { useCloudStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Server, Cpu, Database, HardDrive, CircleDollarSign, 
  Terminal, Play, Square, RefreshCw, Plus, ArrowUpRight, History
} from 'lucide-react'

export default function DashboardOverview() {
  const { servers, logs, updateServerStatus, user } = useCloudStore()

  // Calculate aggregated stats
  const runningServers = servers.filter(s => s.status === 'running')
  const totalCpu = servers.reduce((sum, s) => sum + (s.status === 'running' ? s.cpu : 0), 0)
  const totalRam = servers.reduce((sum, s) => sum + (s.status === 'running' ? s.ram : 0), 0)
  const totalStorage = servers.reduce((sum, s) => sum + (s.status === 'running' ? s.storage : 0), 0)
  const totalMonthlyCost = servers.reduce((sum, s) => sum + s.cost, 0)

  // Calculate average CPU and RAM usage across running servers
  const avgCpuUsage = runningServers.length > 0 
    ? Math.round(runningServers.reduce((sum, s) => sum + s.cpuUsage, 0) / runningServers.length)
    : 0
  const avgRamUsage = runningServers.length > 0 
    ? Math.round(runningServers.reduce((sum, s) => sum + s.ramUsage, 0) / runningServers.length)
    : 0

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-purple-950/20 to-blue-950/20 border border-purple-500/20 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back, {user?.name || 'Developer'}!</h1>
          <p className="text-xs text-muted-foreground mt-1">Your global infrastructure is running optimal. No incidents reported in past 30 days.</p>
        </div>
        <Link href="/dashboard/servers">
          <Button variant="glow" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Deploy Server
          </Button>
        </Link>
      </div>

      {/* Aggregate Resource Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total CPU cores */}
        <Card className="bg-card/40 border-border/40">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Active Compute</span>
              <div className="text-2xl font-extrabold text-white font-mono">{totalCpu} Cores</div>
              <p className="text-[10px] text-muted-foreground">Across {runningServers.length} active instances</p>
            </div>
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
              <Cpu className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total RAM */}
        <Card className="bg-card/40 border-border/40">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Active Memory</span>
              <div className="text-2xl font-extrabold text-white font-mono">{totalRam} GB</div>
              <p className="text-[10px] text-muted-foreground">High-frequency DDR5 ECC</p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Database className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Storage */}
        <Card className="bg-card/40 border-border/40">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Active Storage</span>
              <div className="text-2xl font-extrabold text-white font-mono">{totalStorage} GB</div>
              <p className="text-[10px] text-muted-foreground">PCIe Gen4 NVMe RAID-10</p>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <HardDrive className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Monthly Budget */}
        <Card className="bg-card/40 border-border/40">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Monthly Cost</span>
              <div className="text-2xl font-extrabold text-white font-mono">${totalMonthlyCost}</div>
              <p className="text-[10px] text-purple-300">Est. hourly: ${(totalMonthlyCost / 730).toFixed(3)}/hr</p>
            </div>
            <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-400">
              <CircleDollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Live Load Indicators (Graphs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Resource Load Bar Chart */}
        <Card className="lg:col-span-8 bg-card/40 border-border/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
              Live Account Resource Load
            </CardTitle>
            <CardDescription className="text-xs">Aggregate usage across all active, running nodes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* CPU Load bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground uppercase font-semibold">Aggregate CPU Load</span>
                <span className="font-bold text-white">{avgCpuUsage}%</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border/40 relative">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${avgCpuUsage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0% Idle</span>
                <span>50% Load</span>
                <span>100% Max</span>
              </div>
            </div>

            {/* RAM Load bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground uppercase font-semibold">Aggregate RAM Memory Load</span>
                <span className="font-bold text-white">{avgRamUsage}%</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border/40 relative">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${avgRamUsage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0% Idle</span>
                <span>50% Loaded</span>
                <span>100% Max</span>
              </div>
            </div>

            {/* Platform Health Status */}
            <div className="p-4 bg-muted/20 border border-border/40 rounded-xl grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase">Virtual Hypervisors</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">Healthy (3/3)</div>
              </div>
              <div className="border-x border-border/40">
                <div className="text-[10px] text-muted-foreground uppercase">Packet Loss</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">0.000%</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase">Global Datacenters</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">Online (100%)</div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Real-time Event Logger */}
        <Card className="lg:col-span-4 bg-card/40 border-border/40 flex flex-col h-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Terminal className="h-4 w-4 text-purple-400" />
              Console Logs
            </CardTitle>
            <CardDescription className="text-xs">Real-time system events stream</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="bg-black/40 border border-border/40 p-4 rounded-xl font-mono text-[11px] text-purple-300 space-y-2 h-44 overflow-y-auto terminal-scroll">
              {logs.slice().reverse().map((log, idx) => (
                <div key={idx} className="flex gap-1.5 leading-relaxed">
                  <span className="text-muted-foreground shrink-0">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-muted-foreground mt-3 flex items-center justify-between border-t border-border/20 pt-2 font-mono">
              <span>Stream: active</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Listening to 3 nodes
              </span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Active Servers Grid List */}
      <Card className="bg-card/40 border-border/40">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-base font-bold">Active Cloud Instances</CardTitle>
            <CardDescription className="text-xs">Hardware configuration and real-time IP allocation</CardDescription>
          </div>
          <Link href="/dashboard/servers">
            <Button variant="outline" size="sm" className="gap-1 text-xs border-border/60">
              Manage Servers
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4">Server Name</th>
                  <th className="p-4">Region</th>
                  <th className="p-4 font-mono">IPv4 Address</th>
                  <th className="p-4">CPU Load</th>
                  <th className="p-4">RAM Memory</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Power</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-muted-foreground">
                {servers.map((srv) => (
                  <tr key={srv.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 border rounded-lg ${
                          srv.status === 'running' 
                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                            : 'bg-muted/40 border-border text-muted-foreground'
                        }`}>
                          <Server className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{srv.name}</p>
                          <p className="text-[10px] text-muted-foreground">{srv.type} • {srv.os}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium">{srv.region}</td>
                    <td className="p-4 font-mono text-xs">{srv.ip}</td>
                    <td className="p-4 font-mono text-xs">
                      {srv.status === 'running' ? (
                        <span className={srv.cpuUsage > 75 ? 'text-rose-400 font-bold' : 'text-purple-300'}>
                          {srv.cpuUsage}%
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-4 font-mono text-xs">
                      {srv.status === 'running' ? `${srv.ramUsage}%` : '—'}
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={
                          srv.status === 'running' ? 'success' : 
                          srv.status === 'stopped' ? 'destructive' : 'warning'
                        }
                      >
                        {srv.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {srv.status === 'running' ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => updateServerStatus(srv.id, 'stopped')}
                          className="h-7 w-7 text-rose-400 hover:bg-rose-500/10"
                          title="Stop Server"
                        >
                          <Square className="h-3.5 w-3.5 fill-rose-400" />
                        </Button>
                      ) : srv.status === 'stopped' ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => updateServerStatus(srv.id, 'running')}
                          className="h-7 w-7 text-emerald-400 hover:bg-emerald-500/10"
                          title="Start Server"
                        >
                          <Play className="h-3.5 w-3.5 fill-emerald-400" />
                        </Button>
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
