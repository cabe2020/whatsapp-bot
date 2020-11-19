"use strict";

var axios = require('axios');

var insta = function insta(url) {
  return regeneratorRuntime.async(function insta$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            axios.get("".concat(link, "/api/ig?url=").concat(url)).then(function (res) {
              resolve(res.data.result);
            })["catch"](function (err) {
              reject(err);
            });
          }));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};
/* eslint-disable prefer-promise-reject-errors */


var _require = require('tiktok-scraper'),
    getVideoMeta = _require.getVideoMeta;

var _require2 = require('../utils/fetcher'),
    fetchJson = _require2.fetchJson;

var _require3 = require('util'),
    promisify = _require3.promisify;

var _require4 = require('video-url-link'),
    instagram = _require4.instagram,
    twitter = _require4.twitter;

var igGetInfo = promisify(instagram.getInfo);
var twtGetInfo = promisify(twitter.getInfo);
/**
 * Get Tiktok Metadata
 *
 * @param  {String} url
 */

var tiktok = function tiktok(url) {
  return new Promise(function (resolve, reject) {
    console.log('Get metadata from =>', url);
    getVideoMeta(url, {
      noWaterMark: true,
      hdVideo: true
    }).then(function _callee(result) {
      return regeneratorRuntime.async(function _callee$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log('Get Video From', '@' + result.authorMeta.name, 'ID:', result.id);

              if (result.videoUrlNoWaterMark) {
                result.url = result.videoUrlNoWaterMark;
                result.NoWaterMark = true;
              } else {
                result.url = result.videoUrl;
                result.NoWaterMark = false;
              }

              resolve(result);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      });
    })["catch"](function (err) {
      console.error(err);
      reject(err);
    });
  });
};
/**
 * Get Twitter Metadata
 *
 * @param  {String} url
 */


var tweet = function tweet(url) {
  return new Promise(function (resolve, reject) {
    console.log('Get metadata from =>', url);
    twtGetInfo(url, {}).then(function (content) {
      return resolve(content);
    })["catch"](function (err) {
      console.error(err);
      reject(err);
    });
  });
};
/**
 * Get Facebook Metadata
 *
 * @param  {String} url
 */


var facebook = function facebook(url) {
  return new Promise(function (resolve, reject) {
    console.log('Get metadata from =>', url);
    var apikey = 'sxoG2J4ueHdok5Ax9ZJkARprPmSMFKepILq6EIZTSY2Z9C6mVl';
    fetchJson('http://keepsaveit.com/api/?api_key=' + apikey + '&url=' + url, {
      method: 'GET'
    }).then(function (result) {
      var key = result.code;

      switch (key) {
        case 212:
          return reject('Access block for you, You have reached maximum 5 limit per minute hits, please stop extra hits.');

        case 101:
          return reject('API Key error : Your access key is wrong');

        case 102:
          return reject('Your Account is not activated.');

        case 103:
          return reject('Your account is suspend for some resons.');

        case 104:
          return reject('API Key error : You have not set your api_key in parameters.');

        case 111:
          return reject('Full access is not allow with DEMO API key.');

        case 112:
          return reject('Sorry, Something wrong, or an invalid link. Please try again or check your url.');

        case 113:
          return reject('Sorry this website is not supported.');

        case 404:
          return reject('The link you followed may be broken, or the page may have been removed.');

        case 405:
          return reject('You can\'t download media in private profile. Looks like the video you want to download is private and it is not accessible from our server.');

        default:
          return resolve(result);
      }
    })["catch"](function (err) {
      console.error(err);
      reject(err);
    });
  });
};

var ytmp3 = function ytmp3(url) {
  return regeneratorRuntime.async(function ytmp3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", new Promise(function (resolve, reject) {
            axios.get("".concat(link, "https://arugaz.herokuapp.com/api/yta?url=").concat(url)).then(function (res) {
              resolve(res.data.result);
            })["catch"](function (err) {
              reject(err);
            });
          }));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var ytmp4 = function ytmp4(url) {
  return regeneratorRuntime.async(function ytmp4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", new Promise(function (resolve, reject) {
            axios.get("".concat(link, "https://arugaz.herokuapp.com/api/ytv?url=").concat(url)).then(function (res) {
              resolve("".concat(res.data.result));
            })["catch"](function (err) {
              reject(err);
            });
          }));

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var stalkig = function stalkig(url) {
  return regeneratorRuntime.async(function stalkig$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", new Promise(function (resolve, reject) {
            axios.get("".concat(link, "https://arugaz.herokuapp.com/api/stalk?username=").concat(url)).then(function (res) {
              var text = "user: ".concat(res.data.Username, "\nname: ").concat(res.data.Name, "\nbio: ").concat(res.data.Biodata, "\nfollower: ").concat(res.data.Jumlah_Followers, "\nfollowing: ").concat(res.data.Jumlah_Following, "\npost: ").concat(res.data.Jumlah_Post);
              resolve(text);
            })["catch"](function (err) {
              reject(err);
            });
          }));

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var stalkigpict = function stalkigpict(url) {
  return regeneratorRuntime.async(function stalkigpict$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.abrupt("return", new Promise(function (resolve, reject) {
            axios.get("".concat(link, "https://arugaz.herokuapp.com/api/stalk?username=").concat(url)).then(function (res) {
              resolve(res.data.Profile_pic);
            })["catch"](function (err) {
              reject(err);
            });
          }));

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
};

var quote = function quote() {
  return regeneratorRuntime.async(function quote$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          return _context7.abrupt("return", new Promise(function (resolve, reject) {
            axios.get("".concat(link, "https://arugaz.herokuapp.com/api/randomquotes")).then(function (res) {
              var text = "Author: ".concat(res.data.author, "\n\nQuote: ").concat(res.data.quotes);
              resolve(text);
            })["catch"](function (err) {
              reject(err);
            });
          }));

        case 1:
        case "end":
          return _context7.stop();
      }
    }
  });
};

var wiki = function wiki(url) {
  return regeneratorRuntime.async(function wiki$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          return _context8.abrupt("return", new Promise(function (resolve, reject) {
            axios.get("".concat(link, "http://es.wikipedia.org/w/api.php?format=json&action=query").concat(url)).then(function (res) {
              resolve(res.data.result);
            })["catch"](function (err) {
              reject(err);
            });
          }));

        case 1:
        case "end":
          return _context8.stop();
      }
    }
  });
};

var daerah = function daerah() {
  return regeneratorRuntime.async(function daerah$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          return _context9.abrupt("return", new Promise(function (resolve, reject) {
            axios.get("".concat(link, "https://arugaz.herokuapp.com/daerah")).then(function (res) {
              resolve(res.data.result);
            })["catch"](function (err) {
              reject(err);
            });
          }));

        case 1:
        case "end":
          return _context9.stop();
      }
    }
  });
};

var jadwaldaerah = function jadwaldaerah(url) {
  return regeneratorRuntime.async(function jadwaldaerah$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          return _context10.abrupt("return", new Promise(function (resolve, reject) {
            axios.get("".concat(link, "https://arugaz.herokuapp.com/api/jadwalshalat?daerah=").concat(url)).then(function (res) {
              var text = "Jadwal Sholat ".concat(url, "\n\nsubuh: ").concat(res.data.Subuh, "\ndzuhur: ").concat(res.data.Dzuhur, "\nashar: ").concat(res.data.Ashar, "\nmaghrib: ").concat(res.data.Maghrib, "\nisya: ").concat(res.data.Isya);
              resolve(text);
            })["catch"](function (err) {
              reject(err);
            });
          }));

        case 1:
        case "end":
          return _context10.stop();
      }
    }
  });
};

var cuaca = function cuaca(url) {
  return regeneratorRuntime.async(function cuaca$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          return _context11.abrupt("return", new Promise(function (resolve, reject) {
            axios.get("".concat(link, "https://arugaz.herokuapp.com/api/cuaca?q=").concat(url)).then(function (res) {
              var text = "Cuaca di: ".concat(res.data.result.tempat, "\n\ncuaca: ").concat(res.data.result.cuaca, "\nangin: ").concat(res.data.result.anign, "\ndesk: ").concat(res.data.result.desk, "\nlembab: ").concat(res.data.result.kelembapan, "\nsuhu: ").concat(res.data.result.suhu, "\nudara: ").concat(res.data.result.udara);
              resolve(text);
            })["catch"](function (err) {
              reject(err);
            });
          }));

        case 1:
        case "end":
          return _context11.stop();
      }
    }
  });
};

var chord = function chord(url) {
  return regeneratorRuntime.async(function chord$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          return _context12.abrupt("return", new Promise(function (resolve, reject) {
            axios.get("".concat(link, "https://arugaz.herokuapp.com/api/chord?q=").concat(url)).then(function (res) {
              resolve(res.data.result);
            })["catch"](function (err) {
              reject(err);
            });
          }));

        case 1:
        case "end":
          return _context12.stop();
      }
    }
  });
};

var tulis = function tulis(teks) {
  return regeneratorRuntime.async(function tulis$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          return _context13.abrupt("return", new Promise(function (resolve, reject) {
            axios.get("".concat(link, "https://arugaz.herokuapp.com/api/nulis?text=").concat(encodeURIComponent(teks))).then(function (res) {
              resolve("".concat(res.data.result));
            })["catch"](function (err) {
              reject(err);
            });
          }));

        case 1:
        case "end":
          return _context13.stop();
      }
    }
  });
};

var randomNimek = function randomNimek(type) {
  var url, nsfw, resultNsfw, hentai, resultHentai, anime, resultNime, neko, resultNeko, trap, resultTrap;
  return regeneratorRuntime.async(function randomNimek$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          url = 'https://api.computerfreaker.cf/v1/';
          _context14.t0 = type;
          _context14.next = _context14.t0 === 'nsfw' ? 4 : _context14.t0 === 'hentai' ? 14 : _context14.t0 === 'anime' ? 24 : _context14.t0 === 'neko' ? 34 : _context14.t0 === 'trap' ? 44 : 54;
          break;

        case 4:
          _context14.next = 6;
          return regeneratorRuntime.awrap(fetch(url + 'nsfwneko'));

        case 6:
          nsfw = _context14.sent;

          if (nsfw.ok) {
            _context14.next = 9;
            break;
          }

          throw new Error("unexpected response ".concat(nsfw.statusText));

        case 9:
          _context14.next = 11;
          return regeneratorRuntime.awrap(nsfw.json());

        case 11:
          resultNsfw = _context14.sent;
          return _context14.abrupt("return", resultNsfw.url);

        case 14:
          _context14.next = 16;
          return regeneratorRuntime.awrap(fetch(url + 'hentai'));

        case 16:
          hentai = _context14.sent;

          if (hentai.ok) {
            _context14.next = 19;
            break;
          }

          throw new Error("unexpected response ".concat(hentai.statusText));

        case 19:
          _context14.next = 21;
          return regeneratorRuntime.awrap(hentai.json());

        case 21:
          resultHentai = _context14.sent;
          return _context14.abrupt("return", resultHentai.url);

        case 24:
          _context14.next = 26;
          return regeneratorRuntime.awrap(fetch(url + 'anime'));

        case 26:
          anime = _context14.sent;

          if (anime.ok) {
            _context14.next = 29;
            break;
          }

          throw new Error("unexpected response ".concat(anime.statusText));

        case 29:
          _context14.next = 31;
          return regeneratorRuntime.awrap(anime.json());

        case 31:
          resultNime = _context14.sent;
          return _context14.abrupt("return", resultNime.url);

        case 34:
          _context14.next = 36;
          return regeneratorRuntime.awrap(fetch(url + 'neko'));

        case 36:
          neko = _context14.sent;

          if (neko.ok) {
            _context14.next = 39;
            break;
          }

          throw new Error("unexpected response ".concat(neko.statusText));

        case 39:
          _context14.next = 41;
          return regeneratorRuntime.awrap(neko.json());

        case 41:
          resultNeko = _context14.sent;
          return _context14.abrupt("return", resultNeko.url);

        case 44:
          _context14.next = 46;
          return regeneratorRuntime.awrap(fetch(url + 'trap'));

        case 46:
          trap = _context14.sent;

          if (trap.ok) {
            _context14.next = 49;
            break;
          }

          throw new Error("unexpected response ".concat(trap.statusText));

        case 49:
          _context14.next = 51;
          return regeneratorRuntime.awrap(trap.json());

        case 51:
          resultTrap = _context14.sent;
          return _context14.abrupt("return", resultTrap.url);

        case 54:
        case "end":
          return _context14.stop();
      }
    }
  });
};

module.exports = {
  insta: insta,
  tiktok: tiktok,
  facebook: facebook,
  tweet: tweet,
  ytmp3: ytmp3,
  ytmp4: ytmp4,
  stalkig: stalkig,
  stalkigpict: stalkigpict,
  quote: quote,
  wiki: wiki,
  daerah: daerah,
  jadwaldaerah: jadwaldaerah,
  cuaca: cuaca,
  chord: chord,
  tulis: tulis,
  randomNimek: randomNimek
};