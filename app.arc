@app
begin-app

@http
get  /u/:id/search/:query
get  /u/:id/get/:manga/from/:site
get  /u/:id/get/:ma/chapter/:ch
get  /u/:id

@tables
users
  userid *String
manga
  name *String