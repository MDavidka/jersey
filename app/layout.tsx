import type { Metadata } from 'next'
import '@/app/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'AetherCloud — Next-Gen Cloud & Bare Metal Hosting',
  description: 'Deploy ultra-low latency virtual servers, bare metal instances, and worldwide edge computing solutions in seconds.',
  keywords: 'vps, bare metal, cloud hosting, serverless, edge computing, ddos protection',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col selection:bg-purple-500/30 selection:text-purple-200">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
