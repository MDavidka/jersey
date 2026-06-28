"use client"

import React, { useState } from 'react'
import { useCloudStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wallet, CreditCard, Plus, ArrowUpRight, History, CheckCircle2, RefreshCw } from 'lucide-react'

export default function BillingPage() {
  const { user, invoices, addFunds } = useCloudStore()
  const [selectedAmount, setSelectedAmount] = useState<number>(50)
  const [addingFunds, setAddingFunds] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)

  const handleAddFunds = () => {
    setAddingFunds(true)
    setTimeout(() => {
      addFunds(selectedAmount)
      setAddingFunds(false)
      setSuccessMsg(true)
      setTimeout(() => setSuccessMsg(false), 3000)
    }, 1200)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Billing & Ledger</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Manage your account funds, view invoices, and configure automated compute statements.</p>
      </div>

      {/* Top Ledger Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Wallet Balance & Add Funds */}
        <Card className="lg:col-span-7 bg-card/40 border-border/40">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Wallet className="h-5 w-5 text-purple-400" />
              Prepaid Account Balance
            </CardTitle>
            <CardDescription className="text-xs">Your virtual server resources are billed hourly against this wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Balance display */}
            <div className="p-6 bg-purple-950/20 border border-purple-500/20 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-purple-300 uppercase font-semibold">Available Funds</span>
                <div className="text-4xl font-extrabold text-white font-mono mt-1">${user?.balance.toFixed(2)}</div>
                <span className="text-[10px] text-muted-foreground">Billed hourly based on active nodes</span>
              </div>
              <Badge variant="success" className="text-xs px-3 py-1">Active</Badge>
            </div>

            {/* Simulated Add Funds form */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Up Wallet (Sandbox Simulation)</h4>
              
              {successMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Successfully added ${selectedAmount.toFixed(2)} to your balance!
                </div>
              )}

              <div className="grid grid-cols-4 gap-3">
                {[10, 25, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-3 rounded-lg border text-sm font-semibold font-mono transition-all ${
                      selectedAmount === amt
                        ? 'border-purple-500 bg-purple-500/15 text-white'
                        : 'border-border/60 hover:bg-muted/30 text-muted-foreground'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <Button 
                onClick={handleAddFunds} 
                disabled={addingFunds}
                variant="glow" 
                className="w-full gap-2"
              >
                {addingFunds ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing Sandbox Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Simulate Payment of ${selectedAmount.toFixed(2)}
                  </>
                )}
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* Right: Plan details & details */}
        <Card className="lg:col-span-5 bg-card/40 border-border/40 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold">Active Account Profile</CardTitle>
            <CardDescription className="text-xs">Your current platform classification and limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between border-b border-border/20 pb-2.5">
                <span className="text-muted-foreground">Account Classification</span>
                <strong className="text-white">{user?.activePlan}</strong>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-2.5">
                <span className="text-muted-foreground">Virtual Core Limit</span>
                <strong className="text-white">64 vCPU Cores</strong>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-2.5">
                <span className="text-muted-foreground">Network Bandwidth Cap</span>
                <strong className="text-white">50 TB / mo</strong>
              </div>
              <div className="flex justify-between pb-1.5">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="flex items-center gap-1.5 text-white">
                  <CreditCard className="h-4 w-4 text-purple-400" />
                  •••• 4242 (Simulated)
                </span>
              </div>
            </div>

            <div className="p-4 bg-muted/20 border border-border/40 rounded-xl text-xs text-muted-foreground leading-relaxed mt-4">
              ℹ <strong>Hourly Billing Notice</strong>: Active virtual servers are computed hourly. To stop incurring charges, please terminate or stop the server instance from the Servers & Panel tab.
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Invoice History Table */}
      <Card className="bg-card/40 border-border/40">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <History className="h-5 w-5 text-purple-400" />
            Invoice Ledger
          </CardTitle>
          <CardDescription className="text-xs">Historical statements and payment records</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4">Invoice ID</th>
                  <th className="p-4">Billing Date</th>
                  <th className="p-4">Amount Charged</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-muted-foreground">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">{inv.id}</td>
                    <td className="p-4">{inv.date}</td>
                    <td className="p-4 font-mono text-white">${inv.amount.toFixed(2)}</td>
                    <td className="p-4">
                      <Badge variant={inv.status === 'paid' ? 'success' : 'warning'}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="link" className="text-xs text-purple-400 hover:text-purple-300 h-auto p-0">
                        View Statement
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Button>
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
