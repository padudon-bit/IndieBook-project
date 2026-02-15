import { Hono } from 'hono'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const uploadRoutes = new Hono()

uploadRoutes.post('/upload', async (c) => {
  try {
    const body = await c.req.parseBody()
    const file = body.file as File

    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }

    if (file.type !== 'application/pdf') {
      return c.json({ error: 'Only PDF files are allowed' }, 400)
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), '..', 'frontend', 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filepath = join(uploadsDir, filename)

    // Convert file to buffer and save
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await writeFile(filepath, buffer)

    // Generate book ID
    const bookId = timestamp.toString()

    return c.json({
      success: true,
      bookId,
      filename,
      fileUrl: `/uploads/${filename}`,
      size: file.size,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return c.json({ error: 'Failed to upload file' }, 500)
  }
})

export { uploadRoutes }
