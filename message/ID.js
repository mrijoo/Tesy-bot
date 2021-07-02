const fs = require('fs')
let { general } = JSON.parse(fs.readFileSync('./settings.json'))
let prefix = general.prefix

exports.textAbout = () => {
    return `
*About*
Bot developed by *izo*.
Bot open source https://github.com/mrijoo/Tesy-bot
`
}

exports.textMenu = (pushname) => {
    return `
Hi, ${pushname} 👋️
Berikut adalah beberapa fitur yang ada pada bot ini!

*${prefix}stiker* [teks/url]
*${prefix}simi* on/off
*${prefix}gtts* [kode negara] [teks]
*${prefix}kodebahasa*
*${prefix}infogempa*
*${prefix}gempadirasakan*
*${prefix}ssweb* [url]
*${prefix}covid* [negara]
*${prefix}kalkulator* [perhitungan]
*${prefix}teksalay* [teks]
*${prefix}artinama* [nama]
*${prefix}artimimpi* [kata kunci mimpi]
*${prefix}cocok?* [nama mu] & [nama pasangan]
*${prefix}ping*
*${prefix}about*

`
}

exports.textKodeBahasa = () => {
    return `
*Kode Bahasa*
af: Afrikaans        sq: Albanian
am: Amharic          ar: Arabic
hy: Armenian         az: Azerbaijani
eu: Basque           be: Belarusian
bn: Bengali          bs: Bosnian
bg: Bulgarian        ca: Catalan
ceb: Cebuano         ny: Chichewa
co: Corsican         hr: Croatian
cs: Czech            da: Danish
nl: Dutch            en: English
eo: Esperanto        et: Estonian
tl: Filipino         fi: Finnish
fr: French           fy: Frisian
gl: Galician         ka: Georgian
de: German           el: Greek
gu: Gujarati         ht: Haitian Creole
ha: Hausa            haw: Hawaiian
iw: Hebrew           hi: Hindi
hmn: Hmong           hu: Hungarian
is: Icelandic        ig: Igbo
id: Indonesian       ga: Irish
it: Italian          ja: Japanese
jw: Javanese         kn: Kannada
kk: Kazakh           km: Khmer
ko: Korean           ku: Kurdish 
ky: Kyrgyz           lo: Lao
la: Latin            lv: Latvian
lt: Lithuanian       lb: Luxembourgish
mk: Macedonian       mg: Malagasy
ms: Malay            ml: Malayalam
mt: Maltese          mi: Maori
mr: Marathi          mn: Mongolian
my: Myanmar          ne: Nepali
no: Norwegian        ps: Pashto
fa: Persian          pl: Polish
pt: Portuguese       ma: Punjabi
ro: Romanian         ru: Russian
sm: Samoan           gd: Scots Gaelic
sr: Serbian          st: Sesotho
sn: Shona            sd: Sindhi
si: Sinhala          sk: Slovak
sl: Slovenian        so: Somali
es: Spanish          su: Sundanese
sw: Swahili          sv: Swedish
tg: Tajik            ta: Tamil
te: Telugu           th: Thai
tr: Turkish          uk: Ukrainian
ur: Urdu             uz: Uzbek
vi: Vietnamese       cy: Welsh
xh: Xhosa            yi: Yiddish
yo: Yoruba           zu: Zulu
`
}