"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useCloudStore, Server } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Server as ServerIcon, Terminal, Play, Square, RefreshCw, Trash2, 
  Plus, X, HelpCircle, Cpu, Database, HardDrive, Globe, Info
} from 'lucide-react'

interface TerminalLine {
  text: string
  type: 'input' | 'output' | 'error' | 'success'
}

export default function ServersPanel() {
  const { servers, addServer, deleteServer, updateServerStatus, addLog } = useCloudStore()
  
  // Active selected server for terminal connection
  const [selectedServerId, setSelectedServerId] = useState<string>('srv-01')
  const activeServer = servers.find(s => s.id === selectedServerId) || servers[0]

  // Server Deployment Modal State
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false)
  const [newName, setNewName] = useState('web-node-04')
  const [newType, setNewType] = useState<'VPS' | 'Bare Metal'>('VPS')
  const [newCpu, setNewCpu] = useState(2)
  const [newRam, setNewRam] = useState(4)
  const [newStorage, setNewStorage] = useState(80)
  const [newRegion, setNewRegion] = useState('us-east (N. Virginia)')
  const [newOs, setNewOs] = useState('Ubuntu 22.04 LTS')

  // Interactive Terminal State
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { text: 'AetherSecure Shell v4.1.2-live', type: 'success' },
    { text: 'Connecting to host hypervisor backplane...', type: 'output' },
    { text: 'Established secure tunnel over TLS 1.3 AES-GCM-256.', type: 'success' },
    { text: 'Type "help" to list available command diagnostics.', type: 'output' }
  ])
  const terminalBottomRef = useRef<HTMLDivElement>(null)

  // Auto scroll terminal to bottom
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalLines])

  // Handle server selection change
  useEffect(() => {
    if (activeServer) {
      setTerminalLines([
        { text: `AetherSecure Shell v4.1.2-live connected to [${activeServer.name}]`, type: 'success' },
        { text: `IP Address: ${activeServer.ip} | OS: ${activeServer.os}`, type: 'output' },
        { text: activeServer.status === 'running' 
          ? 'Session status: ACTIVE (running)' 
          : 'Session status: OFFLINE (stopped). Start server to access shell.', 
          type: activeServer.status === 'running' ? 'success' : 'error' 
        },
        { text: 'Type "help" for a list of available commands.', type: 'output' }
      ])
    }
  }, [selectedServerId, activeServer?.status])

  // Terminal command handler
  const handleTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = terminalInput.trim().toLowerCase()
    if (!cmd) return

    const newLines: TerminalLine[] = [...terminalLines, { text: `root@${activeServer?.name || 'node'}:~$ ${terminalInput}`, type: 'input' }]

    if (!activeServer || activeServer.status !== 'running') {
      newLines.push({ text: 'Error: Cannot connect. Host virtual machine is offline/stopped.', type: 'error' })
      setTerminalLines(newLines)
      setTerminalInput('')
      return
    }

    // Process command
    const parts = cmd.split(' ')
    const baseCmd = parts[0]

    switch (baseCmd) {
      case 'help':
        newLines.push({ text: 'Available commands:', type: 'success' })
        newLines.push({ text: '  help       - Display list of diagnostic commands', type: 'output' })
        newLines.push({ text: '  neofetch   - Display system hardware specifications', type: 'output' })
        newLines.push({ text: '  top        - Display active virtual processes and CPU loads', type: 'output' })
        newLines.push({ text: '  df -h      - Check disk partitions and storage space', type: 'output' })
        newLines.push({ text: '  ping <ip>  - Ping network node address', type: 'output' })
        newLines.push({ text: '  uptime     - Display server uptime statistics', type: 'output' })
        newLines.push({ text: '  ls         - List files in current directory', type: 'output' })
        newLines.push({ text: '  cat <file> - Read contents of file', type: 'output' })
        newLines.push({ text: '  clear      - Clear terminal console history', type: 'output' })
        break

      case 'neofetch':
        newLines.push({
          text: `
   /\\       AetherCloud OS v4.12
  /  \\      Kernel: Linux 6.1.0-21-amd64
 / /\\ \\     Uptime: 14 days, 6 hours
/ /  \\ \\    Shell: bash 5.2.15
\\/____\\/    vCPU: AMD EPYC™ (${activeServer.cpu} Cores)
            RAM: ${activeServer.ram} GB DDR5 ECC
            Disk: NVMe RAID-10 (${activeServer.storage} GB)
            IP: ${activeServer.ip}
          `,
          type: 'output'
        })
        break

      case 'top':
        newLines.push({ text: 'PID   USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND', type: 'success' })
        newLines.push({ text: `1042  root      20   0  120.4g  42.5g  12.4g R  ${activeServer.cpuUsage}.0  ${activeServer.ramUsage}.0   2:12.42 nginx-gateway`, type: 'output' })
        newLines.push({ text: '1098  mysql     20   0   4.2g   2.1g   0.8g S   4.5  12.2   0:45.12 mysqld', type: 'output' })
        newLines.push({ text: '2105  node      20   0   1.8g   0.4g   0.2g S   1.2   5.4   0:12.05 server.js', type: 'output' })
        newLines.push({ text: '2412  root      20   0   0.4g   0.1g   0.1g S   0.0   1.0   0:00.41 sshd', type: 'output' })
        break

      case 'df':
        if (parts[1] === '-h') {
          newLines.push({ text: 'Filesystem      Size  Used Avail Use% Mounted on', type: 'success' })
          newLines.push({ text: `/dev/nvme0n1p1  ${activeServer.storage}G   24G  ${activeServer.storage - 24}G  18% /`, type: 'output' })
          newLines.push({ text: 'tmpfs           16G     0   16G   0% /dev/shm', type: 'output' })
        } else {
          newLines.push({ text: 'Usage: df -h', type: 'error' })
        }
        break

      case 'ping':
        const dest = parts[1] || '1.1.1.1'
        newLines.push({ text: `PING ${dest} (${dest}) 56(84) bytes of data.`, type: 'output' })
        newLines.push({ text: `64 bytes from ${dest}: icmp_seq=1 ttl=64 time=1.42 ms`, type: 'success' })
        newLines.push({ text: `64 bytes from ${dest}: icmp_seq=2 ttl=64 time=1.38 ms`, type: 'success' })
        newLines.push({ text: `64 bytes from ${dest}: icmp_seq=3 ttl=64 time=1.49 ms`, type: 'success' })
        newLines.push({ text: `--- ${dest} ping statistics ---`, type: 'output' })
        newLines.push({ text: '3 packets transmitted, 3 received, 0% packet loss, time 2003ms', type: 'output' })
        break

      case 'uptime':
        newLines.push({ text: ' 12:45:12 up 14 days,  6:12,  1 user,  load average: 0.12, 0.08, 0.05', type: 'output' })
        break

      case 'ls':
        newLines.push({ text: 'apps/  docker-compose.yml  logs/  nginx.conf  ssl/', type: 'success' })
        break

      case 'cat':
        if (parts[1] === 'docker-compose.yml') {
          newLines.push({
            text: `
version: '3.8'
services:
  web:
    image: node:18-alpine
    command: npm run start
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: always
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
          `,
            type: 'output'
          })
        } else if (parts[1]) {
          newLines.push({ text: `cat: ${parts[1]}: No such file or directory`, type: 'error' })
        } else {
          newLines.push({ text: 'Usage: cat <filename>', type: 'error' })
        }
        break

      case 'clear':
        setTerminalLines([{ text: 'Console terminal cleared.', type: 'output' }])
        setTerminalInput('')
        return

      default:
        newLines.push({ text: `bash: ${baseCmd}: command not found. Type "help" for a list of diagnostics.`, type: 'error' })
        break
    }

    setTerminalLines(newLines)
    setTerminalInput('')
  }

  // Handle server deployment action
  const handleDeployServer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName) return

    // Calculate cost
    const cost = Math.round((newCpu * 8) + (newRam * 2) + (newStorage * 0.1))

    addServer({
      name: newName,
      region: newRegion,
      type: newType,
      cpu: newCpu,
      ram: newRam,
      storage: newStorage,
      cost,
      os: newOs
    })

    setIsDeployModalOpen(false)
    // Select the newly created server
    setTimeout(() => {
      const lastSrv = servers[servers.length - 1]
      if (lastSrv) {
        setSelectedServerId(lastSrv.id)
      }
    }, 100)
  }

  return (
    <div className="space-y-8">
      
      {/* Header and trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Active Cloud Instances</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Deploy, configure, restart, or destroy virtual and bare metal nodes.</p>
        </div>
        <Button variant="glow" onClick={() => setIsDeployModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Deploy New Server
        </Button>
      </div>

      {/* Main Grid: Servers List + Terminal Shell */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Server list and controls */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Select Node to Connect</h3>
          
          <div className="space-y-3">
            {servers.map((srv) => {
              const isSelected = srv.id === selectedServerId
              return (
                <Card 
                  key={srv.id}
                  onClick={() => setSelectedServerId(srv.id)}
                  className={`cursor-pointer transition-all duration-300 border ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-950/10 shadow-lg' 
                      : 'border-border/40 hover:border-border bg-card/20 hover:bg-card/40'
                  }`}
                >
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`p-2 border rounded-xl shrink-0 ${
                        srv.status === 'running' 
                          ? 'bg-purple-500/15 border-purple-500/30 text-purple-400' 
                          : srv.status === 'stopped'
                          ? 'bg-muted/40 border-border text-muted-foreground'
                          : 'bg-amber-500/15 border-amber-500/30 text-amber-400 animate-pulse'
                      }`}>
                        <ServerIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm truncate">{srv.name}</h4>
                          <Badge 
                            variant={
                              srv.status === 'running' ? 'success' : 
                              srv.status === 'stopped' ? 'destructive' : 'warning'
                            }
                            className="text-[9px] py-0 px-1.5"
                          >
                            {srv.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate font-mono mt-0.5">{srv.ip} • {srv.region}</p>
                        <p className="text-[10px] text-purple-300 font-mono mt-1">
                          {srv.cpu} vCPUs • {srv.ram}GB RAM • {srv.storage}GB NVMe
                        </p>
                      </div>
                    </div>

                    {/* Power Controls */}
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {srv.status === 'running' ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => updateServerStatus(srv.id, 'stopped')}
                            className="h-8 w-8 text-rose-400 hover:bg-rose-500/10"
                            title="Stop Instance"
                          >
                            <Square className="h-4 w-4 fill-rose-400" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              updateServerStatus(srv.id, 'stopped')
                              setTimeout(() => updateServerStatus(srv.id, 'running'), 1500)
                            }}
                            className="h-8 w-8 text-purple-400 hover:bg-purple-500/10"
                            title="Reboot Instance"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </>
                      ) : srv.status === 'stopped' ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => updateServerStatus(srv.id, 'running')}
                            className="h-8 w-8 text-emerald-400 hover:bg-emerald-500/10"
                            title="Start Instance"
                          >
                            <Play className="h-4 w-4 fill-emerald-400" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteServer(srv.id)}
                            className="h-8 w-8 text-rose-500 hover:bg-rose-500/15"
                            title="Terminate Instance"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <RefreshCw className="h-4 w-4 animate-spin text-amber-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Right Side: Shell Console */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Terminal className="h-4 w-4 text-purple-400" />
              Secure Shell Terminal: {activeServer?.name}
            </h3>
            <Badge variant="outline" className="border-border/40 font-mono text-[10px]">
              {activeServer?.ip}
            </Badge>
          </div>

          <Card className="border-purple-500/20 bg-black/60 shadow-2xl relative overflow-hidden flex flex-col h-[400px]">
            {/* Terminal Header */}
            <div className="bg-muted/30 border-b border-border/40 px-4 py-2.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">root@{activeServer?.name || 'node'}: ~</span>
              <div className="w-12" />
            </div>

            {/* Terminal Screen */}
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 terminal-scroll bg-black/80">
              {terminalLines.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`leading-relaxed whitespace-pre-wrap ${
                    line.type === 'input' ? 'text-white font-semibold' :
                    line.type === 'error' ? 'text-rose-400' :
                    line.type === 'success' ? 'text-emerald-400 font-semibold' : 'text-purple-300'
                  }`}
                >
                  {line.text}
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            {/* Terminal Input Form */}
            <form onSubmit={handleTerminalCommand} className="border-t border-border/40 bg-black/90 p-3 flex shrink-0">
              <span className="font-mono text-xs text-purple-400 mr-2 shrink-0">root@{activeServer?.name || 'node'}:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                disabled={!activeServer || activeServer.status !== 'running'}
                className="flex-1 bg-transparent font-mono text-xs text-white focus:outline-none placeholder:text-muted-foreground/40"
                placeholder={activeServer?.status === 'running' ? 'Type "help" or terminal commands...' : 'Server is offline. Start server to use shell.'}
              />
            </form>
          </Card>
        </div>

      </div>

      {/* Deployment Modal */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <Card className="max-w-lg w-full border-purple-500/30 bg-card/95 shadow-2xl animate-accordion-down">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <ServerIcon className="h-5 w-5 text-purple-400" />
                  Deploy Virtual Instance
                </CardTitle>
                <CardDescription className="text-xs">Configure your virtual hypervisor resources</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDeployModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <form onSubmit={handleDeployServer}>
              <CardContent className="p-6 space-y-4">
                
                {/* Server Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Server Node Name</label>
                  <Input 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="web-app-gateway-01"
                    className="font-mono"
                    required
                  />
                </div>

                {/* Server Class */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Compute Class</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="VPS">VPS (AMD EPYC Shared)</option>
                      <option value="Bare Metal">Bare Metal (AMD Dedicated)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Operating System</label>
                    <select
                      value={newOs}
                      onChange={(e) => setNewOs(e.target.value)}
                      className="w-full bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="Ubuntu 22.04 LTS">Ubuntu 22.04 LTS</option>
                      <option value="Debian 12 Bookworm">Debian 12 Bookworm</option>
                      <option value="Rocky Linux 9">Rocky Linux 9</option>
                      <option value="Windows Server 2022">Windows Server 2022</option>
                    </select>
                  </div>
                </div>

                {/* Region */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Deployment Region</label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="us-east (N. Virginia)">us-east (N. Virginia)</option>
                    <option value="eu-west (Frankfurt)">eu-west (Frankfurt)</option>
                    <option value="ap-southeast (Singapore)">ap-southeast (Singapore)</option>
                    <option value="us-west (Oregon)">us-west (Oregon)</option>
                  </select>
                </div>

                {/* Resources Sliders */}
                <div className="grid grid-cols-3 gap-4 border-t border-border/40 pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                      <Cpu className="h-3 w-3 text-purple-400" /> CPU Cores
                    </label>
                    <select
                      value={newCpu}
                      onChange={(e) => setNewCpu(parseInt(e.target.value))}
                      className="w-full bg-background border border-input rounded-md p-1.5 text-xs font-mono"
                    >
                      <option value="1">1 Core</option>
                      <option value="2">2 Cores</option>
                      <option value="4">4 Cores</option>
                      <option value="8">8 Cores</option>
                      <option value="16">16 Cores</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                      <Database className="h-3 w-3 text-blue-400" /> RAM Size
                    </label>
                    <select
                      value={newRam}
                      onChange={(e) => setNewRam(parseInt(e.target.value))}
                      className="w-full bg-background border border-input rounded-md p-1.5 text-xs font-mono"
                    >
                      <option value="2">2 GB</option>
                      <option value="4">4 GB</option>
                      <option value="8">8 GB</option>
                      <option value="16">16 GB</option>
                      <option value="32">32 GB</option>
                      <option value="64">64 GB</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                      <HardDrive className="h-3 w-3 text-emerald-400" /> Storage
                    </label>
                    <select
                      value={newStorage}
                      onChange={(e) => setNewStorage(parseInt(e.target.value))}
                      className="w-full bg-background border border-input rounded-md p-1.5 text-xs font-mono"
                    >
                      <option value="20">20 GB</option>
                      <option value="40">40 GB</option>
                      <option value="80">80 GB</option>
                      <option value="160">160 GB</option>
                      <option value="320">320 GB</option>
                      <option value="640">640 GB</option>
                    </select>
                  </div>
                </div>

                {/* Estimate Cost */}
                <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Estimated Monthly Cost</span>
                    <span className="text-xl font-extrabold text-white font-mono">
                      ${Math.round((newCpu * 8) + (newRam * 2) + (newStorage * 0.1))}
                    </span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>
                  <Button type="submit" variant="glow" size="sm">
                    Provision Node
                  </Button>
                </div>

              </CardContent>
            </form>
          </Card>
        </div>
      )}

    </div>
  )
}
