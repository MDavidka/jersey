"use client"

import React, { useState } from 'react'
import { useCloudStore, Server } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  CreditCard, DollarSign, Download, Plus, CheckCircle2, 
  Calendar, FileText, AlertCircle, Sparkles, TrendingUp, RefreshCw
} from 'lucide-react'

export default function BillingPage() {
  const { user, invoices, addFunds, servers } = useCloudStore()
  const [topUpAmount, setTopUpAmount] = useState('25')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  
  // Calculate total monthly burn rate with explicit types
  const monthlyBurn = Number.parseFloat(
    servers.reduce((acc: number, s: Server) => acc + s.cost, 0).toFixed(2)
  )

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(topUpAmount)
    if (Number.isNaN(amount) || amount <= 0) return
    addFunds(amount)
    setTopUpAmount('25')
  }

  const simulateDownload = (id: string) => {
    setDownloadingId(id)
    window.setTimeout(() => {
      setDownloadingId(null)
      if (typeof window !== 'undefined') {
        window.alert(`Invoice ${id} downloaded successfully as PDF.`)
      }
    }, 1200)
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="border-b border-border/40 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Billing & Invoices</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your sandbox trial credits, active burn rate, and download past receipts.
        </p>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance */}
        <Card className="p-6 bg-card/40 border border-border/60 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Available Sandbox Balance</span>
            <div className="text-4xl font-extrabold text-emerald-400 font-mono">${user?.balance.toFixed(2)}</div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg w-fit">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Credits active | Never expires</span>
          </div>
        </Card>

        {/* Burn Rate */}
        <Card className="p-6 bg-card/40 border border-border/60 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Estimated Monthly Burn</span>
            <div className="text-4xl font-extrabold text-foreground font-mono">${monthlyBurn.toFixed(2)}</div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-3 py-2 rounded-lg w-fit">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <span>${(monthlyBurn / 720).toFixed(4)} / hour cluster cost</span>
          </div>
        </Card>

        {/* Top Up Credits Form */}
        <Card className="p-6 bg-card/40 border border-border/60">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block mb-3">Add Sandbox Credits</span>
          <form onSubmit={handleTopUp} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-semibold font-mono">$</span>
                <Input 
                  type="number" 
                  min="5" 
                  max="1000" 
                  value={topUpAmount} 
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="pl-7 h-9 font-mono text-xs"
                />
              </div>
              <Button type="submit" variant="glow" size="sm" className="gap-1 px-4">
                <Plus className="h-4 w-4" />
                Add Credits
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal">
              Enter any amount between $5 and $1000. Simulated trial credits will be added to your balance instantly.
            </p>
          </form>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INVOICES LIST */}
        <Card className="lg:col-span-8 p-6 bg-card/40 border border-border/60">
          <div className="flex items-center gap-2 border-b border-border/40 pb-4 mb-6">
            <FileText className="h-4.5 w-4.5 text-purple-400" />
            <h3 className="font-bold text-foreground text-sm sm:text-base">Past Invoices & Receipts</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left font-mono">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-3 px-4 font-semibold">Invoice ID</th>
                  <th className="py-3 px-4 font-semibold">Billing Date</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-card/20 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">{inv.id}</td>
                    <td className="py-3.5 px-4 text-muted-foreground text-xs flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {inv.date}
                    </td>
                    <td className="py-3.5 px-4 text-foreground font-bold">${inv.amount.toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={inv.status === 'paid' ? 'success' : 'warning'} className="text-[10px] uppercase font-bold">
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => simulateDownload(inv.id)}
                        disabled={downloadingId === inv.id}
                        className="h-8 border-border hover:bg-card/60 gap-1.5 text-xs font-semibold"
                      >
                        {downloadingId === inv.id ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            <span>PDF...</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-3 w-3" />
                            <span>PDF</span>
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* PAYMENT METHOD */}
        <Card className="lg:col-span-4 p-6 bg-card/40 border border-border/60 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border/40 pb-4">
              <CreditCard className="h-4.5 w-4.5 text-purple-400" />
              <h3 className="font-bold text-foreground text-sm sm:text-base">Payment Method</h3>
            </div>

            <div className="bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-black border border-purple-500/20 rounded-xl p-5 relative overflow-hidden text-white h-44 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md border border-white/15">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-400 animate-pulse" />
                  <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono">Sandbox Visa</span>
                </div>
                <span className="text-xs font-mono font-bold tracking-widest text-white/50">AETHER CLOUD</span>
              </div>

              <div className="space-y-1">
                <div className="text-base font-mono font-bold tracking-widest">•••• •••• •••• 4112</div>
                <div className="flex justify-between items-center text-[10px] text-white/60 font-mono">
                  <span>HOLDER: {user?.name.toUpperCase()}</span>
                  <span>EXP: 12/28</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex gap-2.5 text-xs text-amber-400 mt-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>This is a simulated cloud environment. Real credit cards are not required and no real billing occurs.</p>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-6 border-border hover:bg-card/50 text-xs font-semibold">
            Update Payment Details
          </Button>
        </Card>
      </div>
    </div>
  )
}
