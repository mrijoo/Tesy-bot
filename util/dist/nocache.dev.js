"use strict";

var path = require('path');

var fs = require('fs');

var NOCache = function NOCache(session) {
  return new Promise(function (resolve, reject) {
    /**
     * Uncache if there is file change
     * @param {string} module Module name or path
     * @param {function} cb <optional> 
     */
    var nocache = function nocache(module) {
      var call = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
      console.log(color('[WATCH]', 'orange'), color("=> '".concat(module, "'"), 'yellow'));
      fs.watchFile(require.resolve(module), function _callee() {
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return regeneratorRuntime.awrap(uncache(require.resolve(module)));

              case 2:
                call(module);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        });
      });
    };
    /**
     * Uncache a module
     * @param {string} module Module name or path
     */


    var uncache = function uncache() {
      var module = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.';
      return new Promise(function (resolve, reject) {
        try {
          delete require.cache[require.resolve(module)];
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    };


    var namedir = ["./", "../", "../lib"];
    var namefiles = [];

    var _loop = function _loop(i) {
      var directoryPath = path.join(__dirname, namedir[i]);
      fs.readdir(directoryPath, function _callee2(err, files) {
        return regeneratorRuntime.async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!err) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", console.log('Unable to scan directory: ' + err));

              case 2:
                files.forEach(function (file) {
                  if (file.match(".js")) {
                    //console.log(file);
                    namefiles.push(file);
                  }
                });
                _context2.next = 5;
                return regeneratorRuntime.awrap(ctk(namedir[i]));

              case 5:
                namefiles.length = 0;

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        });
      });
    };

    for (var i = 0; i < namedir.length; i++) {
      _loop(i);
    }

    function ctk(dir) {
      for (var _i = 0; _i < namefiles.length; _i++) {
        if (!namefiles[_i].match("".concat(session, ".data.json"))) {
          if (!namefiles[_i].match("stat.json")) {
            nocache("".concat(dir, "/").concat(namefiles[_i]), function (module) {
              return console.log("'".concat(module, "'"));
            });
          }
        }
      }
    }
  });
};

module.exports = NOCache;