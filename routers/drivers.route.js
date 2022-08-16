const router = require("express").Router()
const { ObjectId } = require("mongodb")
const db = require("../mongodb")


router.get("/", async (_, res) => {
    try {
        res.send(await db.drivers.find().toArray())
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.get("/:id", async (req, res) => {
    try {
        res.send(await db.drivers.findOne({ _id: ObjectId(req.params.id) }))
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})
router.delete("/:id", async (req, res) => {
    try {
        if (req.user.role === "admin") {
            const data = await db.drivers.deleteOne({ _id: ObjectId(req.params.id) })
            res.send(data)
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})
router.put("/:id", async (req, res) => {
    try {
        if (req.user === "admin") {
            const data = await db.drivers.findOneAndUpdate(
                { _id: ObjectId(req.params.id) },
                { $set: req.body },
                { returnDocument: "after" })
            res.send(data)
        }
    } catch (err) {
        res.status(500)
    }
})

module.exports = router