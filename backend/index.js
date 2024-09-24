require("dotenv").config()

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const cookieparser = require("cookie-parser")

const { authentication } = require("./middlewares/middlewares")

const corsOptions = {
    origin: process.env.frontend_url,
    credentials: true
};

app.use(cors(corsOptions));


//connecting to db.
const establish_connection = require("./connection")
const connection_string = process.env.Mongo_URL
try { establish_connection(connection_string).then(() => { console.log("Connection with DB established.") }) }
catch (err) { console.log(" DB conection error : " + err.message) }

//middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieparser())
app.use(authentication)
// app.use(cors())

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server started at Port ${port}.`)
})

app.get("/", (req, res) => {
    res.send("<h1 style='color:green'>Server is up and running</h1>")
})


//SignIn and SignUp Routes.
const Auth = require("./routes/user")
app.use("/user", Auth)

//Short URL Routes
const S_URL = require("./routes/s_url")
const { authorize } = require("./middlewares/middlewares")
app.use("/s_url", authorize(["User", "Admin"]), S_URL)

//Short URL Redirection to Original URL
const shorturl = require("./routes/shorturl")
app.use("/", shorturl)