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
 */
app.post("/databases", async (req, res)=>{
    // Destructure from req.body
    const { database_id, database_filter, req_properties } = req.body;
    const databaseID = database_id;
    const databaseFilter = database_filter;
    const reqProperties = req_properties;

    let hasMore = true;
    let nextCursor = undefined;
    const pageSize = 10;
    let pageList = [];

    try{
        while (hasMore){
            //make query request to Notion API
            const response = await notion.databases.query({
                database_id: databaseID,
                page_size: pageSize,
                start_cursor: nextCursor,
                filter: databaseFilter,
            });
            const pages = response.results;

            //Handle database response data. Create a list of JS objects with data of specified properties
            pages.forEach((page) => {
                let extractedProperties = {};
                reqProperties.forEach((property)=>{
                    extractedProperties[property] = page.properties[property];
                })
                pageList.push(extractedProperties); //note: raw data will need to be parsed further client-side
            })
            //update pagination
            hasMore = response.has_more;
            nextCursor = response.next_cursor;
        }
        //respond with database list back
        res.json({message:"success!", data: pageList});
    }
    catch(error){
        console.error("Error querying Notion database: ", error)
        res.json({ message:"Error. Something went wrong while querying Notion.", error: error });

    }
})






  // listen for requests
const listener = app.listen(process.env.PORT, function () {
    console.log("Your app is listening on port " + listener.address().port)
  })