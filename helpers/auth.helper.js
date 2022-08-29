const db = require("../mongodb")
const Joi = require("joi")

const registerSchema = Joi.object({
    fname: Joi.string().min(4).max(20).required(),
    uname: Joi.string().min(4).max(15).required(),
    pnumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password: Joi.string().min(4).max(15).required(),
    cpassword: Joi.ref("password")
});

const loginSchema = Joi.object({
    uname: Joi.string().min(4).max(15).required(),
    password: Joi.string().min(4).max(15).required()
});

const helper = {
    validateRegister(user) {
        try {
            return registerSchema.validateAsync(user);
        } catch ({ details: [{ message }] }) {
            throw new Error(message);
        }
    },
    validateLogin(user) {
        try {
            return loginSchema.validateAsync(user);
        } catch ({ details: [{ message }] }) {
            throw new Error(message);
        }
    },
    findDriveruname(uname) {
        return db.drivers.findOne({ uname, active: true });
    },
    findAdminuname(uname) {
        return db.admin.findOne({ uname, active: true });
    },
    findUseruname(uname){
        return db.users.findOne({ uname, active: true });
    },
    createuser(user) {
        return db.users.insertOne(user);
    }
}

module.exports = helper