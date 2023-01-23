const db = require("../mongodb")
const Joi = require("joi")

const registerSchema = Joi.object({
    fname: Joi.string().min(4).max(20).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    pnumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password: Joi.string().min(4).max(15).required(),
    cpassword: Joi.ref("password")
});

const loginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(4).max(15).required()
});

const dloginSchema = Joi.object({
    uname: Joi.string().required(),
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
    dvalidateLogin(user) {
        try {
            return dloginSchema.validateAsync(user);
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
    findUserEmail(email) {
        return db.users.findOne({ email, active: true });
    },
    createuser(user) {
        return db.users.insertOne(user);
    },
    findToken(email) {
        return db.tokens.findOne({ email, type: "registration" })
    }
}

module.exports = helper