const crypto = require("crypto")
const db = require("../mongodb")

module.exports = async function (email, type) {
    let tokenObject = {
        email: email,
        token: crypto.randomBytes(32).toString('hex'),
        type,
        created: Date.now(),
        // expires: 600
    }
    await db.tokens.insertOne(tokenObject)
    return tokenObject
}