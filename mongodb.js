const { MongoClient } = require("mongodb");

const mongo = {
    db: null,
    admin: null,
    bookings: null,
    drivers: null,
    async connect() {
        const client = new MongoClient(process.env.DB_URL);
        await client.connect();
        this.db = await client.db(process.env.DB_Name);
        console.log(`db connected-${process.env.DB_URL}-${process.env.DB_Name}`);
        this.admin = this.db.collection("admin");
        this.bookings = this.db.collection("bookings");
        this.drivers = this.db.collection("drivers");
    }
}

module.exports = mongo;
//DB_URL=mongodb+srv://Anacabs:Anacabs@cluster0.wwtcexq.mongodb.net/?retryWrites=true&w=majority
//DB_URL=mongodb://localhost:27017