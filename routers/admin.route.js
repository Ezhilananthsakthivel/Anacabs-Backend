const router = require("express").Router()
const { ObjectId } = require("mongodb")
const db = require("../mongodb")

router.get("/", async (_, res) => {
    try {
        res.send(await db.admin.find().toArray())
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.get("/:id", async (req, res) => {
    try {
        res.send(await db.admin.findOne({ _id: ObjectId(req.params.id) }))
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

module.exports = router