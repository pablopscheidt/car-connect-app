export type LeadVehicleSummary = {
  id: string
  brand: string
  model: string
  version?: string | null
  yearModel: number
}

export type LeadItem = {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  message?: string | null
  status: string
  createdAt: string
  vehicle?: LeadVehicleSummary | null
}

export type LeadListResponse = {
  items: LeadItem[]
  page: number
  pageSize: number
  total: number
}
