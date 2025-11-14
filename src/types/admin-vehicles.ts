export type AdminVehicleListItem = {
  id: string
  brand: string
  model: string
  version?: string | null
  yearFabrication: number
  yearModel: number
  status: string // ex: 'IN_STOCK', 'SOLD', etc.
  priceOnRequest: boolean
  price: number | null
  coverUrl?: string | null
  createdAt: string
}

export type AdminVehicleListResponse = {
  items: AdminVehicleListItem[]
  page: number
  pageSize: number
  total: number
}

export type AdminVehicleFormInput = {
  brand: string
  model: string
  version?: string | null
  yearFabrication: number
  yearModel: number
  fuel: string
  gearbox: string
  color?: string | null
  priceOnRequest: boolean
  price?: number | null
  status: string // ex.: 'IN_STOCK', 'SOLD'
  description?: string | null
}

export type AdminVehicleDetail = AdminVehicleFormInput & {
  id: string
  createdAt: string
  updatedAt: string
}
