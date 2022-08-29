const router = require("express").Router()
const helper = require("../helpers/users.helper")

router.get("/", async (_, res) => {
    try {
        const data = await helper.find()
        res.send(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.get("/myprofile", async (req, res) => {
    let _id = req.user._id
    try {
        const data = await helper.findone(_id)
        res.send(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.delete("/:id", async (req, res) => {
    try {
        if (req.user.role === "admin") {
            const data = await helper.remove(req.params.id)
            res.send(data)
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

module.exports = router