// This file will be regenerated when modules are added
// Run: nxcode generate

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { exampleRoutes } from './routes/example'
import { uploadRoutes } from './routes/upload'

type Bindings = {
  DB?: D1Database
  CACHE?: KVNamespace
  STORAGE?: R2Bucket
  ENVIRONMENT: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

// Health check (outside /api for infrastructure probes)
app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }))

// API Routes
app.route('/api', exampleRoutes)
app.route('/api', uploadRoutes)

export default app
