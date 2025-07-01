const notion = require('../config/notionClient.js');

// Helper function to format query results
const formatResponse = (result) => {
    return {
        success: true,
        data: result,
        timestamp: new Date().toISOString()
    };
};

// Helper function to validate and format filter
const validateFilter = (filter) => {
    if (!filter || typeof filter !== 'object') {
        return {};
    }

    // If filter has a single property, wrap it in an or condition
    if (Object.keys(filter).length === 1) {
        return { or: [filter] };
    }

    // If filter has multiple properties, wrap them in an and condition
    if (Object.keys(filter).length > 1) {
        const conditions = Object.entries(filter).map(([key, value]) => ({
            [key]: value
        }));
        return { and: conditions };
    }

    return filter;
};

// Test queries
const testQueries = {
    getDatabase: async (databaseId) => {
        try {
            const result = await notion.databases.retrieve({ database_id: databaseId });
            return formatResponse(result);
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    getPages: async (databaseId, filter = {}) => {
        try {
            // Validate and format the filter
            const validFilter = validateFilter(filter);
            
            const result = await notion.databases.query({
                database_id: databaseId,
                filter: validFilter
            });
            return formatResponse(result.results);
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    getSinglePage: async (pageId) => {
        try {
            const result = await notion.pages.retrieve({ page_id: pageId });
            return formatResponse(result);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

const parseFilter = (filterStr) => {
    try {
        // Try to parse as JSON first
        return JSON.parse(filterStr);
    } catch (e) {
        try {
            // If that fails, try to evaluate as JavaScript object literal
            return eval('(' + filterStr + ')');
        } catch (e) {
            return {};
        }
    }
};

// Handle test queries
const handleTestQuery = async (req, res) => {
    const { query, databaseId, filter } = req.body;
    
    if (!query || !testQueries[query]) {
        return res.status(400).json({ 
            error: 'Invalid query type',
            examples: {
                getPages: {
                    "or": [{
                        "property": "Language",
                        "select": {
                            "equals": "CSS"
                        }
                    }]
                }
            }
        });
    }
    
    try {
        // Parse filter safely
        const parsedFilter = parseFilter(filter);
        
        // Execute query with parsed filter
        const result = await testQueries[query](databaseId, parsedFilter);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            help: "Filter must be a valid JSON object with proper Notion filter structure. Check the API docs for more details."
        });
    }
};

module.exports = handleTestQuery;
