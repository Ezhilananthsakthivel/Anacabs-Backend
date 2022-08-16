const router = require("express").Router()
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
router.get("/didorders", async (req, res) => {
    try {
        let did = req.user.uname
        const data = await helper.didfind(did)
        res.send(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.put("/didput/:id", async (req, res) => {
    try {
        let _id = req.params.id
        let body = req.body
        let did = req.user.uname
        if (body.did === "") {
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
        if (body.status === "pending") {
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