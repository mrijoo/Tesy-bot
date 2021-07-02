"use strict";

var chalk = require('chalk');

var moment = require('moment-timezone');

var updateJson = require('update-json-file');

moment.tz.setDefault('Asia/Jakarta').locale('id');
/**
 * Get text with color
 * @param  {String} text
 * @param  {String} color
 * @return  {String} Return text with color
 */

var color = function color(text, _color) {
  return !_color ? chalk.green(text) : chalk.keyword(_color)(text);
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
};

var isGiphy = function isGiphy(url) {
  return url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'));
};

var isMediaGiphy = function isMediaGiphy(url) {
  return url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'));
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
 * Add number to filter
 * @param  {String} from
 */


var addFilter = function addFilter(from) {
  usedCommandRecently.add(from);
  setTimeout(function () {
    return usedCommandRecently["delete"](from);
  }, 5000); // 5sec is delay before processing next command
}; // Message type Log


var messageLog = function messageLog(fromMe, type) {
  return updateJson('utils/stat.json', function (data) {
    fromMe ? data.sent[type] ? data.sent[type] += 1 : data.sent[type] = 1 : data.receive[type] ? data.receive[type] += 1 : data.receive[type] = 1;
    return data;
  });
};

module.exports = {
  msgFilter: {
    isFiltered: isFiltered,
    addFilter: addFilter
  },
  processTime: processTime,
  isUrl: isUrl,
  color: color,
  messageLog: messageLog
};