require("dotenv").config()
const express = require("express")
const app = express()

const { Client } = require("@notionhq/client")
const notion = new Client({ auth: process.env.NOTION_KEY })

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"))
app.use(express.json()) //for parsing application/json

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
    response.sendFile(__dirname + "/views/index.html")
})


/**
 * request body needs this data:
 * {
 *   database_id: string,
 *   database_filter: {
 *     connector: [ 
 *       { property: 'Name', condition: '...' },
 *       { property: 'OtherProp', condition: '...' }
 *     ]
 *   },
 *   req_properties: ['Name', 'AnotherProperty']
 * }
 * 
 * the rest of this will be handled by backend. The client will only send the name of the db and
 * view that it wants.
 * 
 * create separate end points that both share the directory /databases
 * create helper function that reduces repeated code
 */


app.post("/databases/methods/", async (req, res) => {
    const viewDictionary = {
        MethodsWebDev: { //the view 
            or: [
                {
                    property: 'Language',
                    rollup: {
                        any: {
                            rich_text: {
                                equals: 'Javascript'
                            }
                        }
                    }
                },
                {
                    property: 'Language',
                    rollup: {
                        any: {
                            rich_text: {
                                equals: 'HTML'
                            }
                        }
                    }
                },
                {
                    property: 'Language',
                    rollup: {
                        any: {
                            rich_text: {
                                equals: 'CSS'
                            }
                        }
                    }
                }
            ]
        },
        MethodsPython: {
            property: 'Language',
            rollup: {
                any: {
                    rich_text: {
                        equals: 'Python'
                    }
                }
            }

        },
    };
    const queryBody = {
        database_id: process.env.METHODS_DATABASE,
        database_filter: viewDictionary[req.body.dbName],
        page_size: 100, //default
    };
    let pages = await paginateQuery(queryBody);
    //handle the data
    //send the response to the client
    let reqProperties = {};
    console.log(pages);
    return res.send(pages);
})

app.post("/databases/vocab", (req, res) => {
    //retrieve body object
    //query database while paginating
    //handle resulting data
})

async function paginateQuery(body) {
    let hasMore = true;
    let nextCursor = undefined;
    let pageList = [];

    try {
        while (hasMore){
            body['start_cursor'] = nextCursor;
            //query the notion api
            const response = await notion.databases.query(body);
            //accumulate pages
            const pages = response.results;
            pageList = pageList.concat(pages);
            //update pagination variables
            hasMore = response.has_more;
            nextCursor = response.next_cursor;
        }
        return pageList;
    }
    catch (error){
        console.error("Error querying Notion database: ", error);
        return { error: true, message: "Failed to paginate query", details: error };
        // throw new Error("Error querying Notion database: " + error.message);

    }

}

app.post("/databases", async (req, res) => {
    // Destructure from req.body
    const { database_id, database_filter, req_properties } = req.body;
    // const databaseID = database_id;
    // const databaseFilter = database_filter;

    let hasMore = true;
    let nextCursor = undefined;
    const pageSize = 10;
    let pageList = [];

    try {
        while (hasMore) {//loop for pagination
            //make query request to Notion API
            const queryObject = {
                database_id: database_id,
                page_size: pageSize,
                start_cursor: nextCursor,
            };
            //only add filter if it isn't empty
            if (Object.keys(database_filter).length !== 0) queryObject["filter"] = database_filter;

            const response = await notion.databases.query(queryObject);
            const pages = response.results;

            //Handle database response data. Create a list of JS objects with data of specified properties
            pages.forEach((page) => {
                let extractedProperties = {};
                req_properties.forEach((property) => {
                    extractedProperties[property] = page.properties[property];
                })
                pageList.push(extractedProperties); //note: raw data will need to be parsed further client-side
            })
            //update pagination
            hasMore = response.has_more;
            nextCursor = response.next_cursor;
        }
        //respond with database list back
        res.json({ message: "success!", data: pageList });
    }
    catch (error) {
        console.error("Error querying Notion database: ", error);
        res.json({ message: "Error. Something went wrong while querying Notion.", error: error });

    }
})



// listen for requests
const listener = app.listen(process.env.PORT, function () {
    console.log("Your app is listening on port " + listener.address().port);
})