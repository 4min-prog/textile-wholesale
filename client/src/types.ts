export interface Category {
  id: number
  name_tr: string
  name_en: string
  name_ar: string
  slug: string
  _count?: { products: number }
}

export interface Product {
  id: number
  name_tr: string
  name_en: string
  name_ar: string
  desc_tr: string
  desc_en: string
  desc_ar: string
  price: number
  min_order: number
  images: string[]
  is_active: boolean
  categoryId: number
  created_at: string
  category?: Category
}

export interface Banner {
  id: number
  image_url: string
  title_tr: string
  title_en: string
  title_ar: string
  is_active: boolean
}

export interface Message {
  id: number
  name: string
  email: string
  phone: string
  message: string
  is_read: boolean
  created_at: string
}

export interface Page {
  id: number
  slug: string
  content_tr: string
  content_en: string
  content_ar: string
}

export interface Admin {
  id: number
  email: string
}
