// import statements
const notion = require('../config/notionClient');
const {paginateQuery, flattenPropertyValue} = require('../utils/notionUtils');

// matches database names to Notion database IDs
const db_ids = {Vocabulary: process.env.VOCAB_ID, MethodsWebDev: process.env.METHODS_ID, MethodsPython: process.env.METHODS_ID};

// matches different database names to their corresponding view configurations (filters)
const ViewDictionary = {
    MethodsWebDev: { //Queries methods database for entries related to web development (JS, HTML, CSS)
        or: [
            {
                property: 'Language',
                rollup: {
                    any: {
                        select: {equals: 'Javascript'}
                    }
                }
            },
            {
                property: 'Language',
                rollup: {
                    any: {
                        select: {equals: 'HTML'}
                    }
                }
            },
            {
                property: 'Language',
                rollup: {
                    any: {
                        select: {equals: 'CSS'}
                    }
                }
            },
        ]
    },
    MethodsPython : {
        property: "Language",
        rollup: {
          any: {
            select: { equals: "Python" }
          }
        }
      },
      
};


// Function to handle database queries with specific view filters
async function handleDatabaseQuery(req, res){
    const { dbName, req_properties } = req.body;
    
    let pageList = [];
    try{
        const queryBody = {
            database_id: db_ids[dbName],
            filter: ViewDictionary[dbName] || {property: 'Name', rich_text: {is_not_empty: true}}, //defaults to no filter if none is found
            page_size: 100, //default page size
        };

        //-----TEST----
        console.log(dbName);
        console.log(db_ids[dbName]);
        console.log(ViewDictionary[dbName]);
        //----TEST----


        pageList = await paginateQuery(queryBody); //query and paginate queryBody from Notion server 

        let extractedData = await Promise.all(pageList.map(async page => {
            let extractedProperties = {};
            for (const property of req_properties){
                const rawValue = page.properties[property];
                extractedProperties[property] = await flattenPropertyValue(rawValue);
            }
            // let extractedProperties = {};
            // req_properties.forEach(property => {
            //     const rawValue = page.properties[property];
            //     extractedProperties[property] = flattenPropertyValue(rawValue);
            // });
            return extractedProperties;
        }));
        
        return res.json({message: "Success!", data: extractedData})

    } catch (error) {
        console.error("Error querying Notion database: ", error);
        return res.json({message: "Error has occurred.", error: error});
    }
};



module.exports = handleDatabaseQuery;