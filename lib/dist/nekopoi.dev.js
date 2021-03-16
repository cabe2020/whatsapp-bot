/**
 * @author cabe2020 <elmorochito02@gmail.com>                                                                                                                                                                            <https://github.com/ArugaZ/whatsapp-bot>
 * @license MIT
 */
"use strict";

var axios = require('axios');

var cheerio = require('cheerio');

function getLatest() {
  return new Promise(function (resolve, reject) {
    //<https://github.com/ArugaZ/whatsapp-bot>
    var url = 'http://nekopoi.care';
    axios.get(url).then(function (req) {
      var title = [];
      var link = [];
      var image = [];
      var data = {};
      var soup = cheerio.load(req.data);
      soup('div.eropost').each(function (i, e) {
        soup(e).find('h2').each(function (j, s) {
          title.push(url + soup(s).find('a').text().trim());
          link.push(url + soup(s).find('a').attr('href'));
        });
        image.push(url + soup(e).find('img').attr('src'));
      });

      if (data == undefined) {
        reject('No Result:(');
      } else {
        var i = Math.floor(Math.random() * title.length);
        var hehe = {
          "title": title[i],
          "image": image[i],
          "link": link[i]
        };
        resolve(hehe);
      }
    });
  });
}
/**
 * @author cabe2020 <elmorochito02@gmail.com>                                                                                                                                                                            <https://github.com/ArugaZ/whatsapp-bot>
 * @license MIT
 */


function getVideo(url) {
  return new Promise(function (resolve, reject) {
    //<https://github.com/ArugaZ/whatsapp-bot>
    axios.get(url).then(function (req) {
      try {
        var links = [];
        var soup = cheerio.load(req.data);
        var title = soup("title").text();
        soup('div.liner').each(function (i, e) {
          soup(e).find('div.listlink').each(function (j, s) {
            soup(s).find('a').each(function (p, q) {
              links.push(soup(q).attr('href'));
            });
          });
        });
        var data = {
          "title": title,
          "links": links
        };
        resolve(data);
      } catch (err) {
        reject('Error : ' + err);
      }
    });
  });
}

module.exports = {
  getLatest: getLatest,
  getVideo: getVideo
};