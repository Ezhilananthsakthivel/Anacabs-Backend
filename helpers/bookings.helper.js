const { ObjectId } = require("mongodb")
const db = require("../mongodb")

const helper = {
    find() {
        return db.bookings.find().sort({ status: -1, time: -1, date: -1 }).toArray()
    },
    ubookings(uname) {
        return db.bookings.find({ uid: uname }).sort({ status: 1, time: -1, date: -1 }).toArray()
    },
    porders() {
        return db.bookings.find({ did: "" }).toArray()
    },
    findbyid(id) {
        return db.bookings.findOne({ _id: ObjectId(id) })
    },
    create(req) {
        return db.bookings.insertOne({ ...req.body, did: "", uid: req.user.uname, status: "pending" })
    },
    cupdate({ _id, ...body }) {
        return db.bookings.findOneAndUpdate(
            { _id: ObjectId(_id) },
            { $set: { ...body, status: "Completed" } },
            { returnDocument: "after" })
    },
    update(req) {
        return db.bookings.findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
            { $set: req.body },
            { returnDocument: "after" })
    },
    didfind(did) {
        return db.bookings.find({ did: did }).sort({ status: -1, time: -1, date: -1 }).toArray()
    },
    didupdate({ _id, did, ...body }) {
        return db.bookings.findOneAndUpdate(
            { _id: ObjectId(_id) },
            { $set: { ...body, did: did, status: "Accepted" } },
            { returnDocument: "after" })
    },
    driverorders(uname) {
        return db.bookings.find({ did: uname }).toArray()
    },
    userorders(uname) {
        return db.bookings.find({ uid: uname }).toArray()
    }
}

module.exports = helper