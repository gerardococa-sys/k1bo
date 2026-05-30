export type UserRole = 'client' | 'professional' | 'admin'

export type QuoteStatus = 'pending' | 'responded' | 'accepted' | 'rejected'

export type AvailabilityStatus = 'available' | 'busy' | 'blocked'

export interface Country {
  id: string
  name: string
  code: string
  url_prefix: string
  currency_name: string
  currency_code: string
  currency_symbol: string
  flag_emoji: string
  active: boolean
  created_at: string
}

export interface Department {
  id: string
  country_id: string
  name: string
}

export interface Municipality {
  id: string
  department_id: string
  name: string
}

export interface District {
  id: string
  municipality_id: string
  name: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  icon: string | null
  order_index: number
  active: boolean
  created_at: string
  subcategories?: Category[]
}

export interface Profile {
  id: string
  country_id: string | null
  role: UserRole
  full_name: string | null
  photo_url: string | null
  phone: string | null
  date_of_birth: string | null
  address: string | null
  department_id: string | null
  municipality_id: string | null
  district_id: string | null
  verified: boolean
  active: boolean
  created_at: string
  country?: Country
  department?: Department
  municipality?: Municipality
  district?: District
}

export interface WorkingHours {
  lunes?: DayHours
  martes?: DayHours
  miercoles?: DayHours
  jueves?: DayHours
  viernes?: DayHours
  sabado?: DayHours
  domingo?: DayHours
}

export interface DayHours {
  open: boolean
  from: string
  to: string
}

export interface Professional {
  id: string
  bio: string | null
  short_description: string | null
  working_hours: WorkingHours | null
  whatsapp: string | null
  facebook_url: string | null
  instagram_url: string | null
  tiktok_url: string | null
  covers_entire_country: boolean
  featured: boolean
  dui_front_url: string | null
  dui_back_url: string | null
  total_projects: number
  profile?: Profile
  categories?: ProfessionalCategory[]
  coverage?: ProfessionalCoverage[]
  services?: ProfessionalService[]
  portfolio?: PortfolioPhoto[]
  faq?: ProfessionalFAQ[]
  avg_rating?: number
  total_reviews?: number
}

export interface ProfessionalCategory {
  id: string
  professional_id: string
  category_id: string
  projects_count: number
  category?: Category
}

export interface ProfessionalCoverage {
  id: string
  professional_id: string
  department_id: string
  municipality_id: string | null
  district_id: string | null
  department?: Department
  municipality?: Municipality
  district?: District
}

export interface ProfessionalService {
  id: string
  professional_id: string
  service_tag: string
}

export interface PortfolioPhoto {
  id: string
  professional_id: string
  photo_url: string
  caption: string | null
  order_index: number
  created_at: string
}

export interface ProfessionalFAQ {
  id: string
  professional_id: string
  question: string
  answer: string
  order_index: number
}

export interface Availability {
  id: string
  professional_id: string
  date: string
  status: AvailabilityStatus
}

export interface QuoteRequest {
  id: string
  country_id: string
  client_id: string
  professional_id: string
  category_id: string
  subcategory_id: string | null
  description: string
  required_date: string
  status: QuoteStatus
  created_at: string
  client?: Profile
  professional?: Professional
  category?: Category
  subcategory?: Category
  photos?: QuoteRequestPhoto[]
}

export interface QuoteRequestPhoto {
  id: string
  quote_request_id: string
  photo_url: string
}

export interface Review {
  id: string
  professional_id: string
  client_id: string
  quote_request_id: string
  category_id: string
  rating: number
  comment: string | null
  created_at: string
  client?: Profile
  category?: Category
}

export interface CountryContext {
  countryCode: string
  countryName: string
  currencyCode: string
  currencySymbol: string
  currencyName: string
  flagEmoji: string
  urlPrefix: string
  countryId: string
}

export type SortOption = 'rating' | 'projects'

export interface ProfessionalFilters {
  sort: SortOption
  verified: boolean
  department: string | null
}
