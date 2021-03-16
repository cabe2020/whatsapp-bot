"use strict";

var request = require('request');

var fs = require('fs-extra');

var chalk = require('chalk');

var moment = require('moment-timezone');

moment.tz.setDefault('America/Argentina/Buenos_Aires').locale('id');
/**
 * Get text with color
 * @param  {String} text
 * @param  {String} color
 * @return  {String} Return text with color
 */

var color = function color(text, _color) {
  return !_color ? chalk.blueBright(text) : chalk.keyword(_color)(text);
}; // Message type Log


var messageLog = function messageLog(fromMe, type) {
  return updateJson('utils/stat.json', function (data) {
    fromMe ? data.sent[type] ? data.sent[type] += 1 : data.sent[type] = 1 : data.receive[type] ? data.receive[type] += 1 : data.receive[type] = 1;
    return data;
  });
};
/**
 * Get Time duration
 * @param  {Date} timestamp
 * @param  {Date} now
 */


var processTime = function processTime(timestamp, now) {
  // timestamp => timestamp when message was received
  return moment.duration(now - moment(timestamp * 1000)).asSeconds();
};
/**
 * is it url?
 * @param  {String} url
 */


var isUrl = function isUrl(url) {
  return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi));
}; // Message Filter / Message Cooldowns


var usedCommandRecently = new Set();
/**
 * Check is number filtered
 * @param  {String} from
 */

var isFiltered = function isFiltered(from) {
  return !!usedCommandRecently.has(from);
};
/**
 *Download any media from URL
 *@param {String} url
 *@param {Path} locate
 *@param {Callback} callback
 */


var download = function download(url, path, callback) {
  request.head(url, function () {
    request(url).pipe(fs.createWriteStream(path)).on('close', callback);
  });
};
/**
 * Add number to filter
 * @param  {String} from
 */


var addFilter = function addFilter(from) {
  usedCommandRecently.add(from);
  setTimeout(function () {
    return usedCommandRecently["delete"](from);
  }, 5000); // 5sec is delay before processing next command
};

module.exports = {
  msgFilter: {
    isFiltered: isFiltered,
    addFilter: addFilter
  },
  processTime: processTime,
  isUrl: isUrl,
  color: color,
  messageLog: messageLog,
  download: download
};