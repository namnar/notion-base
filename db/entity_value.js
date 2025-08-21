// Import database instance for entity_value operations
const {db} = require('./manager.js');


//CRUD


//CREATE
function createEntityValue(){
    
}

//READ -- entity_id, value_content, attribute_id


//UPDATE -- value, content, batch updates
/**
 * Updates one or more entity values in the database
 * @param {Object|Array} updates - A single update object or array of update objects
 * @param {string} updates[].entity_id - The ID of the entity to update
 * @param {string} updates[].attribute_id - The ID of the attribute to update
 * @param {string} updates[].value_content - The new value content
 * @returns {Promise<Array>} Array of updated rows
 */
async function updateEntityValue(updates) {
    try {
        // Convert single update to array for consistent processing
        const updatesArray = Array.isArray(updates) ? updates : [updates];

        // Validate input
        if (!updatesArray.length) {
            throw new Error('No updates provided');
        }

        // Prepare batch update
        const updatePromises = updatesArray.map(update => {
            const { entity_id, attribute_id, value_content } = update;
            
            if (!entity_id || !attribute_id) {
                throw new Error('entity_id and attribute_id are required for each update');
            }

            // Using INSERT OR REPLACE to handle both updates and inserts
            return db.run(
                `INSERT OR REPLACE INTO entity_values 
                 (entity_id, attribute_id, value_content) 
                 VALUES (?, ?, ?) 
                 ON CONFLICT(entity_id, attribute_id) 
                 DO UPDATE SET value_content = excluded.value_content`,
                [entity_id, attribute_id, value_content || null]
            );
        });

        // Execute all updates in parallel
        const results = await Promise.all(updatePromises);
        return results.flat();
    } catch (error) {
        console.error('Error updating entity values:', error);
        throw error; // Re-throw to allow caller to handle
    }
}


//DELETE 



module.exports = { updateEntityValue };