
// ─────────────────────────────────────────────────────────────
// 1. Load Environment Variables & Dependencies
// ─────────────────────────────────────────────────────────────
require('dotenv').config();
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
app.use("/databases", databaseRoutes); //mount databaseRoutes routes: prefix with /databases




// ─────────────────────────────────────────────────────────────
// 4. Routes
// ─────────────────────────────────────────────────────────────

app.get("/", (request, response) => {//servers index.html
    response.sendFile(__dirname + '/views/index.html');
});

// ─────────────────────────────────────────────────────────────
// 5. Start the Server
// ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const listener = app.listen(PORT, function(){
    console.log("Your app is listening to port: " + listener.address().port);
});