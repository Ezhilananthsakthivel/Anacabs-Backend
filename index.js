const express = require("express");
const cors = require("cors")
const { config } = require("dotenv")

const mongo = require("./mongodb");
const admin = require("./routers/admin.route");
const auth = require("./routers/auth.route");
const bookings = require("./routers/bookings.route");
const drivers = require("./routers/drivers.route");
const Tokenauth = require("./middleware")


//server connection
const app = express();
config();

(async () => {
    try {
        await mongo.connect()

        //middlewares
        app.use(cors())
        app.use(express.json())   //parse req.body to json

        //routes
        app.get("/", (_, res) => res.send("Welcome to Anacabs"));
        app.use("/api/auth", auth)
        app.post("/api/bookings", async (req, res) => {
            try {
                await mongo.bookings.insertOne({ ...req.body, did: "", status: "pending" })
                res.send("Booked")
            } catch (err) {
                res.status(500)
            }
        });
        app.use(Tokenauth)
        app.use("/api/admin", admin);
        app.use("/api/bookings", bookings);
        app.use("/api/drivers", drivers)

        app.listen(process.env.port, () => console.log("Port-", process.env.port))
    } catch (err) {
        console.log(err.message)
        //process.exit()
    }
})()
