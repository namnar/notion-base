// const paginateQuery = require('../utils/paginateQuery');
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

        // Process and filter the data based on specified req_properties
        // let extractedData = pageList.map(page => {
        //     let extractedProperties = {};
        //     req_properties.forEach(property => {    //req_properties is the specified list of properties (columns) the caller wants returned. The database has a lot of columns
        //         extractedProperties[property] = page.properties[property];
        //     });
        //     return extractedProperties;
        // });
        let extractedData = pageList.map(page => {
            let extractedProperties = {};
            req_properties.forEach(property => {
                const rawValue = page.properties[property];
                extractedProperties[property] = flattenPropertyValue(rawValue);
            });
            return extractedProperties;
        });
        
        return res.json({message: "Success!", data: extractedData})

    } catch (error) {
        console.error("Error querying Notion database: ", error);
        return res.json({message: "Error has occurred.", error: error});
    }
};


// // Helper function to flatten Notion property values
// function flattenPropertyValue(propertyValue) {
//     if (!propertyValue) return null;
    
//     // Handle different property types
//     if (propertyValue.title) {
//         return propertyValue.title[0]?.text?.content || null;
//     }
//     if (propertyValue.rich_text) {
//         return propertyValue.rich_text[0]?.text?.content || null;
//     }
//     if (propertyValue.number) {
//         return propertyValue.number.toString();
//     }
//     if (propertyValue.select) {
//         return propertyValue.select?.name || null;
//     }
//     if (propertyValue.multi_select) {
//         return propertyValue.multi_select.map(select => select.name).join(', ') || null;
//     }
//     if (propertyValue.date) {
//         return propertyValue.date?.start || null;
//     }
//     if (propertyValue.checkbox) {
//         return propertyValue.checkbox.toString();
//     }
    
//     // If none of the above, return the value as is
//     return propertyValue;
// };






module.exports = handleDatabaseQuery;