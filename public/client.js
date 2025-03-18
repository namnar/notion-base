// This file is run by the browser each time your view template is loaded

/**************************************************************
 * 1. DOM ELEMENT REFERENCES
 **************************************************************/

// Forms
const dbForm = document.getElementById("databaseForm")
const pageForm = document.getElementById("pageForm")
const blocksForm = document.getElementById("blocksForm")
const commentForm = document.getElementById("commentForm")

// Sections to display API responses
const dbResponseEl = document.getElementById("dbResponse")
const pageResponseEl = document.getElementById("pageResponse")
const blocksResponseEl = document.getElementById("blocksResponse")
const commentResponseEl = document.getElementById("commentResponse")

/**************************************************************
 * 2. HELPER FUNCTIONS
 **************************************************************/

// Create and return a <p> tag with given text
const createParagraph = (text) => {
  const p = document.createElement("p")
  p.textContent = text
  return p
}

// Create and return an <a> tag with a given URL
const createLink = (url) => {
  const a = document.createElement("a")
  a.href = url
  a.innerText = url
  return a
}

// Display a generic API response (e.g. for databases, pages, comments)
const showApiResultOnPage = (apiResponse, targetElement) => {
  console.log(apiResponse)

  targetElement.appendChild(createParagraph("Result: " + apiResponse.message))

  if (apiResponse.message === "error") return

  targetElement.appendChild(createParagraph("ID: " + apiResponse.data.id))

  if (apiResponse.data.url) {
    targetElement.appendChild(createLink(apiResponse.data.url))
  }
}

// Display a blocks-specific API response
const showBlocksResultOnPage = (apiResponse, targetElement) => {
  console.log(apiResponse)

  targetElement.appendChild(createParagraph("Result: " + apiResponse.message))

  if (apiResponse.message === "error") return

  const firstBlockId = apiResponse.data.results[0]?.id
  if (firstBlockId) {
    targetElement.appendChild(createParagraph("ID: " + firstBlockId))
  }
}

/**************************************************************
 * 3. FORM EVENT HANDLERS
 **************************************************************/

// Handle database creation form submission
dbForm.onsubmit = async (event) => {
  event.preventDefault()

  const databaseName = event.target.dbName.value
  const body = JSON.stringify({ dbName: databaseName })

  const response = await fetch("/databases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })

  const data = await response.json()
  showApiResultOnPage(data, dbResponseEl)
}

// Handle new page creation form submission
pageForm.onsubmit = async (event) => {
  event.preventDefault()

  const databaseID = event.target.newPageDB.value
  const pageName = event.target.newPageName.value
  const headerText = event.target.header.value

  const body = JSON.stringify({
    dbID: databaseID,
    pageName,
    header: headerText,
  })

  const response = await fetch("/pages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })

  const data = await response.json()
  showApiResultOnPage(data, pageResponseEl)
}

// Handle adding blocks to a page
blocksForm.onsubmit = async (event) => {
  event.preventDefault()

  const pageID = event.target.pageID.value
  const content = event.target.content.value
  const body = JSON.stringify({ pageID, content })

  const response = await fetch("/blocks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })

  const data = await response.json()
  showBlocksResultOnPage(data, blocksResponseEl)
}

// Handle adding comments to a page
commentForm.onsubmit = async (event) => {
  event.preventDefault()

  const pageID = event.target.pageIDComment.value
  const comment = event.target.comment.value
  const body = JSON.stringify({ pageID, comment })

  const response = await fetch("/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })

  const data = await response.json()
  showApiResultOnPage(data, commentResponseEl)
}
