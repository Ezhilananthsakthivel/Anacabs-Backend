const crypto = require("crypto")
const db = require("../mongodb")

module.exports = async function (id, type) {
    let tokenObject = {
        Uid: id,
        token: crypto.randomBytes(32).toString('hex'),
        type,
        created: Date.now(),
        // expires: 600
    }
    await db.tokens.insertOne(tokenObject)
    return tokenObject
}