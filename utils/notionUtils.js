// utils/notionUtils.js

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


//get information about database (including properties informaiton)
async function getDatabaseInfo(databaseId){
    return await notion.databases.retrieve({database_id: databaseId});
}


/**
 * Helper function to flatten Notion property values
 * @param {Object} propertyValue - The Notion property value object to flatten
 * @returns {string|null} The flattened value or null if not found
 */
async function flattenPropertyValue(propertyValue) {
    if (!propertyValue || propertyValue == {}) {
        return null;}

    const type = propertyValue.type;
    switch(type) {
        case 'relation':
            if (!propertyValue.hasMore){ //less than 25 relations
                const relationIds = propertyValue.relation.map(r => r.id); //creates an array of just the IDs
                const titles = await getRelationTitles(relationIds);
                return relationIds.map(rid => ({id: rid, title: titles[rid]})); //returns {id, title} object --could also be expanded to include database id
            }
            else{ //too many relations to fit in 1 query (over 25)
                //get database ID
                //query database (using paginateQuery) for each entry in the db that references the DB
                console.log("Over 25 relations in this property. Will only return 25 currently.");
                const relationIds = propertyValue.relation.map(r => r.id); //creates an array of just the IDs
                const titles = await getRelationTitles(relationIds);
                return relationIds.map(rid => ({id: rid, title: titles[rid]})); 
            }
            
        case 'title':
            return propertyValue.title[0]?.text?.content || null;
        case 'text':
            return propertyValue.text[0]?.text?.content || null;
        case 'rich_text':
            const firstItem = propertyValue.rich_text[0];
            const content = firstItem?.text?.content;
            return content || null;
        case 'number':
            return propertyValue.number || null;
        case 'select':
            return propertyValue.select?.name || null;
        case 'multi_select':
            return propertyValue.multi_select.map(select => select.name).join(', ') || null;
        case 'date':
            return propertyValue.date?.start || null;
        case 'last_edited_time':
            return propertyValue.last_edited_time || null;
        case 'created_time':
            return propertyValue.created_time || null;
        case 'checkbox':
            return propertyValue.checkbox || null;
        case 'status':
            return propertyValue.status.name || null;
        case 'email':
            return propertyValue.email || null;
        case 'phone_number':
            return propertyValue.phone_number || null;
        case 'rollup':
            const selectData = propertyValue.rollup.array[0];
            return flattenPropertyValue(selectData);
        default:
            return null;
    }
}


async function getPageFromId(pId){
    const page = await notion.pages.retrieve({ page_id: pId });
    return page;
}

/**
 * Helper function to convert Notion date format to ISO string
 * @param {Object} notionDate - The Notion date object
 * @returns {string|null} The ISO formatted date string
 */
function formatNotionDate(notionDate) {
    if (!notionDate) return null;
    
    const date = notionDate.start;
    if (!date) return null;
    
    return new Date(date).toISOString();
}

/**
 * Helper function to convert Notion multi-select to array
 * @param {Object} multiSelect - The Notion multi-select property
 * @returns {string[]} Array of selected values
 */
function getMultiSelectValues(multiSelect) {
    if (!multiSelect) return [];
    
    return multiSelect.map(select => select.name);
}

/**
 * Helper function to convert Notion properties to a flat object
 * @param {Object} properties - The Notion properties object
 * @param {string[]} requiredProperties - Array of property names to include
 * @returns {Object} Flattened object with only required properties
 */
function flattenNotionProperties(properties, requiredProperties) {
    const result = {};
    requiredProperties.forEach(property => {
        if (properties[property]) {
            result[property] = flattenPropertyValue(properties[property]);
        }
    });
    return result;
}


/**
 * Helper function to convert Notion properties to a flat object
 * @param {Object} properties - The Notion properties object
 * @returns {Object} Flattened object with all properties
 */
function flattenAllNotionProperties(properties) {
    const result = {};
    properties.forEach(property => {
        result[property] = flattenPropertyValue(properties[property]);
    });
    return result;
}


// Add this function before flattenPropertyValue
async function getRelationTitles(relationIds) {
    const titles = {};
    for (const id of relationIds) {
        try {
            const page = await notion.pages.retrieve({ page_id: id });
            titles[id] = page.properties.Name?.title?.[0]?.text?.content || 
                        page.properties.Name?.rich_text?.[0]?.text?.content || 
                        null;
        } catch (error) {
            console.error(`Error fetching title for relation ${id}:`, error);
            titles[id] = null;
        }
    }
    return titles;
}

// Export all utility functions
module.exports = {
    paginateQuery,
    getDatabaseInfo,
    getPageFromId,
    flattenPropertyValue,
    formatNotionDate,
    getMultiSelectValues,
    flattenNotionProperties
};