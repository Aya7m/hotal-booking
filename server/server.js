import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connection_db } from './db/dbConnection.js'
import { clerkMiddleware } from '@clerk/express'
import { clerkWebHook } from './controller/clerkWebhook.js'


dotenv.config()

const app = express()
const port = process.env.PORT || 3000

connection_db()

app.use(cors())

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf
    },
  })
)

app.use(clerkMiddleware())

app.post('/api/clerk', clerkWebHook)

// ✅ 3. وبعدين clerkMiddleware
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`✅ Server running on port ${port}`))
