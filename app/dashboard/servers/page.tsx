"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useCloudStore, Server } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Server as ServerIcon, Terminal, Play, Square, RefreshCw, Trash2, 
  Plus, X, Cpu, Database, HardDrive, Globe, ChevronRight, Check, Shield
} from 'lucide-react'

export default function ServersPage() {
  const { servers, addServer, deleteServer, updateServerStatus, addLog } = useCloudStore()
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newName, setNewName] = useState('production-web-node')
  const [newRegion, setNewRegion] = useState('us-east (N. Virginia)')
  const [newType, setNewType] = useState<'VPS' | 'Bare Metal' | 'Serverless'>('VPS')
  const [newCpu, setNewCpu] = useState(2)
  const [newRam, setNewRam] = useState(4)
  const [newStorage, setNewStorage] = useState(80)
  const [newOs, setNewOs] = useState('Ubuntu 22.04 LTS')

  // Terminal state
  const [activeTerminalServer, setActiveTerminalServer] = useState<Server | null>(null)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const terminalBottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll terminal history to bottom
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [terminalHistory])

  // Handle server creation
  const handleCreateServer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName) return

    const estimatedCost = (newCpu * 6) + (newRam * 2) + (newStorage * 0.1)
    
    addServer({
      name: newName.toLowerCase().replace(/\s+/g, '-'),
      region: newRegion,
      type: newType,
      cpu: newCpu,
      ram: newRam,
      storage: newStorage,
      cost: parseFloat(estimatedCost.toFixed(2)),
      os: newOs
    })

    setShowCreateModal(false)
    // Reset form
    setNewName('production-web-node')
  }

  // Open Terminal
  const openTerminal = (server: Server) => {
    setActiveTerminalServer(server)
    setTerminalHistory([
      `AetherOS v4.11.2-generic (kernel 5.15.0-88-generic)`,
      `Welcome to ${server.name}!`,
      `System IP: ${server.ip} | Region: ${server.region}`,
      `Type 'help' to view available interactive commands.`,
      ` `
    ])
  }

  // Execute terminal commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const input = terminalInput.trim()
    if (!input) return

    const cmd = input.toLowerCase().split(' ')[0]
    const args = input.toLowerCase().split(' ').slice(1)
    
    let response: string[] = []

    setTerminalHistory(prev => [...prev, `root@${activeTerminalServer?.name || 'node'}:~$ ${input}`])

    switch (cmd) {
      case 'help':
        response = [
          `Available Aether Shell commands:`,
          `  help        - Displays list of commands`,
          `  ls          - Lists directory folders and files`,
          `  neofetch    - System specifications details`,
          `  ping        - Ping network connectivity`,
          `  top         - Process monitor (simulated)`,
          `  reboot      - Safely reboots host node`,
          `  clear       - Clears shell screen`
        ]
        break
      case 'ls':
        response = [
          `drwxr-xr-x  2 root root  4096 May 15 08:30  api/`,
          `drwxr-xr-x  4 root root  4096 May 15 08:32  logs/`,
          `-rw-r--r--  1 root root   812 May 15 08:29  main.go`,
          `-rw-r--r--  1 root root   240 May 15 08:28  config.yaml`
        ]
        break
      case 'neofetch':
        response = [
          `   /\\_/\\     root@${activeTerminalServer?.name || 'node'}`,
          `  ( o.o )    OS: AetherCloud Linux v4.11`,
          `   > ^ <     Kernel: 5.15.0-88-generic`,
          `             Uptime: 24 days, 12 hours`,
          `             CPU: Intel Xeon (${activeTerminalServer?.cpu} Cores)`,
          `             RAM: ${activeTerminalServer?.ram} GB ECC DDR5`,
          `             Storage: ${activeTerminalServer?.storage} GB PCIe Gen4`,
          `             IP: ${activeTerminalServer?.ip}`
        ]
        break
      case 'ping':
        const target = args[0] || '8.8.8.8'
        response = [
          `PING ${target} (${target}) 56(84) bytes of data.`,
          `64 bytes from ${target}: icmp_seq=1 ttl=56 time=11.2 ms`,
          `64 bytes from ${target}: icmp_seq=2 ttl=56 time=10.8 ms`,
          `64 bytes from ${target}: icmp_seq=3 ttl=56 time=12.1 ms`,
          `--- ${target} ping statistics ---`,
          `3 packets transmitted, 3 received, 0% packet loss, time 2002ms`,
          `rtt min/avg/max/mdev = 10.8/11.3/12.1/0.55 ms`
        ]
        break
      case 'top':
        response = [
          `Tasks: 112 total,   1 running, 111 sleeping,   0 stopped`,
          `%Cpu(s): 12.4 us,  2.1 sy,  0.0 ni, 85.5 id`,
          `MiB Mem : ${Math.round((activeTerminalServer?.ram || 4) * 1024)} total,  1024 free,  ${Math.round((activeTerminalServer?.ram || 4) * 512)} used`,
          ` `,
          `  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND`,
          ` 1012 root      20   0  712400  45210  12350 S   4.2   1.2   0:12.45 node-api`,
          `  998 root      20   0  124800  12400   4510 S   1.1   0.4   0:04.12 nginx`,
          ` 1104 root      20   0   14500   2400   1100 R   0.8   0.1   0:00.15 top`,
          `    1 root      20   0   45200   4100   2100 S   0.0   0.1   0:01.12 systemd`
        ]
        break
      case 'reboot':
        response = [`Rebooting server node... Connection closed.`]
        if (activeTerminalServer) {
          const sId = activeTerminalServer.id
          updateServerStatus(sId, 'provisioning')
          addLog(`Action: Safe reboot triggered on server ${activeTerminalServer.name}.`)
          
          // Re-activate server after 5s
          setTimeout(() => {
            updateServerStatus(sId, 'running')
          }, 5000)
        }
        setTimeout(() => {
          setActiveTerminalServer(null)
        }, 1500)
        break
      case 'clear':
        setTerminalHistory([])
        setTerminalInput('')
        return
      default:
        response = [`bash: command not found: ${cmd}. Type 'help' to view options.`]
    }

    setTerminalHistory(prev => [...prev, ...response, ` `])
    setTerminalInput('')
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Virtual Server Nodes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Provision, monitor, and configure your decentralized virtual instances.
          </p>
        </div>
        <Button variant="glow" onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Provision Node
        </Button>
      </div>

      {/* SERVERS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {servers.map((server) => (
          <Card key={server.id} className="bg-card/40 border border-border/60 p-6 flex flex-col justify-between relative overflow-hidden group">
            {/* Status indicator bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${
              server.status === 'running' ? 'bg-emerald-500' :
              server.status === 'stopped' ? 'bg-amber-500' : 'bg-purple-500 animate-pulse'
            }`} />

            <div className="space-y-4">
              {/* Server Name & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-foreground truncate">{server.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{server.ip}</p>
                </div>
                <Badge variant={
                  server.status === 'running' ? 'success' :
                  server.status === 'stopped' ? 'warning' : 'default'
                } className="capitalize">
                  {server.status}
                </Badge>
              </div>

              {/* Server Specs */}
              <div className="grid grid-cols-3 gap-2 border-t border-b border-border/40 py-4 text-xs font-mono text-muted-foreground">
                <div className="space-y-1">
                  <span className="text-[10px] block font-semibold text-muted-foreground/80">CPU</span>
                  <span className="text-foreground font-bold flex items-center gap-1">
                    <Cpu className="h-3.5 w-3.5 text-purple-400" />
                    {server.cpu} Cores
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] block font-semibold text-muted-foreground/80">RAM</span>
                  <span className="text-foreground font-bold flex items-center gap-1">
                    <Database className="h-3.5 w-3.5 text-blue-400" />
                    {server.ram} GB
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] block font-semibold text-muted-foreground/80">NVMe</span>
                  <span className="text-foreground font-bold flex items-center gap-1">
                    <HardDrive className="h-3.5 w-3.5 text-pink-400" />
                    {server.storage} GB
                  </span>
                </div>
              </div>

              {/* Dynamic Usage Metrics */}
              {server.status === 'running' ? (
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono">
                      <span>CPU Usage</span>
                      <span className="text-purple-400 font-bold">{server.cpuUsage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${server.cpuUsage}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono">
                      <span>RAM Usage</span>
                      <span className="text-blue-400 font-bold">{server.ramUsage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${server.ramUsage}%` }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[68px] flex items-center justify-center border border-dashed border-border/60 rounded-lg text-xs text-muted-foreground font-mono">
                  {server.status === 'stopped' ? 'Server Offline' : 'Provisioning Cluster Hardware...'}
                </div>
              )}

              {/* General Metadata */}
              <div className="flex justify-between text-xs text-muted-foreground border-t border-border/40 pt-3 font-mono">
                <span>{server.region.split(' ')[0]}</span>
                <span>{server.os.split(' ')[0]}</span>
                <span className="text-foreground font-bold">${server.cost}/mo</span>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-border/40">
              {server.status === 'running' ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => updateServerStatus(server.id, 'stopped')}
                  title="Stop Server"
                  className="border-border hover:bg-amber-500/10 hover:text-amber-400"
                >
                  <Square className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={server.status === 'provisioning'}
                  onClick={() => updateServerStatus(server.id, 'running')}
                  title="Start Server"
                  className="border-border hover:bg-emerald-500/10 hover:text-emerald-400"
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}

              <Button 
                variant="outline" 
                size="sm" 
                disabled={server.status !== 'running'}
                onClick={() => {
                  updateServerStatus(server.id, 'provisioning')
                  setTimeout(() => updateServerStatus(server.id, 'running'), 4000)
                }}
                title="Reboot Server"
                className="border-border hover:bg-purple-500/10 hover:text-purple-400"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                disabled={server.status !== 'running'}
                onClick={() => openTerminal(server)}
                title="Open Terminal Console"
                className="border-border hover:bg-blue-500/10 hover:text-blue-400 gap-1"
              >
                <Terminal className="h-4 w-4" />
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => deleteServer(server.id)}
                title="Terminate Server"
                className="border-border hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* PROVISIONING MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-lg p-6 sm:p-8 bg-card border border-border/80 relative animate-accordion-down">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ServerIcon className="h-5 w-5 text-purple-500" />
                Provision Server Node
              </CardTitle>
              <CardDescription className="text-xs">Configure your virtual hypervisor instance specifications.</CardDescription>
            </div>

            <form onSubmit={handleCreateServer} className="space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground block">Server Hostname</label>
                  <Input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    placeholder="production-web-node"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground block">Operating System</label>
                  <select 
                    value={newOs}
                    onChange={(e) => setNewOs(e.target.value)}
                    className="w-full h-9 bg-background/50 border border-border rounded-md px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="Ubuntu 22.04 LTS">Ubuntu 22.04 LTS</option>
                    <option value="Debian 12 Bookworm">Debian 12 Bookworm</option>
                    <option value="Rocky Linux 9">Rocky Linux 9</option>
                    <option value="Alpine Linux 3.19">Alpine Linux 3.19</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground block">Deployment Region</label>
                  <select 
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full h-9 bg-background/50 border border-border rounded-md px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="us-east (N. Virginia)">us-east (N. Virginia)</option>
                    <option value="eu-west (Frankfurt)">eu-west (Frankfurt)</option>
                    <option value="ap-southeast (Singapore)">ap-southeast (Singapore)</option>
                    <option value="ap-northeast (Tokyo)">ap-northeast (Tokyo)</option>
                    <option value="eu-central (London)">eu-central (London)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground block">Server Type</label>
                  <select 
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full h-9 bg-background/50 border border-border rounded-md px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="VPS">VPS (Standard Virtual Server)</option>
                    <option value="Bare Metal">Bare Metal (Dedicated Physical)</option>
                    <option value="Serverless">Serverless (Containerized)</option>
                  </select>
                </div>
              </div>

              {/* Specs Sliders */}
              <div className="space-y-4 pt-3 border-t border-border/40">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>CPU Allocation</span>
                    <span className="text-purple-400 font-mono">{newCpu} vCPUs</span>
                  </div>
                  <input 
                    type="range" min="1" max="16" step="1" value={newCpu} 
                    onChange={(e) => setNewCpu(parseInt(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>RAM Allocation</span>
                    <span className="text-blue-400 font-mono">{newRam} GB</span>
                  </div>
                  <input 
                    type="range" min="2" max="64" step="2" value={newRam} 
                    onChange={(e) => setNewRam(parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>NVMe Raid Storage</span>
                    <span className="text-pink-400 font-mono">{newStorage} GB</span>
                  </div>
                  <input 
                    type="range" min="20" max="500" step="20" value={newStorage} 
                    onChange={(e) => setNewStorage(parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-3.5 flex justify-between items-center mt-4">
                <div>
                  <span className="text-xs text-muted-foreground">Estimated Cost</span>
                  <div className="text-lg font-extrabold text-foreground">
                    ${((newCpu * 6) + (newRam * 2) + (newStorage * 0.1)).toFixed(2)} <span className="text-xs font-light text-muted-foreground">/ month</span>
                  </div>
                </div>
                <div className="text-right text-[10px] text-muted-foreground font-mono">
                  ${(((newCpu * 6) + (newRam * 2) + (newStorage * 0.1)) / 720).toFixed(4)} / hour
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="glow" className="gap-2">
                  <Play className="h-4 w-4" />
                  Deploy Instantly
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* TERMINAL CONSOLE MODAL */}
      {activeTerminalServer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl p-0 bg-black border border-border/80 shadow-2xl relative overflow-hidden flex flex-col h-[500px]">
            {/* Terminal Header */}
            <div className="bg-muted px-4 py-3 flex items-center justify-between border-b border-border/40 select-none">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-3.5 w-3.5 rounded-full bg-red-500/30 flex items-center justify-center"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /></span>
                  <span className="h-3.5 w-3.5 rounded-full bg-yellow-500/30 flex items-center justify-center"><span className="h-1.5 w-1.5 rounded-full bg-yellow-500" /></span>
                  <span className="h-3.5 w-3.5 rounded-full bg-green-500/30 flex items-center justify-center"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /></span>
                </div>
                <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5 ml-3">
                  <Terminal className="h-4 w-4 text-purple-400" />
                  {activeTerminalServer.name} — root@aethershell:~
                </span>
              </div>
              <button 
                onClick={() => setActiveTerminalServer(null)}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Terminal Output Stream */}
            <div className="flex-1 p-6 font-mono text-xs overflow-y-auto terminal-scroll text-purple-200 bg-black select-text space-y-1.5">
              {terminalHistory.map((line, idx) => (
                <p key={idx} className="whitespace-pre-wrap leading-relaxed">{line}</p>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            {/* Terminal Input Bar */}
            <form onSubmit={handleTerminalSubmit} className="bg-black border-t border-border/40 px-4 py-3 flex items-center gap-2">
              <span className="font-mono text-xs text-purple-400 select-none">root@{activeTerminalServer.name}:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                autoFocus
                placeholder="type 'help'..."
                className="flex-1 bg-transparent border-0 outline-none text-xs font-mono text-foreground focus:ring-0 placeholder:text-muted-foreground/50"
              />
              <Button type="submit" variant="ghost" size="sm" className="h-7 text-xs font-mono text-muted-foreground hover:text-foreground">
                EXECUTE
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
