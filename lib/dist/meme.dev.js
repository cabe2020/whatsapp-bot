"use strict";

var _require = require('../utils/fetcher'),
    fetchJson = _require.fetchJson,
    fetchBase64 = _require.fetchBase64;

var fs = require('fs-extra');

var _JSON$parse = JSON.parse(fs.readFileSync('./settings/api.json')),
    apiSS = _JSON$parse.apiSS;
/**
 * Get meme from random subreddit
 *
 * @param  {String} _subreddit
 * @return  {Promise} Return meme from dankmemes, wholesomeanimemes, wholesomememes, AdviceAnimals, MemeEconomy, memes, terriblefacebookmemes, teenagers, historymemes
 */


var random = function random(_subreddit) {
  return regeneratorRuntime.async(function random$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            var subreddits = ['dankmemes', 'wholesomeanimemes', 'wholesomememes', 'AdviceAnimals', 'MemeEconomy', 'memes', 'terriblefacebookmemes', 'teenagers', 'historymemes', 'okbuddyretard', 'nukedmemes'];
            var randSub = subreddits[Math.random() * subreddits.length | 0];
            console.log('Buscando memes en' + randSub);
            fetchJson('https://meme-api.herokuapp.com/gimme/' + randSub).then(function (result) {
              return resolve(result.url);
            })["catch"](function (err) {
              console.error(err);
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
/**
 * create custom meme
 * @param  {String} imageUrl
 * @param  {String} topText
 * @param  {String} bottomText
 */


var custom = function custom(imageUrl, top, bottom) {
  return regeneratorRuntime.async(function custom$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            topText = top.trim().replace(/\s/g, '_').replace(/\?/g, '~q').replace(/\%/g, '~p').replace(/\#/g, '~h').replace(/\//g, '~s');
            bottomText = bottom.trim().replace(/\s/g, '_').replace(/\?/g, '~q').replace(/\%/g, '~p').replace(/\#/g, '~h').replace(/\//g, '~s');
            fetchBase64("https://api.memegen.link/images/custom/".concat(topText, "/").concat(bottomText, ".png?background=").concat(imageUrl), 'image/png').then(function (result) {
              return resolve(result);
            })["catch"](function (err) {
              console.error(err);
              reject(err);
            });
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var ss = function ss(url) {
  return regeneratorRuntime.async(function ss$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", new Promise(function (resolve, reject) {
            fetchBase64("https://api.apiflash.com/v1/urltoimage?access_key=".concat(apiSS, "&url=").concat(url)).then(function (res) {
              resolve(res);
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

module.exports = {
  random: random,
  custom: custom,
  ss: ss
};