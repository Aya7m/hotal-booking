import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connection_db } from './db/dbConnection.js'
import { clerkMiddleware } from '@clerk/express'
import { clerkWebHook } from './controller/clerkWebhook.js'
const app = express()
const port = 3000
dotenv.config()

connection_db()

app.use(cors())

app.use(express.json())

app.use(clerkMiddleware())
app.use('/api/clerk',clerkWebHook)


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))