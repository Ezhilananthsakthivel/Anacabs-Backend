const router = require("express").Router()
const bcrypt = require("bcrypt");
const helper = require("../helpers/drivers.helper")


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
router.get("/myprofile", async (req, res) => {
    let _id = req.user._id
    try {
        const data = await helper.findone(_id)
        res.send(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.get("/:id", async (req, res) => {
    try {
        const data = await helper.findbyid(req.params.id)
        res.send(data)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})
router.post("/register", async (req, res) => {
    try {
        if (req.user.role === "admin") {
            // Data Validation
            const driver = await helper.validateRegister(req.body);
            delete driver.cpassword
            // User Exists Validation
            const driverExists = await helper.findDriveruname(driver.uname);
            if (driverExists)
                return res.status(400).send({ error: "Driver already exists" });
            // Generate Password Hash
            const salt = await bcrypt.genSalt();
            driver.password = await bcrypt.hash(driver.password, salt);
            // Insert User
            const data = await helper.createdriver({ ...driver, role: "driver", active: true });
            res.send(data);
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}
);
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
router.put("/:id", async (req, res) => {
    try {
        if (req.user === "admin") {
            const data = await helper.updatebyid(req)
            res.send(data)
        }
    } catch (err) {
        res.status(500)
    }
})

module.exports = router