import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { notFound,errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
const port = process.env.PORT || 5000
import userRoutes from './routes/userRoutes.js'
import cookieParser from 'cookie-parser'
import cors from "cors"; 


connectDB()

const app=express()

app.use(cors({
  origin: ["http://localhost:3000","https://url-shortener-nine-black.vercel.app"], 
  credentials: true,  
}));

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())
app.use(express.static('backend/public'));

app.use('/api/users',userRoutes)

app.get('/',(req,res)=>res.send('Server is ready'))
app.use(notFound)
app.use(errorHandler)

app.listen(port,()=>console.log("server started"))