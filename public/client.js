// This file is run by the browser each time your view template is loaded

/**
 * Define variables that reference elements included in /views/index.html:
 */

// Document elements
const dbForm = document.getElementById("databaseForm");
const dbResponseEl = document.getElementById("dbResponse");

/**
 * Functions to handle appending new content to /views/index.html
 */

// Appends the API response to the UI
const appendApiResponse = function (apiResponse, el) {
  console.log(apiResponse);

  // Add success message to UI
  const newParagraphSuccessMsg = document.createElement("p");
  newParagraphSuccessMsg.textContent = "Result: " + apiResponse.message;
  el.appendChild(newParagraphSuccessMsg);
  // See browser console for more information
  if (apiResponse.message === "error") return;

  // Add ID of Notion item (db, page, comment) to UI
  const newParagraphId = document.createElement("p");
  newParagraphId.textContent = "ID: " + apiResponse.data.id;
  el.appendChild(newParagraphId);

  // Add URL of Notion item (db, page) to UI
  if (apiResponse.data.url) {
    const newAnchorTag = document.createElement("a");
    newAnchorTag.setAttribute("href", apiResponse.data.url);
    newAnchorTag.innerText = apiResponse.data.url;
    el.appendChild(newAnchorTag);
  }
}


// Attach submit event to dbForm
dbForm.onsubmit = async function (event) {
  event.preventDefault();
  const dbName = event.target.dbName.value

  //match name to database_id
  //match name to filters
  //match name to req_properties


  const body = JSON.stringify({ dbName });

  const newDBResponse = await fetch("/databases/methods/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
  const newDBData = newDBResponse.json();
  console.log('finished await');
  console.log(newDBData);

  // appendApiResponse(newDBData, dbResponseEl)
}