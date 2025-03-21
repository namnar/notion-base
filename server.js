
// ─────────────────────────────────────────────────────────────
// 1. Load Environment Variables & Dependencies
// ─────────────────────────────────────────────────────────────
require('dotenv').util();
express = require('express');
app = express();


// ─────────────────────────────────────────────────────────────
// 2. Import Routes / Middleware / Utilities
// ─────────────────────────────────────────────────────────────
const databaseRoutes = require('./routes/databaseRoutes');


// ─────────────────────────────────────────────────────────────
// 3. Middleware Setup
// ─────────────────────────────────────────────────────────────
app.use(express.static("public")); // serve static public files
app.use(express.json()); // for parsing application/json


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
 */


// ─────────────────────────────────────────────────────────────
// 4. Routes
// ─────────────────────────────────────────────────────────────

app.get("/", (request, response) => {//servers index.html
    response.sendFile(__dirname + '/views/index.html');
});

// ─────────────────────────────────────────────────────────────
// 5. Start the Server
// ─────────────────────────────────────────────────────────────
const listener = app.listen(process.env.PORT, function(){
    console.log("Your app is listening to port: " + listener.address().port);
});