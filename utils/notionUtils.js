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



/**
 * Helper function to flatten Notion property values
 * @param {Object} propertyValue - The Notion property value to flatten
 * @returns {string|null} The flattened value or null if not found
 */
async function flattenPropertyValue(propertyValue) {
    if (!propertyValue) return null;

    //special case
    if (propertyValue.relation){
        const relationIds = propertyValue.relation.map(r => r.id);
        const titles = await getRelationTitles(relationIds);
        
        return propertyValue.relation.map(relation => ({
            id: relation.id,
            title: titles[relation.id]
        }));
    }
    
    if (propertyValue.title) {
        return propertyValue.title[0]?.text?.content || null;
    }
    if (propertyValue.rich_text) {
        return propertyValue.rich_text[0]?.text?.content || null;
    }
    if (propertyValue.number) {
        return propertyValue.number.toString();
    }
    if (propertyValue.select) {
        return propertyValue.select?.name || null;
    }
    if (propertyValue.multi_select) {
        return propertyValue.multi_select.map(select => select.name).join(', ') || null;
    }
    if (propertyValue.date) {
        return propertyValue.date?.start || null;
    }
    if (propertyValue.checkbox) {
        return propertyValue.checkbox.toString();
    }
    if (propertyValue.relation) {
        return propertyValue.relation.map(relation => ({
            id: relation.id,
            title: relation.title?.[0]?.text?.content || relation.name || null
        }));
    }
    if (propertyValue.rollup) {
        const selectData = propertyValue.rollup.array[0];
        return flattenPropertyValue(selectData);
    }
    //special cases where the property value is a reference to another entry
    //special case where the property value is an array (of possibly references)
    
    return propertyValue;
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
    flattenPropertyValue,
    formatNotionDate,
    getMultiSelectValues,
    flattenNotionProperties
};