const router = require("express").Router()
const otpGenerator = require('otp-generator')
const fast2sms = require('fast-two-sms')
const helper = require("../helpers/bookings.helper")


router.get("/", async (req, res) => {
    try {
        if (req.user.role === "admin") {
            const data = await helper.find()
            res.send(data)
        }
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.get("/porders", async (req, res) => {
    try {
        if (req.user.role === "driver") {
            const data = await helper.porders()
            res.send(data)
        }
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.get("/ubookings", async (req, res) => {
    try {
        if (req.user.role === "user") {
            const data = await helper.ubookings(req.user.uname)
            res.send(data)
        }
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.get("/didorders", async (req, res) => {
    try {
        let did = req.user.uname
        const data = await helper.didfind(did)
        res.send(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.post("/driverorders", async (req, res) => {
    try {
        const data = await helper.driverorders(req.body.uname)
        res.send(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.post("/userorders", async (req, res) => {
    try {
        const data = await helper.userorders(req.body.uname)
        res.send(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.post("/otp", async (req, res) => {
    req.otp = null
    try {
        const otp = otpGenerator.generate(6, { numbers: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        //const options = { authorization: process.env.OTP_API_KEY, message: otp, numbers: [req.body.pnumber] }
        const data = await fast2sms.sendMessage({ authorization: process.env.OTP_API_KEY, message: otp, numbers: [req.body.pnumber] })
        req.otp = otp
        console.log(req.body.pnumber, req.otp, data)
        res.send(data)
    } catch (err) {
        res.send(err.message)
    }
})
router.post("/", async (req, res) => {
    try {
        const data = await helper.create(req)
        res.send("Booked")
    } catch (err) {
        res.status(500)
    }
});
router.put("/didput/:id", async (req, res) => {
    try {
        let _id = req.params.id
        let body = req.body
        let did = req.user.uname
        if (req.body.did === "" && req.user.role === "driver") {
            const data = await helper.didupdate({ _id, ...body, did })
            res.send(data)
        } else {
            throw new Error("This order is already accepted")
        }
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.put("/cupdate/:id", async (req, res) => {
    try {
        let _id = req.params.id
        let body = req.body
        if (body.status === "Accepted") {
            const data = await helper.cupdate({ _id, ...body })
            res.send(data)
        }
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.get("/:id", async (req, res) => {
    try {
        const data = await helper.findbyid(req.params.id)
        res.send(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.put("/:id", async (req, res) => {
    try {
        const { value } = await helper.update(req)
        res.send(value)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router