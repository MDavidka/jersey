import { create } from 'zustand'

export interface Server {
  id: string
  name: string
  ip: string
  status: 'running' | 'stopped' | 'provisioning'
  region: string
  type: 'VPS' | 'Bare Metal' | 'Serverless'
  cpu: number // cores
  ram: number // GB
  storage: number // GB
  cost: number // USD/mo
  cpuUsage: number // %
  ramUsage: number // %
  bandwidthUsage: number // GB used
  os: string
  created: string
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending'
}

export interface User {
  name: string
  email: string
  isLoggedIn: boolean
  balance: number
  activePlan: string
  apiKey: string
}

interface CloudStore {
  user: User | null
  servers: Server[]
  invoices: Invoice[]
  logs: string[]
  login: (email: string) => Promise<boolean>
  logout: () => void
  addServer: (server: Omit<Server, 'id' | 'ip' | 'status' | 'cpuUsage' | 'ramUsage' | 'bandwidthUsage' | 'created'>) => void
  deleteServer: (id: string) => void
  updateServerStatus: (id: string, status: Server['status']) => void
  addLog: (message: string) => void
  generateMetricsFluctuation: () => void
  regenerateApiKey: () => void
  addFunds: (amount: number) => void
}

const INITIAL_SERVERS: Server[] = [
  {
    id: 'srv-01',
    name: 'production-api-gateway',
    ip: '142.250.190.46',
    status: 'running',
    region: 'us-east (N. Virginia)',
    type: 'VPS',
    cpu: 4,
    ram: 8,
    storage: 160,
    cost: 40,
    cpuUsage: 34,
    ramUsage: 62,
    bandwidthUsage: 412.5,
    os: 'Ubuntu 22.04 LTS',
    created: '2024-01-15'
  },
  {
    id: 'srv-02',
    name: 'db-primary-replica',
    ip: '172.217.16.142',
    status: 'running',
    region: 'eu-west (Frankfurt)',
    type: 'Bare Metal',
    cpu: 16,
    ram: 64,
    storage: 1024,
    cost: 180,
    cpuUsage: 12,
    ramUsage: 45,
    bandwidthUsage: 1205.8,
    os: 'Debian 12 Bookworm',
    created: '2024-02-10'
  },
  {
    id: 'srv-03',
    name: 'k8s-worker-01',
    ip: '216.58.214.14',
    status: 'stopped',
    region: 'ap-southeast (Singapore)',
    type: 'VPS',
    cpu: 8,
    ram: 16,
    storage: 320,
    cost: 80,
    cpuUsage: 0,
    ramUsage: 0,
    bandwidthUsage: 890.1,
    os: 'Rocky Linux 9',
    created: '2024-03-01'
  }
]

const INITIAL_INVOICES: Invoice[] = [
  { id: 'INV-2024-001', date: '2024-01-01', amount: 300.00, status: 'paid' },
  { id: 'INV-2024-002', date: '2024-02-01', amount: 300.00, status: 'paid' },
  { id: 'INV-2024-003', date: '2024-03-01', amount: 300.00, status: 'paid' },
  { id: 'INV-2024-004', date: '2024-04-01', amount: 300.00, status: 'paid' },
  { id: 'INV-2024-005', date: '2024-05-01', amount: 300.00, status: 'pending' },
]

export const useCloudStore = create<CloudStore>((set, get) => ({
  user: {
    name: 'Alex Mercer',
    email: 'alex.mercer@aethercloud.io',
    isLoggedIn: true, // Default to logged in for direct flow, but login screen controls it
    balance: 245.50,
    activePlan: 'Enterprise Tier',
    apiKey: 'ae_live_8f3c9d1a7b5e4c2d6e0f1a3b5c7d9e2f'
  },
  servers: INITIAL_SERVERS,
  invoices: INITIAL_INVOICES,
  logs: [
    'System: Account environment loaded successfully.',
    'Security: SSH keys synchronized across 3 regions.',
    'Billing: Automatic monthly invoice INV-2024-004 paid.'
  ],

  login: async (email: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const name = email.split('@')[0]
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1)
    
    set({
      user: {
        name: formattedName || 'Aether Cloud User',
        email,
        isLoggedIn: true,
        balance: 100.00,
        activePlan: 'Developer Pro',
        apiKey: 'ae_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      },
      logs: [
        `Auth: User logged in from IP 192.168.1.1`,
        `System: Initialized server panel for ${email}`
      ]
    })
    return true
  },

  logout: () => {
    set({ user: null })
  },

  addServer: (serverData) => {
    const randomIp = Array.from({ length: 4 }, () => Math.floor(Math.random() * 254) + 1).join('.')
    const newId = `srv-${Math.random().toString(36).substring(2, 7)}`
    const newServer: Server = {
      ...serverData,
      id: newId,
      ip: randomIp,
      status: 'provisioning',
      cpuUsage: 0,
      ramUsage: 0,
      bandwidthUsage: 0,
      created: new Date().toISOString().split('T')[0]
    }

    set((state) => ({
      servers: [...state.servers, newServer],
      logs: [
        ...state.logs,
        `System: Provisioning new ${serverData.type} server "${serverData.name}" in ${serverData.region}...`
      ]
    }))

    // Simulate server becoming active after 5 seconds
    setTimeout(() => {
      set((state) => {
        const updated = state.servers.map((s) => {
          if (s.id === newId) {
            return {
              ...s,
              status: 'running' as const,
              cpuUsage: 15,
              ramUsage: 25
            }
          }
          return s
        })
        return {
          servers: updated,
          logs: [...state.logs, `System: Server "${serverData.name}" is now RUNNING. IP assigned: ${randomIp}`]
        }
      })
    }, 5000)
  },

  deleteServer: (id) => {
    const server = get().servers.find((s) => s.id === id)
    if (!server) return

    set((state) => ({
      servers: state.servers.filter((s) => s.id !== id),
      logs: [...state.logs, `System: Server "${server.name}" (${server.ip}) terminated and decommissioned.`]
    }))
  },

  updateServerStatus: (id, status) => {
    const server = get().servers.find((s) => s.id === id)
    if (!server) return

    set((state) => {
      const updated = state.servers.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status,
            cpuUsage: status === 'running' ? 12 : 0,
            ramUsage: status === 'running' ? 20 : 0
          }
        }
        return s
      })
      return {
        servers: updated,
        logs: [...state.logs, `Action: Server "${server.name}" status changed to ${status.toUpperCase()}.`]
      }
    })
  },

  addLog: (message) => {
    set((state) => ({
      logs: [...state.logs, message]
    }))
  },

  generateMetricsFluctuation: () => {
    set((state) => {
      const updated = state.servers.map((s) => {
        if (s.status !== 'running') return s
        // Slight changes
        const cpuChange = (Math.random() - 0.5) * 10
        const ramChange = (Math.random() - 0.5) * 4
        const bwIncrease = Math.random() * 0.8

        const nextCpu = Math.max(5, Math.min(95, Math.round(s.cpuUsage + cpuChange)))
        const nextRam = Math.max(10, Math.min(90, Math.round(s.ramUsage + ramChange)))
        const nextBw = parseFloat((s.bandwidthUsage + bwIncrease).toFixed(1))

        return {
          ...s,
          cpuUsage: nextCpu,
          ramUsage: nextRam,
          bandwidthUsage: nextBw
        }
      })
      return { servers: updated }
    })
  },

  regenerateApiKey: () => {
    set((state) => {
      if (!state.user) return {}
      const newKey = 'ae_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      return {
        user: { ...state.user, apiKey: newKey },
        logs: [...state.logs, 'Security: API key regenerated successfully.']
      }
    })
  },

  addFunds: (amount) => {
    set((state) => {
      if (!state.user) return {}
      return {
        user: { ...state.user, balance: state.user.balance + amount },
        logs: [...state.logs, `Billing: Added $${amount.toFixed(2)} to account balance.`]
      }
    })
  }
}))
