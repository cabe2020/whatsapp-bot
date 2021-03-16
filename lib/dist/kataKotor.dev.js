"use strict";

var sastrawi = require('sastrawijs');

var kataKasar = ['anjing', 'kontol', 'memek', 'jembut' //Tambahin Sendiri
];

var inArray = function inArray(needle, haystack) {
  var length = haystack.length;

  for (var i = 0; i < length; i++) {
    if (haystack[i] == needle) return true;
  }

  return false;
};

module.exports = cariKasar = function cariKasar(kata) {
  return new Promise(function (resolve) {
    var sentence = kata;
    var stemmer = new sastrawi.Stemmer();
    var tokenizer = new sastrawi.Tokenizer();
    var words = tokenizer.tokenize(sentence);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = words[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        word = _step.value;

        if (inArray(stemmer.stem(word), kataKasar)) {
          resolve(true);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    resolve(false);
  });
};