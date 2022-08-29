const express = require("express");
const cors = require("cors")
const { config } = require("dotenv")

const mongo = require("./mongodb");
const admin = require("./routers/admin.route");
const auth = require("./routers/auth.route");
const bookings = require("./routers/bookings.route");
const drivers = require("./routers/drivers.route");
const users = require("./routers/users.route")

const Tokenauth = require("./middleware")

//server connection
const PORT = process.env.PORT || 3001
const app = express();
config();

(async () => {
    try {
        await mongo.connect()

        //middlewares
        app.use(cors())
        app.use(express.json())   //parse req.body to json

        //routes
        app.get("/", (_, res) => res.send("Welcome to Anacab"));
        app.use("/api/auth", auth)
        app.use(Tokenauth)
        app.use("/api/admin", admin);
        app.use("/api/bookings", bookings);
        app.use("/api/drivers", drivers)
        app.use("/api/users", users)

        app.listen(PORT, () => console.log("Port-", PORT))
    } catch (err) {
        console.log(err.message)
        //process.exit()
    }
})()
