// learn more about HTTP functions here: https://arc.codes/primitives/http
const gin = require("gin-downloader");
const ejs = require("ejs");
const template = require("./search")

exports.handler = async function http (req) {
  const { query, userid } = req.pathParameters;
  const searches = ["mangapanda","mangahere","mangafox","kissmanga","batoto"].map(site => gin[site].filter({name: query}))
  const results = await Promise.all(searches);
  const manga = {
    mangapanda: await Promise.all(results[0].results.map(retrieveURLify.bind({userid, site:"mangapanda"}))),
    mangahere: await Promise.all(results[1].results.map(retrieveURLify.bind({userid, site:"mangahere"}))),
    mangafox: await Promise.all(results[2].results.map(retrieveURLify.bind({userid, site:"mangafox"}))),
    kissmanga: await Promise.all(results[3].results.map(retrieveURLify.bind({userid, site:"kissmanga"})))
  };

  return {
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: ejs.render(template, {manga, query})
  }
}

async function retrieveURLify(manga) {
  if(!manga.name) return false;
  manga.details = await gin[this.site].infoChapters(manga.name);
  manga.details.latestChapter = manga.details.chapters[manga.details.chapters.length-1];
  delete manga.details.chapters;
  manga.getUrl = `/user/${this.userid}/get/${manga.name}/from/${this.site}`;
  return manga
}