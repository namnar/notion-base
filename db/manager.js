const Database = require('better-sqlite3');
const Path = require('path');

let db;

function getDb (dbPath = path.join(__dirname, '../local.db')){
    if (!db){
        db = new Database(dbPath, {verbose: console.log});
    }
    return db;
}


module.exports = {
    getDb
};