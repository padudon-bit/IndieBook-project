import { useState, useEffect } from 'react'
import { supabase, Order } from '../lib/supabase'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  async function createOrder(
    orderData: {
      customer_name: string
      customer_email: string
      customer_phone: string
      total_amount: number
      slip_image: string
    },
    items: Array<{ book_id: string; price: number }>
  ) {
    try {
      // 1. Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        book_id: item.book_id,
        price: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      await fetchOrders()
      return { data: order, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to create order' }
    }
  }

  async function approveOrder(orderId: string) {
    try {
      // 1. Get order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError) throw orderError

      // 2. Get order items
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)

      if (itemsError) throw itemsError

      // 3. Update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', orderId)

      if (updateError) throw updateError

      // 4. Add purchased books
      const purchasedBooks = items.map(item => ({
        customer_email: order.customer_email,
        book_id: item.book_id,
        order_id: orderId
      }))

      const { error: purchasedError } = await supabase
        .from('purchased_books')
        .insert(purchasedBooks)

      if (purchasedError) throw purchasedError

      await fetchOrders()
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to approve order' }
    }
  }

  async function rejectOrder(orderId: string, reason: string) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) throw error

      await fetchOrders()
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to reject order' }
    }
  }

  async function getOrderItems(orderId: string) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          books (
            id,
            title,
            author,
            price,
            cover_image_url
          )
        `)
        .eq('order_id', orderId)

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch order items' }
    }
  }

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    approveOrder,
    rejectOrder,
    getOrderItems
  }
}

export function usePurchasedBooks(customerEmail: string) {
  const [purchasedBooks, setPurchasedBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (customerEmail) {
      fetchPurchasedBooks()
    }
  }, [customerEmail])

  async function fetchPurchasedBooks() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('purchased_books')
        .select(`
          *,
          books (
            id,
            title,
            author,
            description,
            category,
            price,
            file_url,
            cover_image_url
          )
        `)
        .eq('customer_email', customerEmail)
        .order('purchased_at', { ascending: false })

      if (error) throw error
      setPurchasedBooks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch purchased books')
    } finally {
      setLoading(false)
    }
  }

  return {
    purchasedBooks,
    loading,
    error,
    fetchPurchasedBooks
  }
}
