const { ObjectId } = require("mongodb")
const db = require("../mongodb")

const helper = {
    find() {
        return db.users.find().toArray()
    },
    findone(_id) {
        return db.users.findOne({ _id: ObjectId(_id) })
    },
    remove(_id) {
        return db.users.deleteOne({ _id: ObjectId(_id) })
    }

}

module.exports = helper