// Import database instance for metadata operations
const {db} = require('./manager.js');
//CRUD OPERATIONS

// CREATE TABLE db_metadata (
//     db_id varchar(100) PRIMARY KEY,
//     db_name varchar(100),
//     last_synced datetime,
//     last_error TEXT
// );


//CREATE
function createMetadata(dbInfo){
    //check db if metadata entry exists

    // Returns false if entry exists, continues if no entry exists
    if (searchMetadataId(dbInfo.id)){  
        return false;
    }
    //create metadata entry if the db does not exist
    try{
        const dbTitle = dbInfo.title[0].plain_text;
        //create entry
        const insert = db.prepare('INSERT INTO db_metadata (db_id, db_name, last_synced) VALUES (?, ?, ?)');
        insert.run(dbInfo.id, dbTitle, new Date());
        insert.finalize();
        return true;
    } catch (error){
        console.error('Error creating metadata entry', error);
        return false;
    }
    
}

//READ -- search based on db_id, db_name
function searchMetadataId(dbId){
    //return metadata entry based on db_id
    try{
        const stmt = db.prepare('SELECT * FROM db_metadata WHERE db_id = ?');
        const result = stmt.get(dbId);  //return undefined if there is no matching entry
        stmt.finalize();
        return result;
    } catch (error){
        console.error('Error searching metadata entry by id, error');
        return null;
    }
}

function searchMetadataName(dbName){
    //return metadata entry based on db_name
    try{
        const stmt = db.prepare('SELECT * FROM db_metadata WHERE db_name = ?');
        const result = stmt.get(dbName);
        stmt.finalize();
        return result;
    } catch (error){
        console.error('Error searching metadata entry by name, error');
        return null;
    }
}

//UPDATE -- update last_synced, last_error


//DELETE -- delete db based on db_id


module.exports = {};