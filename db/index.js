// const Database = require('better-sqlite3');
// const db = new Database('local.db');


// Export the core attribute functionality
// Handle database connection setup
// Export utility functions for attribute operations
// Provide error handling and transaction management

//Database connection setup
const manager = require('manager.js');
const db = manager.getDb();


// Export core attribute operations
module.exports = {
    // Initialize database
    initializeDatabase,

    // CRUD operations
    createAttribute: require('./attribute').createAttribute,
    getAttributeById: require('./attribute').getAttributeById,
    getAttributesByName: require('./attribute').getAttributesByName,
    updateAttribute: require('./attribute').updateAttribute,
    deleteAttribute: require('./attribute').deleteAttribute,
    
    // Utility functions
    getAttributesByType: require('./attribute').getAttributesByType,
    validateAttribute: require('./attribute').validateAttribute,
    
    // Transaction management
    runInTransaction: function(callback) {
        const transaction = db.transaction(callback);
        return transaction();
    }
};