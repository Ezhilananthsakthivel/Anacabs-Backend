const router = require("express").Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const helper = require("../helpers/auth.helper")


router.post("/dregister", async (req, res) => {
    console.log(req.body)
    try {
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
        const { insertedId } = await helper.createdriver({ ...driver, role: "driver", active: true });

        res.send({ message: "Driver registered", userId: insertedId });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}
);

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
}
);

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
}
)

module.exports = router