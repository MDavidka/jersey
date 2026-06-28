"use client"

import React, { useState } from 'react'
import { useCloudStore } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, Key, Eye, EyeOff, Copy, Check, 
  User, Shield, Globe, RefreshCw, Terminal
} from 'lucide-react'

export default function SettingsPage() {
  const { user, regenerateApiKey } = useCloudStore()
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  // Profile inputs (dummy)
  const [profileName, setProfileName] = useState(user?.name || '')
  const [profileEmail, setProfileEmail] = useState(user?.email || '')
  
  // Toggles
  const [mfa, setMfa] = useState(true)
  const [apiAccess, setApiAccess] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)

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
      {/* HEADER */}
      <div className="border-b border-border/40 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Developer Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure profile details, manage security preferences, and generate API credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PROFILE & SECURITY */}
        <div className="lg:col-span-7 space-y-6">
          {/* Profile Card */}
          <Card className="p-6 bg-card/40 border border-border/60">
            <div className="flex items-center gap-2 border-b border-border/40 pb-4 mb-6">
              <User className="h-4.5 w-4.5 text-purple-400" />
              <h3 className="font-bold text-foreground text-sm sm:text-base">Sandbox Profile</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                <Input 
                  type="text" 
                  value={profileName} 
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                <Input 
                  type="email" 
                  value={profileEmail} 
                  onChange={(e) => setProfileEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="outline" size="sm" className="border-border hover:bg-card/50 text-xs font-semibold">
                Save Profile Changes
              </Button>
            </div>
          </Card>

          {/* Security Card */}
          <Card className="p-6 bg-card/40 border border-border/60">
            <div className="flex items-center gap-2 border-b border-border/40 pb-4 mb-6">
              <Shield className="h-4.5 w-4.5 text-purple-400" />
              <h3 className="font-bold text-foreground text-sm sm:text-base">Security & Authentication</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-border/40">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Multi-Factor Authentication (MFA)</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Require an OTP token alongside your password.</p>
                </div>
                <Switch checked={mfa} onCheckedChange={setMfa} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-border/40">
                <div>
                  <h4 className="text-xs font-bold text-foreground">REST API Gateway Access</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Enable programatic operations via live credentials.</p>
                </div>
                <Switch checked={apiAccess} onCheckedChange={setApiAccess} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-border/40">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Email Telemetry Alerts</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Receive digests when CPU load exceeds 90% SLA.</p>
                </div>
                <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>
            </div>
          </Card>
        </div>

        {/* API CREDENTIALS */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 bg-card/40 border border-border/60 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/40 pb-4">
                <Key className="h-4.5 w-4.5 text-purple-400" />
                <h3 className="font-bold text-foreground text-sm sm:text-base">API Credentials</h3>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Authenticate automation scripts, Terraform providers, or command-line clients. Keep this key strictly confidential.
              </p>

              {/* API Key Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Active Live Token</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input 
                      type={showKey ? 'text' : 'password'} 
                      value={user?.apiKey || ''} 
                      readOnly 
                      className="font-mono text-xs pr-9 bg-black/30 border-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCopyKey}
                    title="Copy Key"
                    className="border-border hover:bg-card/50"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {copied && (
                <span className="text-[10px] font-mono text-emerald-400 font-semibold block text-right">
                  Copied live credential!
                </span>
              )}
            </div>

            <div className="space-y-3 pt-6 border-t border-border/40 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleRegenerate}
                disabled={regenerating}
                className="w-full gap-2 border-border hover:bg-card/50 text-xs font-semibold"
              >
                <RefreshCw className={`h-4.5 w-4.5 ${regenerating ? 'animate-spin' : ''}`} />
                {regenerating ? 'Revoking & Generating...' : 'Regenerate API Key'}
              </Button>
              <p className="text-[9px] text-muted-foreground text-center leading-normal">
                Regenerating will instantly revoke the existing key. Any active CI/CD scripts using the old key will fail.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
