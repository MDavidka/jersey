"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCloudStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Server, LayoutDashboard, Terminal, CreditCard, Settings, 
  LogOut, Menu, X, ShieldAlert, ChevronRight, User, HelpCircle, ArrowLeft
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, generateMetricsFluctuation } = useCloudStore()
  const [mobileOpen, setMobileMenuOpen] = useState(false)

  // Periodically update server telemetry metrics to simulate a live server environment
  useEffect(() => {
    const interval = setInterval(() => {
      generateMetricsFluctuation()
    }, 4000)
    return () => clearInterval(interval)
  }, [generateMetricsFluctuation])

  // Guard: If not logged in, show a lock screen
  if (!user || !user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-md w-full border border-border bg-card/40 p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="mx-auto h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Session Required</h2>
            <p className="text-sm text-muted-foreground">
              You must be logged in to access the AetherCloud administration panel.
            </p>
          </div>
          <Link href="/login">
            <Button variant="glow" className="w-full gap-2">
              <User className="h-4 w-4" />
              Sign In to Sandbox
            </Button>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to homepage
          </Link>
        </div>
      </div>
    )
  }

  const sidebarLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Virtual Servers', href: '/dashboard/servers', icon: Terminal },
    { name: 'Billing & Invoices', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings & API Keys', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* MOBILE HEADER */}
      <header className="md:hidden flex h-16 items-center justify-between px-6 border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          <Server className="h-5 w-5 text-purple-500" />
          <span>AETHER<span className="font-light text-foreground">CONSOLE</span></span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileOpen)}
          className="p-2 text-muted-foreground hover:text-foreground focus:outline-none"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* SIDEBAR (DESKTOP) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border/60 bg-card/20 shrink-0 select-none">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">
            <Server className="h-5 w-5 text-purple-500" />
            <span>AETHER<span className="font-light text-foreground">CONSOLE</span></span>
          </Link>
        </div>

        {/* User Info Card */}
        <div className="px-4 py-5 border-b border-border/40">
          <div className="bg-card/60 border border-border/80 rounded-xl p-3.5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-sm text-white">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-foreground truncate">{user.name}</h4>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs px-1">
            <span className="text-muted-foreground">Sandbox Balance:</span>
            <span className="font-mono font-bold text-emerald-400">${user.balance.toFixed(2)}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link key={link.name} href={link.href}>
                <span className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/15 font-semibold' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/40 border border-transparent'
                }`}>
                  <Icon className="h-4.5 w-4.5" />
                  <span className="flex-1">{link.name}</span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-purple-400" />}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/40 space-y-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="w-full gap-2 text-xs border-border hover:bg-card/50">
              <ArrowLeft className="h-3.5 w-3.5" />
              Exit to Homepage
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout} 
            className="w-full gap-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 justify-start"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out Session
          </Button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR DRAWOUT */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background/95 flex flex-col pt-16 animate-accordion-down">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-foreground">{user.name}</h4>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-muted-foreground">Sandbox Balance:</span>
              <span className="font-mono font-bold text-emerald-400">${user.balance.toFixed(2)}</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                  <span className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                    isActive 
                      ? 'bg-purple-500/10 text-purple-400 font-semibold' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}>
                    <Icon className="h-5 w-5" />
                    <span>{link.name}</span>
                  </span>
                </Link>
              )
            })}
          </nav>
          <div className="p-6 border-t border-border space-y-3">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Exit to Homepage
              </Button>
            </Link>
            <Button variant="ghost" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full gap-2 text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
              Sign Out Session
            </Button>
          </div>
        </div>
      )}

      {/* DASHBOARD BODY */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-8 md:p-10 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}
