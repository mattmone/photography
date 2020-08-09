@app
begin-app

@http
get  /user/:userid/search/:query
get  /user/:userid/get/:manga/from/:site
get  /user/:userid
post /todos
post /todos/delete

@tables
users
  userid *String
manga
  name *String