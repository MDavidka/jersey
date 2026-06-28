"use client"

import React, { useState } from 'react'
import { useCloudStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Key, Eye, EyeOff, RefreshCw, Check, ShieldAlert, Globe, Server } from 'lucide-react'

export default function SettingsPage() {
  const { user, regenerateApiKey } = useCloudStore()
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const handleCopyKey = () => {
    if (!user) return
    navigator.clipboard.writeText(user.apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerate = () => {
    setRegenerating(true)
    setTimeout(() => {
      regenerateApiKey()
      setRegenerating(false)
    }, 1000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Developer Configuration</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Manage your workspace API access keys, region preferences, and system preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: API Keys */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-card/40 border-border/40">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Key className="h-5 w-5 text-purple-400" />
                REST API Credentials
              </CardTitle>
              <CardDescription className="text-xs">Authenticate your Terraform, Ansible, or custom CLI scripts with AetherCloud</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* API Key Input display */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Live API Key</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={user?.apiKey || ''}
                      readOnly
                      className="w-full h-9 bg-background/50 border border-input rounded-md px-3 py-1 text-xs font-mono text-purple-300 focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-white"
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopyKey}
                    className="border-border/60 text-xs font-semibold"
                  >
                    {copied ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                        Copied
                      </span>
                    ) : (
                      'Copy Key'
                    )}
                  </Button>
                </div>
              </div>

              {/* Regenerate Trigger */}
              <div className="p-4 bg-purple-950/10 border border-purple-500/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4" />
                    Regenerate Credentials
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Instantly invalidate the current key and generate a new one. Any active scripts using the old key will fail immediately.
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="w-full sm:w-auto text-xs shrink-0"
                >
                  {regenerating ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin mr-1.5" />
                      Regenerating...
                    </>
                  ) : (
                    'Regenerate'
                  )}
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* Region preferences */}
          <Card className="bg-card/40 border-border/40">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-400" />
                Default Deployment Preferences
              </CardTitle>
              <CardDescription className="text-xs">Pre-configure resources for rapid server deployments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Default Region</label>
                  <select className="w-full bg-background/50 border border-input rounded-md p-2 text-xs focus:outline-none">
                    <option value="us-east">us-east (N. Virginia)</option>
                    <option value="eu-west">eu-west (Frankfurt)</option>
                    <option value="ap-southeast">ap-southeast (Singapore)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Default OS Image</label>
                  <select className="w-full bg-background/50 border border-input rounded-md p-2 text-xs focus:outline-none">
                    <option value="ubuntu">Ubuntu 22.04 LTS</option>
                    <option value="debian">Debian 12 Bookworm</option>
                    <option value="windows">Windows Server 2022</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Profile summary */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-card/40 border-border/40">
            <CardHeader>
              <CardTitle className="text-base font-bold">Profile Details</CardTitle>
              <CardDescription className="text-xs">Your workspace security metadata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-border/20 pb-2.5">
                <span className="text-muted-foreground">Primary Owner</span>
                <span className="text-white font-semibold">{user?.name}</span>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-2.5">
                <span className="text-muted-foreground">Security Email</span>
                <span className="text-white font-semibold">{user?.email}</span>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-2.5">
                <span className="text-muted-foreground">Two-Factor Auth</span>
                <Badge variant="success">Enabled (SMS/TOTP)</Badge>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground">Console Access</span>
                <span className="text-emerald-400 font-semibold font-mono">SSH Root Key Sync</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
