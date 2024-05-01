import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

import webhookRoute from "./routes/webhooks.routes.js"
import userRoute from "./routes/user.routes.js"
import imageRoute from "./routes/image.routes.js"

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


// middlewares 
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use("/api/webhooks", webhookRoute)
app.use("/api/user", userRoute)

app.use(express.json({limit: "16kb"}))

app.use("/api/images", imageRoute)


app.use((err, req, res, next)=>{
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: err.status,
    error: errorMessage
  })
})

app.listen(process.env.PORT || 8000, () => {
  connectDB()
  console.log(`Connected to backend on PORT: ${process.env.PORT || 8000}`)
})