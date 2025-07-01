//defines express routes

const express = require('express');
const router = express.Router();
const handleDatabaseQuery  = require('../controllers/databaseController');
const handleTestQuery = require('../controllers/testController');

// Test route
router.post('/test', handleTestQuery);

//Route for querying specific methods in the database
router.post('/methods', handleDatabaseQuery);

// Additional routes for different types of database interactions here
router.post('/vocab', handleDatabaseQuery);



module.exports = router;