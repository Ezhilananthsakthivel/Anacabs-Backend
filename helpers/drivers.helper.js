const { ObjectId } = require("mongodb")
const db = require("../mongodb")
const Joi = require("joi")

const registerSchema = Joi.object({
    fname: Joi.string().min(4).max(20).required(),
    uname: Joi.string().min(4).max(15).required(),
    pnumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password: Joi.string().min(4).max(15).required(),
    cpassword: Joi.ref("password"),
    dlicence: Joi.string().required(),
    cnumber: Joi.string().required()
})

const helper = {
    validateRegister(driver) {
        try {
            return registerSchema.validateAsync(driver);
        } catch ({ details: [{ message }] }) {
            throw new Error(message);
        }
    },
    findDriveruname(uname) {
        return db.drivers.findOne({ uname, active: true });
    },
    createdriver(driver) {
        return db.drivers.insertOne(driver);
    },
    find() {
        return db.drivers.find().toArray()
    },
    findbyid(id) {
        return db.drivers.findOne({ _id: ObjectId(id) })
    },
    findone(_id) {
        return db.drivers.findOne({ _id: ObjectId(_id) })
    },
    remove(id) {
        return db.drivers.deleteOne({ _id: ObjectId(id) })
    },
    updatebyid(req) {
        return db.drivers.findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
            { $set: req.body },
            { returnDocument: "after" })
    }
}

module.exports = helper