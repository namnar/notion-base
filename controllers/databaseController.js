const paginateQuery = require('../utils/paginateQuery');
const notion = require('../config/notionClient');

// View configuration for different databases
const ViewDictionary = {
    MethodsWebDev: { //Queries methods database for entries related to web development (JS, HTML, CSS)
        or: [
            {
                property: 'Language',
                rollup: {
                    any: {
                        rich_text: {equals: 'Javascript'}
                    }
                }
            },
            {
                property: 'Language',
                rollup: {
                    any: {
                        rich_text: {equals: 'HTML'}
                    }
                }
            },
            {
                property: 'Language',
                rollup: {
                    any: {
                        rich_text: {equals: 'CSS'}
                    }
                }
            },
        ]
    },
    MethodsPython: { //Queries methods database for entries related to Python
        property: 'Language',
        rollup: {
            any: {
                rich_text: {equals: 'Python'}
            }
        },
    }
};


// Function to handle database queries with specific view filters
async function handleDatabaseQuery(req, res){
    const { database_id, database_filter, req_properties } = req.body;
    
    let pageList = [];
    try{
        const queryBody = {
            database_id: database_id,
            database_filter: ViewDictionary[req.body.dbName] || database_filter, //selects filter options based on "dbName" and defaults to database_filter if none are found
            page_size: 100, //default page size
        };
        pageList = await paginateQuery(queryBody); //query and paginate queryBody from Notion server 

        // Process and filter the data based on specified req_properties
        let extractedData = pageList.map(page => {
            let extractedProperties = {};
            req_properties.forEach(property => {    //req_properties is the specified list of properties (columns) the caller wants returned. The database has a lot of columns
                extractedProperties[property] = page.properties[property];
            });
            return extractedProperties;
        });
        
        return res.json({message: "Success!", data: extractedData})

    } catch (error) {
        console.error("Error querying Notion database: ", error);
        return res.json({message: "Error has occurred.", error: error});
    }
};


module.exports = handleDatabaseQuery;