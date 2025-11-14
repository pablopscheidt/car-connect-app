export type PublicVehicleCard = {
  id: string
  brand: string
  model: string
  version?: string | null
  yearFabrication: number
  yearModel: number
  fuel: string
  gearbox: string
  priceOnRequest: boolean
  price: number | null
  coverUrl: string | null
}

export type PublicVehicleListResponse = {
  items: PublicVehicleCard[]
  page: number
  pageSize: number
  total: number
}

export type GaragePublic = {
  name: string
  slug: string
  city?: string | null
  state?: string | null
  phoneWhatsapp?: string | null
  instagram?: string | null
  facebook?: string | null
  website?: string | null
  themePrimaryColor?: string | null
}

export type PublicVehicleDetail = {
  id: string
  brand: string
  model: string
  version?: string | null
  yearFabrication: number
  yearModel: number
  fuel: string
  gearbox: string
  color?: string | null
  description?: string | null
  priceOnRequest: boolean
  price: number | null
  images: Array<{ url: string; isCover: boolean }>
  garage: {
    name: string
    slug: string
    phoneWhatsapp?: string | null
    instagram?: string | null
    website?: string | null
  }
}
