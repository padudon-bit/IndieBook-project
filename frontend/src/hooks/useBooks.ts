import { useState, useEffect } from 'react'
import { supabase, Book } from '../lib/supabase'

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  async function fetchBooks() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setBooks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }

  async function addBook(book: Omit<Book, 'id' | 'uploaded_at' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([book])
        .select()
        .single()

      if (error) throw error

      // Refresh the books list
      await fetchBooks()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to add book' }
    }
  }

  async function deleteBook(id: string) {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Refresh the books list
      await fetchBooks()
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete book' }
    }
  }

  return {
    books,
    loading,
    error,
    fetchBooks,
    addBook,
    deleteBook
  }
}
