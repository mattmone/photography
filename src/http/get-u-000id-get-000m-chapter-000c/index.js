// learn more about HTTP functions here: https://arc.codes/primitives/http
const data = require('@begin/data')


exports.handler = async function http (req) {
  const { id: userid, m: manga, c: chapter } = req.pathParameters;
  const userSettings = (await data.get({table: 'users', key: userid})) || {};
  const mangaRecord = (await data.get({table: 'manga', key: manga}));
  if(!mangaRecord) return respondWith(JSON.stringify({failure: `no manga found with name ${manga}`}))

  const selectedChapter = mangaRecord.chapters[chapter];
  if(!selectedChapter) return respondWith(JSON.stringify({failure: ``}))
  if(!userSettings[manga]) userSettings[manga] = {};
  userSettings[manga].chapter = chapter;
  
  await data.set({table: "users", key: userid, data: JSON.stringify(userSettings)}).catch(err => err)
  return respondWith(JSON.stringify(chapter));
}

function respondWith(msg) {
  return {
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'application/json; charset=utf8'
    },
    body: msg
  }
}