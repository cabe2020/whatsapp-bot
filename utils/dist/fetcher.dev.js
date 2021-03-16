"use strict";

var fetch = require('node-fetch');

var FormData = require('form-data');

var fs = require('fs');

var _require = require('file-type'),
    fromBuffer = _require.fromBuffer;

var resizeImage = require('./imageProcessing');
/**
 *Fetch Json from Url
 *
 *@param {String} url
 *@param {Object} options
 */


var fetchJson = function fetchJson(url, options) {
  return new Promise(function (resolve, reject) {
    return fetch(url, options).then(function (response) {
      return response.json();
    }).then(function (json) {
      return resolve(json);
    })["catch"](function (err) {
      console.error(err);
      reject(err);
    });
  });
};
/**
 * Fetch Text from Url
 *
 * @param {String} url
 * @param {Object} options
 */


var fetchText = function fetchText(url, options) {
  return new Promise(function (resolve, reject) {
    return fetch(url, options).then(function (response) {
      return response.text();
    }).then(function (text) {
      return resolve(text);
    })["catch"](function (err) {
      console.error(err);
      reject(err);
    });
  });
};
/**
 * Fetch base64 from url
 * @param {String} url
 */


var fetchBase64 = function fetchBase64(url, mimetype) {
  return new Promise(function (resolve, reject) {
    console.log('Get base64 from:', url);
    return fetch(url).then(function (res) {
      var _mimetype = mimetype || res.headers.get('content-type');

      res.buffer().then(function (result) {
        return resolve("data:".concat(_mimetype, ";base64,") + result.toString('base64'));
      });
    })["catch"](function (err) {
      console.error(err);
      reject(err);
    });
  });
};
/**
 * Upload Image to Telegra.ph
 *
 * @param  {String} base64 image buffer
 * @param  {Boolean} resize
 */


var uploadImages = function uploadImages(buffData, type) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(function _callee(resolve, reject) {
    var _ref, ext, filePath, _buffData;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(fromBuffer(buffData));

          case 2:
            _ref = _context.sent;
            ext = _ref.ext;
            filePath = 'utils/tmp.' + ext;

            if (!type) {
              _context.next = 11;
              break;
            }

            _context.next = 8;
            return regeneratorRuntime.awrap(resizeImage(buffData, false));

          case 8:
            _context.t0 = _context.sent;
            _context.next = 12;
            break;

          case 11:
            _context.t0 = buffData;
break
          case 12:
            _buffData = _context.t0;
            fs.writeFile(filePath, _buffData, {
              encoding: 'base64'
            }, function (err) {
              if (err) return reject(err);
              console.log('Uploading image to telegra.ph server...');
              var fileData = fs.readFileSync(filePath);
              var form = new FormData();
              form.append('file', fileData, 'tmp.' + ext);
              fetch('https://telegra.ph/upload', {
                method: 'POST',
                body: form
              }).then(function (res) {
                return res.json();
              }).then(function (res) {
                if (res.error) return reject(res.error);
                resolve('https://telegra.ph' + res[0].src);
              }).then(function () {
                return fs.unlinkSync(filePath);
              })["catch"](function (err) {
                return reject(err);
              });
            });
break
          case 14:
          case "end":
            return _context.stop();
        }
      }
    });
  });
};

module.exports = {
  fetchJson: fetchJson,
  fetchText: fetchText,
  fetchBase64: fetchBase64,
  uploadImages: uploadImages
};