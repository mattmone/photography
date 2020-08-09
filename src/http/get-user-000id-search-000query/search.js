module.exports = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manga Search <%= query %></title>
</head>
<body>
  <h1>Search</h1>
  <% Object.keys(manga).forEach(function(site) { %>
    <h2><%= site %></h2>
    <% Array.isArray(manga[site]) && manga[site].forEach(function(result) { %>
      <h3><%= result.name %></h3>
      <p>Latest Chapter: <%= (result.details.latestChapter||{}).chap_number %></p>
      <p>Released: <%= (result.details.latestChapter||{}).dateAdded %></p>
      <img src="<%= result.details.info.image %>" />
      <p><%= result.details.info.synopsis %></p>
      <a href="<%= result.getUrl %>" target="_blank">Get it!</a>
    <% }) %>
  <% }) %>
  
</body>
</html>`;