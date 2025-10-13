import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connection_db } from './db/dbConnection.js'
import { clerkMiddleware } from '@clerk/express'
import { clerkWebHook } from './controller/clerkWebhook.js'
import bodyParser from 'body-parser'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

connection_db()

app.use(cors())

// ✅ لازم نضيفها قبل express.json()
app.post('/api/clerk', bodyParser.raw({ type: 'application/json' }), clerkWebHook)

// ✅ بعدين نستخدم json لكل الـ routes العادية
app.use(express.json())

app.use(clerkMiddleware())

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`✅ Server running on port ${port}`))
