var client = require('mongodb').MongoClient;
var url = process.env.HORSE_DB_PROD;

let db;

const mongo = {
  async connect(databaseName) {
    db = await client.connect(url);
    return db.db(databaseName);
  },
  close() {
    db.close();
  }
};

module.exports = mongo;