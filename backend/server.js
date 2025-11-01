import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js'
import notesRoutes from './routes/notes.js'

dotenv.config();

const PORT = process.env.PORT

const app = express();

app.use(express.json());

app.use("/api/users", authRoutes)
app.use("/api/notes", notesRoutes)

app.get("/", (req,res)=>{
    res.send("HELLO WORLD, abe chk")
})

connectDB()

app.listen(PORT, ()=> {
    console.log(`server starter at port http://localhost:${PORT}/`)
})