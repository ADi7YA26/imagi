import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

const app = express()

dotenv.config({
  path: './.env'
})

const connectDB = (url) => {
  mongoose.set("strictQuery", true);

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Database connected"))
    .catch((error) => console.log(error));
};


app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json({limit: "16kb"}))


app.get('/', (req, res) => {
  res.send('ok')
})


app.listen(process.env.PORT || 8000, () => {
  connectDB()
  console.log(`Connected to backend on PORT: ${process.env.PORT || 8000}`)
})