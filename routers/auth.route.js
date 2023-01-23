const router = require("express").Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const sendMail = require('../utils.js/sendMail')
const newToken = require('../utils.js/token')
const helper = require("../helpers/auth.helper");


router.post("/register", async (req, res) => {
    try {
        // Data Validation
        let user = await helper.validateRegister(req.body);
        delete user.cpassword
        // User Exists Validation
        const userExists = await helper.findUserEmail(user.email);
        if (userExists)
            return res.status(400).send({ error: "User already exists" });
        // Generate Password Hash
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        // Insert User
        await helper.createuser({ ...user, role: "user", active: true, verified: false });
        user = await helper.findUserEmail(user.email)

        //Create token
        const token = await newToken(user.email, "registration")
        //url
        const url = `${process.env.BASE_URL}/${user._id}/verify/${token.token}`
        //send verification mail
        await sendMail(user.email, "Verify your mail", url)
        res.send({ message: "email sent successfully" })

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})

router.post("/dlogin", async (req, res) => {
    try {
        // Data Validation
        const driver = await helper.dvalidateLogin(req.body);
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
        const admin = await helper.dvalidateLogin(req.body);
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

        res.send({ message: "Admin logged in", authToken });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})
router.post("/login", async (req, res) => {
    try {
        // Data Validation
        const user = await helper.validateLogin(req.body);
        // User Exists Validation
        const dbuser = await helper.findUserEmail(user.email);
        if (!dbuser) return res.status(400).send({ error: "User doesn't exists" });

        // Password Validation
        const isSame = await bcrypt.compare(user.password, dbuser.password);
        if (!isSame) return res.status(401).send({ error: "Password Mismatch" });

        //Token
        if (!dbuser.verified) {
            const token = await helper.findToken(dbuser.email)
            const url = `${process.env.BASE_URL}/${dbuser._id}/verify/${token.token}`
            await sendMail(dbuser.email, "Verify your mail", url)
            return res.status(400).send({ error: "An Email send to your account please verify" })
        }
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

        res.send({ message: "User logged in", authToken });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})

module.exports = router