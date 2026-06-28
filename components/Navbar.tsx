"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCloudStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Server, User, LogOut, Terminal, Menu, X, Shield, Globe, Cpu } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useCloudStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Don't show public Navbar on dashboard pages
  const isDashboard = pathname?.startsWith('/dashboard')

  if (isDashboard) return null

  const navLinks = [
    { name: 'Features', href: '/features', icon: Shield },
    { name: 'Pricing', href: '/pricing', icon: Cpu },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">
            <Server className="h-6 w-6 text-purple-500" />
            <span>AETHER<span className="font-light text-foreground">CLOUD</span></span>
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-foreground/100 ${
                  isActive ? 'text-purple-400 font-semibold' : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user && user.isLoggedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2 border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-950/20">
                  <Terminal className="h-4 w-4 text-purple-400" />
                  Console Panel
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="glow" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-4 space-y-3 animate-accordion-down">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-border pt-3 space-y-2">
            {user && user.isLoggedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button className="w-full gap-2" variant="outline">
                    <Terminal className="h-4 w-4" />
                    Console Panel
                  </Button>
                </Link>
                <Button className="w-full gap-2" variant="ghost" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button className="w-full" variant="ghost">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button className="w-full" variant="glow">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
