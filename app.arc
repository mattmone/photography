@app
begin-app

@http
get  /user/:id/search/:query
get  /user/:id/get/:manga/from/:site
get  /user/:id
post /todos
post /todos/delete

@tables
users
  userid *String
manga
  name *String