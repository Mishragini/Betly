import express from "express"
import cors from "cors"
import { PORT } from "./utils/config"
import userRouter from "./routes/user"
import cookieParser from "cookie-parser";


const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.json({ message: "Health check!!!" })
})

app.use("/user", userRouter)


app.listen(PORT, () => {
    console.log(`Api server on ${PORT}`)
})
