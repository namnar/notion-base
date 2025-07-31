const { getPage } = require('@notionhq/client/build/src/api-endpoints.js');
const notion = require('../config/notionClient.js');
const {paginateQuery, getDatabaseInfo, getPageFromId} = require('../utils/notionUtils.js');



// const body = JSON.stringify({
//     databaseId: databaseID,
//     query: testQuery,
//     filter: testFilter
//   })

// const queryBody = {
//     database_id: db_ids[dbName],
//     filter: ViewDictionary[dbName] || {property: 'Name', rich_text: {is_not_empty: true}}, //defaults to no filter if none is found
//     page_size: 100, //default page size
// };



// Handle test queries
const handleTestQuery = async (req, res) => {
    const { query, databaseId, filter } = req.body;
    try{
        console.log(query);
        if (query == 'getDatabase') {
            console.log('entered databaseId')
            const dbinfo = await getDatabaseInfo(databaseId);
            console.log(dbinfo);
            return res.json({message: "Success!", data: dbinfo});
        }
        else if (query == 'getPageFromId'){
            console.log('entered getPageFromId');
            const page = await getPageFromId(filter);
            return res.json({message: "Success!", data: page});
        }
        else { //if (query == 'getPages')
            const parsedFilter = typeof filter === 'string' ? JSON.parse(filter) : filter;
            // const pages = await paginateQuery({database_id: databaseId, filter: filter, page_size: 100});
            const pages = await paginateQuery({database_id: databaseId, filter: parsedFilter, page_size: 100});
            return res.json({message: "Success!", data: pages});
        }
    }
    catch(error){
        console.error("Error querying Notion database: ", error);
        return res.json({message: "Error has occurred.", error: error});
    }
};

module.exports = handleTestQuery;
