# 🗄️ Database Migration Guide

## เปลี่ยนจาก localStorage เป็น Database จริง

---

## ตัวเลือก 1: Supabase (แนะนำ!)

### ทำไมถึงเลือก Supabase:
- ✅ PostgreSQL database ฟรี 500MB
- ✅ Authentication built-in
- ✅ Storage สำหรับไฟล์ (1GB ฟรี)
- ✅ Realtime subscriptions
- ✅ Dashboard UI สวยงาม
- ✅ REST API อัตโนมัติ

---

## ขั้นตอนการ Setup Supabase

### 1. สมัคร Supabase
1. ไปที่ https://supabase.com
2. Sign up (ฟรี)
3. สร้าง Project ใหม่ชื่อ "indiebook"
4. เลือก Region ใกล้ที่สุด (Singapore)
5. รอ ~2 นาที

### 2. สร้าง Tables

```sql
-- Books table
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  cover_image_url TEXT,
  pdf_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT,
  total_amount INTEGER NOT NULL,
  slip_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reject_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id),
  book_title TEXT NOT NULL,
  book_author TEXT NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchased books table
CREATE TABLE purchased_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  book_id UUID REFERENCES books(id),
  customer_email TEXT,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_books ENABLE ROW LEVEL SECURITY;

-- Public read for books
CREATE POLICY "Anyone can read books"
  ON books FOR SELECT
  USING (true);

-- Admin can insert/update/delete books
CREATE POLICY "Admin can manage books"
  ON books FOR ALL
  USING (auth.jwt() ->> 'email' = 'pad.udon@gmail.com');
```

### 3. ตั้งค่า Storage Bucket

```sql
-- สร้าง bucket สำหรับเก็บไฟล์
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-covers', 'book-covers', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('book-pdfs', 'book-pdfs', false);

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-slips', 'payment-slips', false);
```

### 4. ติดตั้ง Supabase Client

```bash
cd /workspace/indiebook/frontend
npm install @supabase/supabase-js
```

### 5. สร้าง Supabase Config

สร้างไฟล์ `frontend/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://YOUR_PROJECT.supabase.co'
const supabaseAnonKey = 'YOUR_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 6. สร้าง API Hooks

สร้างไฟล์ `frontend/src/hooks/useBooks.ts`:

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBooks()
  }, [])

  async function loadBooks() {
    setLoading(true)
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading books:', error)
    } else {
      setBooks(data || [])
    }
    setLoading(false)
  }

  async function addBook(book: any) {
    const { data, error } = await supabase
      .from('books')
      .insert([book])
      .select()
    
    if (error) throw error
    return data[0]
  }

  async function deleteBook(id: string) {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    await loadBooks()
  }

  return { books, loading, addBook, deleteBook, refresh: loadBooks }
}
```

### 7. อัพโหลดไฟล์ไป Storage

```typescript
// Upload cover image
async function uploadCover(file: File, bookId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${bookId}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('book-covers')
    .upload(fileName, file)
  
  if (error) throw error
  
  const { data: urlData } = supabase.storage
    .from('book-covers')
    .getPublicUrl(fileName)
  
  return urlData.publicUrl
}

// Upload PDF
async function uploadPDF(file: File, bookId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${bookId}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('book-pdfs')
    .upload(fileName, file)
  
  if (error) throw error
  
  return fileName
}
```

### 8. แก้ไข AdminUploadBookPage.tsx

```typescript
import { supabase } from '../lib/supabase'
import { useBooks } from '../hooks/useBooks'

// ใน handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!title || !author || !description || !price || !pdfFile || !coverImage) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
    return
  }

  setUploading(true)

  try {
    // 1. สร้าง book record
    const { data: book, error: bookError } = await supabase
      .from('books')
      .insert([{
        title,
        author,
        description,
        price: parseFloat(price),
        category
      }])
      .select()
      .single()

    if (bookError) throw bookError

    // 2. อัพโหลดรูปปก
    const coverUrl = await uploadCover(coverImage, book.id)

    // 3. อัพโหลด PDF
    const pdfFileName = await uploadPDF(pdfFile, book.id)

    // 4. อัพเดท book record
    await supabase
      .from('books')
      .update({
        cover_image_url: coverUrl,
        pdf_url: pdfFileName,
        file_name: pdfFile.name
      })
      .eq('id', book.id)

    alert(`✅ เพิ่มหนังสือ "${title}" เรียบร้อยแล้ว!`)
    onNavigate('admin')
  } catch (error) {
    console.error('Error:', error)
    alert('เกิดข้อผิดพลาด: ' + error.message)
  } finally {
    setUploading(false)
  }
}
```

---

## ตัวเลือก 2: Cloudflare D1 (เมื่อพร้อม)

ถ้า nxcode d1 ใช้งานได้:

```bash
# 1. สร้าง database
nxcode-d1 create indiebook-db

# 2. สร้าง schema
nxcode-d1 execute <database_id> --file schema.sql

# 3. เพิ่ม binding ใน wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "indiebook-db"
database_id = "xxx-xxx-xxx"
```

---

## เปรียบเทียบ

| Feature | localStorage | Supabase | D1 |
|---------|-------------|----------|-----|
| ฟรี | ✅ | ✅ (500MB) | ✅ |
| ข้อมูลถาวร | ❌ | ✅ | ✅ |
| แชร์ข้ามเครื่อง | ❌ | ✅ | ✅ |
| ไฟล์ขนาดใหญ่ | ❌ | ✅ | ✅ (with R2) |
| Authentication | ❌ | ✅ | ❌ |
| Realtime | ❌ | ✅ | ❌ |
| Setup ง่าย | ✅ | 🟡 | 🟡 |

---

## Next Steps

1. สมัคร Supabase
2. สร้าง Project
3. Run SQL schema
4. ติดตั้ง @supabase/supabase-js
5. แก้ไข code ใช้ Supabase
6. Test ทั้งระบบ
7. Deploy ใหม่

---

**หมายเหตุ:** การเปลี่ยนไป Database จริงจะทำให้:
- ✅ ข้อมูลไม่หาย
- ✅ ทุกคนเห็นข้อมูลเดียวกัน
- ✅ Admin อัพโหลดครั้งเดียว ทุกคนเห็น
- ✅ สามารถเก็บไฟล์ขนาดใหญ่ได้
