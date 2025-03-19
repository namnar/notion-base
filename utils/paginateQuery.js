const notion = require('../config/notionClient.js');

//pagination helper function: queries and paginates Notion database
async function paginateQuery(body){
    let hasMore = true;
    let nextCursor = undefined;
    let pageList = [];

    try{
        while(hasMore){
            body['start_cursor'] = nextCursor;
            // query the Notion API
            const response = await notion.databases.query(body);
            //Accumulate pages
            const pages = response.results;
            pageList = pageList.concat(pages);
            // Update pagination variables
            hasMore = response.has_more;
            nextCursor = response.next_cursor;
        }
        return pageList;
    } catch (error) {
        console.error("Error querying Notion database: ", error);
        return {error: true, message: 'failed to paginate query', details: error};
    }
}

//export paginateQuery
module.exports = paginateQuery;