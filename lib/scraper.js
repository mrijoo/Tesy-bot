const fs = require('fs')
const axios = require('axios')
const request = require('request')
const fetch = require('node-fetch')
const {
    fetchBase64
} = require('../util/fetcher')
let {
    apikey
} = JSON.parse(fs.readFileSync('./settings.json'))

exports.apiflash = async (url) => new Promise((resolve, reject) => {
    fetchBase64(`https://api.apiflash.com/v1/urltoimage?access_key=${apikey.apiflash}&url=${url}`)
        .then((res) => {
            resolve(res)
        })
        .catch((err) => {
            reject(err)
        })
})

exports.covid = (negera) => new Promise(async (resolve, reject) => {
    const covid = `https://coronavirus-19-api.herokuapp.com/countries/${negera}`
    axios.get(covid, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            const data = res.data
            if (!data.country == undefined) {
                const judul = (`*Update Data Covid-19 ${data.country}*`)
                const positif = ('\n\n😷 *Positif :* ' + data.cases)
                const todaypositif = ('\n😷 *Hari ini :* ' + data.todayCases)
                const meninggal = ('\n☠ *Meninggal :* ' + data.deaths)
                const todaymeninggal = ('\n☠ *Hari ini :* ' + data.todayDeaths)
                const sembuh = ('\n☺ *Sembuh :* ' + data.recovered)
                const kata = ('\n\nTetap jaga kesehatan dan ikuti protokol kesehatan\n_#STAYATHOME #PAKAIMASKER_')
                const hasil = judul + positif + todaypositif + meninggal + todaymeninggal + sembuh + kata
                resolve(hasil)
            } else {
                resolve(`data dari negara *${negera}* tidak ditemukan`)
            }
        })
        .catch(err => {
            reject(err)
        })
})

exports.meme = async (imgbs64, txt) => new Promise((resolve, reject) => {
    const options = {
        method: 'POST',
        url: 'https://izo.my.id/b64img/index.php',
        headers: {
            'content-type': 'application/json'
        },
        form: {
            image: imgbs64
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error)
        TextC = txt.trim().replace(/\s/g, '_').replace(/\?/g, '~q').replace(/\%/g, '~p').replace(/\#/g, '~h').replace(/\//g, '~s')
        fetchBase64(`https://api.memegen.link/images/custom/%E2%80%8E/${TextC}.png?background=https://izo.my.id/b64img/image/${response.body}`, 'image/png')
            .then((result) => resolve(result))
            .catch((err) => {
                console.error(err)
                reject(err)
            })
    })
})

exports.urlShortener = (url) => new Promise((resolve, reject) => {
    console.log('Creating short url...')
    fetch(`https://tinyurl.com/api-create.php?url=${url}`)
        .then(response => response.text())
        .then(json => {
            resolve(json)
        })
        .catch((err) => {
            reject(err)
        })
})