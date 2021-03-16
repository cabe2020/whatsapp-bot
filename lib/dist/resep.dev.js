"use strict";

var axios = require('axios');

var _require = require('promise'),
    resolve = _require.resolve,
    reject = _require.reject;

var resep = function resep(menu) {
  return regeneratorRuntime.async(function resep$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", new Promise(function (resolve, reject) {
            axios.get('https://masak-apa.tomorisakura.vercel.app/api/search/?q=' + menu).then(function _callee2(res) {
              var _ref, results, random;

              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return regeneratorRuntime.awrap(res.data);

                    case 2:
                      _ref = _context2.sent;
                      results = _ref.results;
                      random = Math.floor(Math.random() * 16);
                      axios.get('https://masak-apa.tomorisakura.vercel.app/api/recipe/' + results[random].key).then(function _callee(result) {
                        var _ref2, results, bahannya, bahan, tutornya, tutornih, tutor, hasil;

                        return regeneratorRuntime.async(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                _context.next = 2;
                                return regeneratorRuntime.awrap(result.data);

                              case 2:
                                _ref2 = _context.sent;
                                results = _ref2.results;
                                _context.next = 6;
                                return regeneratorRuntime.awrap("".concat(results.ingredient));

                              case 6:
                                bahannya = _context.sent;
                                bahan = bahannya.replace(/,/g, '\n');
                                _context.next = 10;
                                return regeneratorRuntime.awrap("".concat(results.step));

                              case 10:
                                tutornya = _context.sent;
                                tutornih = tutornya.replace(/,/g, '\n');
                                tutor = tutornih.replace(/.,/g, '\n');
                                hasil = "*Judul:* ".concat(results.title, "\n*Penulis:* ").concat(results.author.user, "\n*Rilis:* ").concat(results.author.datePublished, "\n*Level:* ").concat(results.dificulty, "\n*Waktu:* ").concat(results.times, "\n*Porsi:* ").concat(results.servings, "\n\n*Bahan-bahan:*\n").concat(bahan, "\n\n*Step-by-step:*\n").concat(tutor);
                                resolve(hasil);

                              case 15:
                              case "end":
                                return _context.stop();
                            }
                          }
                        });
                      });

                    case 6:
                    case "end":
                      return _context2.stop();
                  }
                }
              });
            })["catch"](function (err) {
              console.log(err);
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
  resep: resep
};