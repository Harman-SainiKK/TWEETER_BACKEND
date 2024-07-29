const express = require("express")
const app = express()
const {UserRouter} = require("./routes/users")
const {tweetsRouter} = require("./routes/tweets")

const conn = require("./connection")
const usersModel = require("./models/users")
const tweetsModel = require("./models/tweets")
const likesModel = require("./models/likes")
const CommentsModel = require("./models/comments")
const cookieParser = require("cookie-parser")
const PORT = 8000

// middleware 
app.use(express.json())
app.use(cookieParser())

app.use("/users",UserRouter)
app.use("/tweets",tweetsRouter)

app.listen(PORT,()=>console.log("Server started at Port number : ",PORT))