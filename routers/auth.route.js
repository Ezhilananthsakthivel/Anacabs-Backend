const router = require("express").Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const helper = require("../helpers/auth.helper");

router.post("/register", async (req, res) => {
    try {
        // Data Validation
        const user = await helper.validateRegister(req.body);
        delete user.cpassword
        // User Exists Validation
        const userExists = await helper.findUseruname(user.uname);
        if (userExists)
            return res.status(400).send({ error: "User already exists" });
        // Generate Password Hash
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        // Insert User
        const data = await helper.createuser({ ...user, role: "user", active: true });
        res.send(data);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})
router.post("/dlogin", async (req, res) => {
    try {
        // Data Validation
        const driver = await helper.validateLogin(req.body);
        // User Exists Validation
        const dbdriver = await helper.findDriveruname(driver.uname);
        if (!dbdriver)
            return res.status(400).send({ error: "driver doesn't exists" });
        // Password Validation
        const isSame = await bcrypt.compare(driver.password, dbdriver.password);
        if (!isSame) return res.status(401).send({ error: "Password Mismatch" });
        // Generate Auth Token
        const authToken = await jwt.sign(
            {
                _id: dbdriver._id,
                uname: dbdriver.uname,
                role: dbdriver.role
            },
            process.env.JWTpassword,
            { expiresIn: "10h" }
        );

        res.send({ message: "Driver logged in", authToken, dbdriver });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})
router.post("/alogin", async (req, res) => {
    try {
        // Data Validation
        const admin = await helper.validateLogin(req.body);
        // User Exists Validation
        const dbadmin = await helper.findAdminuname(admin.uname);
        if (!dbadmin)
            return res.status(400).send({ error: "Admin doesn't exists" });
        // Password Validation
        const isSame = await bcrypt.compare(admin.password, dbadmin.password);
        if (!isSame) return res.status(401).send({ error: "Password Mismatch" });
        // Generate Auth Token
        const authToken = await jwt.sign(
            {
                _id: dbadmin._id,
                uname: dbadmin.uname,
                role: dbadmin.role
            },
            process.env.JWTpassword,
            { expiresIn: "10h" }
        );

        res.send({ message: "Admin logged in", authToken, dbadmin });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})
router.post("/login", async (req, res) => {
    try {
        // Data Validation
        const user = await helper.validateLogin(req.body);
        // User Exists Validation
        const dbuser = await helper.findUseruname(user.uname);
        if (!dbuser)
            return res.status(400).send({ error: "User doesn't exists" });
        // Password Validation
        const isSame = await bcrypt.compare(user.password, dbuser.password);
        if (!isSame) return res.status(401).send({ error: "Password Mismatch" });
        // Generate Auth Token
        const authToken = await jwt.sign(
            {
                _id: dbuser._id,
                uname: dbuser.uname,
                role: dbuser.role
            },
            process.env.JWTpassword,
            { expiresIn: "10h" }
        );

        res.send({ message: "User logged in", authToken, dbuser });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})

module.exports = router