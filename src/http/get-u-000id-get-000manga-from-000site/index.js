// learn more about HTTP functions here: https://arc.codes/primitives/http
const gin = require("gin-downloader");
const data = require('@begin/data')


exports.handler = async function http (req) {
  const { id: userid, manga, site } = req.pathParameters;
  const userSettings = (await data.get({table: 'users', key: userid})) || {};
  const mangaRecord = (await data.get({table: 'manga', key: manga})) || {};
  if((mangaRecord||{}).from === site) {
    if(userSettings[manga]) return respondWith(`User ${userid} already has this title.`);
    return respondWith(`We already have ${manga} in the database`);
  } else if((mangaRecord||{}).from !== undefined ) {
    const oldSite = mangaRecord.from;
    mangaRecord.from = site;
    await data.set({table: "manga", name: JSON.stringify(mangaDB)})
    return respondWith(`Switched ${manga} from ${oldSite} to ${site}.`)
  }
  userSettings[manga] = {};
  mangaRecord = mangaRecord || {
    from: site
  };
  const chapters = await gin[site].chapters(manga);
  const chapterNumbers = chapters.map(chapter => Number(chapter.chap_number)).filter(chapterNumber => chapterNumber > (mangaRecord.lastChapter || -1));
  const neededChapters = chapterNumbers.map(chapterNumber => gin[site].images(manga, chapterNumber));
  const retrievedChapters = await Promise.all(neededChapters);
  for(const chapter of retrievedChapters) {
    const chapterImages = await Promise.all(chapter);
    const imageUrls = await Promise.all(chapterImages.map(ci => ci.value));
    if(!mangaRecord.chapters) mangaRecord.chapters = {};
    const chapterNumber = chapterNumbers[retrievedChapters.indexOf(chapter)];
    mangaRecord.chapters[chapterNumber] = imageUrls.map(i => i.src);
    mangaRecord.lastChapter = chapterNumber;
    break;
  }
  await data.set({table: "manga", key: manga, data: JSON.stringify(mangaRecord)})
  await data.set({table: "users", key: userid, settings: JSON.stringify(userSettings)})
  return respondWith("done");
}

function respondWith(msg) {
  return {
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: msg
  }
}