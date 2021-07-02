const fs = require('fs')
const axios = require('axios')
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
            const judul = (`*Update Data Covid-19 ${data.country}*`)
            const positif = ('\n\n😷 *Positif :* ' + data.cases)
            const todaypositif = ('\n😷 *Hari ini :* ' + data.todayCases)
            const meninggal = ('\n☠ *Meninggal :* ' + data.deaths)
            const todaymeninggal = ('\n☠ *Hari ini :* ' + data.todayDeaths)
            const sembuh = ('\n☺ *Sembuh :* ' + data.recovered)
            const kata = ('\n\nTetap jaga kesehatan dan ikuti protokol kesehatan\n_#STAYATHOME #PAKAIMASKER_')
            const hasil = judul + positif + todaypositif + meninggal + todaymeninggal + sembuh + kata
            resolve(hasil)
        })
        .catch(err => {
            reject(err)
        })
})