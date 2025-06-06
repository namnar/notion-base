// This file is run by the browser each time your view template is loaded


/**************************************************************
 * 1. DOM ELEMENT REFERENCES
 **************************************************************/

// Document elements
const dbForm = document.getElementById("databaseForm");
const dbResponseEl = document.getElementById("dbResponse");

/**************************************************************
 * 2. HELPER FUNCTIONS
 **************************************************************/

const req_ids = {Vocabulary: ['Name', 'Explanation', 'Link', 'Category'], MethodsWebDev: ['Name', 'Explanation', 'Link', 'Modules', 'Language', 'Problems'], MethodsPython: ['Name', 'Explanation', 'Link', 'Modules', 'Language', 'Problems']}


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
  const dbName = event.target.dbName.value;

  //--match name to filters---
  //match name to req_properties
  const reqP = req_ids[dbName];


  const body = JSON.stringify({
    dbName: dbName,
    req_properties: reqP,
  });
  
  const newDBResponse = await fetch("/databases/methods", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const newDBData = await newDBResponse.json();
  console.log('finished await');
  console.log(newDBData);

  // appendApiResponse(newDBData, dbResponseEl)
}
