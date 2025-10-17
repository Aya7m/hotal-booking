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


app.use(express.json())

const allowedOrigins = [
  'https://hotal-booking-frontend.vercel.app', // production frontend
  'http://localhost:5173',                     // local dev
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // السماح للطلبات بدون origin مثل Postman
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error('CORS not allowed for this origin'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.options('/api/*', cors());



// app.use(clerkMiddleware())

app.use('/api/clerk', clerkWebHook)

// ✅ 3. وبعدين clerkMiddleware
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api/user',userRoute)
app.use('/api/hotels',hotelRoute)
app.use('/api/rooms',roomRouter)
app.use('/api/booking',bookingRoute)

app.listen(port, () => console.log(`✅ Server running on port ${port}`))
