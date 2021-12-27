const path = require('path');
const fs = require('fs');

const NOCache = (session) => new Promise((resolve, reject) => {
    const nocache = (module, call = () => {}) => {
        fs.watchFile(require.resolve(module), async () => {
            await uncache(require.resolve(module))
            call(module)
        })
    }
    const uncache = (module = '.') => {
        return new Promise((resolve, reject) => {
            try {
                delete require.cache[require.resolve(module)]
                resolve()
            } catch (err) {
                reject(err)
            }
        })
    }

    const namedir = ["./", "../", "../lib", "../media", "../message"];
    const namefiles = [];

    for (let i = 0; i < namedir.length; i++) {
        const directoryPath = path.join(__dirname, namedir[i]);
        fs.readdir(directoryPath, async function (err, files) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            files.forEach(function (file) {
                if (file.match(".js")) {
                    namefiles.push(file)
                }
            });
            await ctk(namedir[i])
            namefiles.length = 0;
        });
    }

    function ctk(dir) {
        for (let i = 0; i < namefiles.length; i++) {
            if (!namefiles[i].match(`${session}.data.json`)) {
                if (!namefiles[i].match(`stat.json`)) {
                    nocache(`${dir}/${namefiles[i]}`)
                }
            }
        }
    }

})
module.exports = NOCache;