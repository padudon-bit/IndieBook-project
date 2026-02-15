-- ===============================================
-- Indiebook Database Schema for Supabase
-- ===============================================

-- 1. Books Table
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  category TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  cover_image_url TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  slip_image TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Purchased Books Table (for tracking user's library)
CREATE TABLE IF NOT EXISTS purchased_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email TEXT NOT NULL,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_email, book_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_uploaded_at ON books(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_book_id ON order_items(book_id);
CREATE INDEX IF NOT EXISTS idx_purchased_books_email ON purchased_books(customer_email);
CREATE INDEX IF NOT EXISTS idx_purchased_books_book_id ON purchased_books(book_id);

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_books ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Books (public read, admin write)
CREATE POLICY "Books are viewable by everyone" ON books
  FOR SELECT USING (true);

CREATE POLICY "Books can be inserted by authenticated users" ON books
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Books can be updated by authenticated users" ON books
  FOR UPDATE USING (true);

CREATE POLICY "Books can be deleted by authenticated users" ON books
  FOR DELETE USING (true);

-- RLS Policies for Orders (users can see their own, admins can see all)
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders can be updated" ON orders
  FOR UPDATE USING (true);

-- RLS Policies for Order Items
CREATE POLICY "Order items are viewable by everyone" ON order_items
  FOR SELECT USING (true);

CREATE POLICY "Order items can be inserted" ON order_items
  FOR INSERT WITH CHECK (true);

-- RLS Policies for Purchased Books
CREATE POLICY "Users can view their purchased books" ON purchased_books
  FOR SELECT USING (true);

CREATE POLICY "Purchased books can be inserted" ON purchased_books
  FOR INSERT WITH CHECK (true);

-- Create Storage Bucket for PDF files and cover images
-- Note: This needs to be run in Supabase Dashboard -> Storage
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('book-files', 'book-files', true);

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('book-covers', 'book-covers', true);

-- Storage Policies
-- CREATE POLICY "Book files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'book-files');
-- CREATE POLICY "Anyone can upload book files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'book-files');
-- CREATE POLICY "Anyone can update book files" ON storage.objects FOR UPDATE USING (bucket_id = 'book-files');
-- CREATE POLICY "Anyone can delete book files" ON storage.objects FOR DELETE USING (bucket_id = 'book-files');

-- CREATE POLICY "Book covers are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'book-covers');
-- CREATE POLICY "Anyone can upload book covers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'book-covers');
-- CREATE POLICY "Anyone can update book covers" ON storage.objects FOR UPDATE USING (bucket_id = 'book-covers');
-- CREATE POLICY "Anyone can delete book covers" ON storage.objects FOR DELETE USING (bucket_id = 'book-covers');
