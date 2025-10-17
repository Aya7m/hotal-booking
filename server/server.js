import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connection_db } from './db/dbConnection.js'
import { clerkMiddleware } from '@clerk/express'
import { clerkWebHook } from './controller/clerkWebhook.js'
import userRoute from './routes/userRoute.js'
import hotelRoute from './routes/hotelRoute.js'
import { cloudinartConfig } from './config/cloudinart.js'
import roomRouter from './routes/roomRouter.js'
import bookingRoute from './routes/bookingRoute.js'


dotenv.config()

const app = express()
const port = process.env.PORT || 3000

connection_db()
cloudinartConfig()

app.use(cors({
  origin: 'https://hotal-booking-frontend.vercel.app', // رابط الـ frontend على Vercel
  credentials: true
}));
app.use(express.json())

app.use(clerkMiddleware())

app.use('/api/clerk', clerkWebHook)

// ✅ 3. وبعدين clerkMiddleware
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api/user',userRoute)
app.use('/api/hotels',hotelRoute)
app.use('/api/rooms',roomRouter)
app.use('/api/booking',bookingRoute)

app.listen(port, () => console.log(`✅ Server running on port ${port}`))
