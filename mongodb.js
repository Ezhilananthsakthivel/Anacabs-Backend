const { MongoClient } = require("mongodb");

const mongo = {
    db: null,
    admin: null,
    bookings: null,
    drivers: null,
    users:null,
    async connect() {
        const client = new MongoClient(process.env.DB_URL);
        await client.connect();
        this.db = await client.db(process.env.DB_Name);
        console.log(`db connected-${process.env.DB_Name}`);
        this.admin = this.db.collection("admin");
        this.bookings = this.db.collection("bookings");
        this.drivers = this.db.collection("drivers");
        this.users=this.db.collection("users")
    }
}

module.exports = mongo;