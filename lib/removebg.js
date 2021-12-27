const fs = require('fs')
let { apikey } = JSON.parse(fs.readFileSync('./settings.json'))
const { removeBackgroundFromImageBase64 } = require('remove.bg')

/**
 * Remove Image Background
 *
 * @param  {String} base64img
 */

const removebg = async (base64img) => new Promise(async (resolve, reject) => {
    await removeBackgroundFromImageBase64({
        base64img,
        apiKey: apikey.removebg,
        size: 'auto',
        type: 'auto',
    }).then((result) => {
        resolve(result.base64img)
    }).catch((err) => {
        reject(err)
    });
})

module.exports = removebg;