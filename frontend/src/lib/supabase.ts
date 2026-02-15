import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nlqrtwvluicyxowrtsyy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scXJ0d3ZsdWljeXhvd3J0c3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMTEyNzcsImV4cCI6MjA4NjY4NzI3N30.-rgpUvR1uv5nDdDthN6KG6PgP5APH4XTGF1q1Fq4Fuw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Book {
  id: string
  title: string
  author: string
  description: string
  price: number
  category: string
  file_name: string
  file_url: string
  cover_image_url: string | null
  uploaded_at: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  total_amount: number
  slip_image: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  book_id: string
  price: number
  created_at: string
}

export interface PurchasedBook {
  id: string
  customer_email: string
  book_id: string
  order_id: string
  purchased_at: string
}

// Helper function to upload file to Supabase Storage
export async function uploadFile(
  bucket: 'book-files' | 'book-covers',
  file: File,
  fileName: string
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return { url: null, error }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error) {
    return { url: null, error: error as Error }
  }
}

// Helper function to delete file from Supabase Storage
export async function deleteFile(
  bucket: 'book-files' | 'book-covers',
  fileName: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])

    return { error }
  } catch (error) {
    return { error: error as Error }
  }
}
