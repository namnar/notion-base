const Database = require('better-sqlite3');
const Path = require('path');

// let db;
const dbPath = Path.join(__dirname, '../local.db')
const db = new Database(dbPath, {verbose: console.log});

// function getDb (dbPath = Path.join(__dirname, '../local.db')){
//     if (!db){
//         db = new Database(dbPath, {verbose: console.log});
//     }
//     return db;
// }

// db = getDb();


module.exports = {
    db
};