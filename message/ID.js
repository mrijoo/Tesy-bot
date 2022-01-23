exports.isReg = () => {
    return `Kamu sudah terdaftar`
}

exports.notReg = (prefix, private) => {
    if (private) {
        return `Kamu belum terdaftar. Kirim *${prefix}daftar* untuk mendaftar`
    } else {
        return `Kamu belum terdaftar. Kirim *${prefix}daftar* diprivate chat untuk mendaftar`
    }
}

exports.wait = () => {
    return `Mohon tunggu sebentar...`
}

exports.isPrivate = () => {
    return `Gagal, perintah ini hanya dapat digunakan diprivate chat`
}

exports.textAbout = () => {
    return `
*About*
Bot developed by *izo*.
untuk lebih lengkapnya di mrijoo.net
`
}

exports.textMenu = (pushname, prefix) => {
    return `
Hi, ${pushname} 👋️
Berikut adalah beberapa fitur yang ada pada bot ini!

*${prefix}prefix* [prefix]
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
*${prefix}totext* [gambar]
*${prefix}play* [lagu]
*${prefix}motivasi*
*${prefix}wame*
*${prefix}ping*
*${prefix}about*

`
}

exports.textMenuSCH = (pushname, prefix) => {
    return `
Hi, ${pushname} 👋️
Berikut adalah beberapa fitur yang ada pada bot ini!

*${prefix}absen* [pesan]
Untuk membuat list absensi baru. 
Penggunaan: ${prefix}absen Pagi semua absen yuk

*${prefix}hadir* [pesan]
Untuk mengisi daftar kehadiran di list absensi. 
Penggunaan: ${prefix}hadir _Hadir

*${prefix}absensi* / *${prefix}listabsensi*
Untuk mengecek hasil list absensi. 
Penggunaan: ${prefix}listabsensi

*${prefix}prefix* [prefix baru]
Untuk menganti prefix. 
Penggunaan: ${prefix}prefix ,

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

exports.textReg = (NomorWA, UserData, prefix, RegMed, mysqlJM) => {
    if (RegMed == 'json') {
        const jumlahmember = Object.keys(UserData.user).length
        const sekolah = UserData.user[`${NomorWA}`].profile.sekolah === undefined
        if (!sekolah) {
            const status = UserData.user[`${NomorWA}`].profile.sekolah.status
            let pgskls = UserData.user[`${NomorWA}`].profile.sekolah.penguruskelas
            if (status === "Siswa") {
                (pgskls) ? pgskls = "Pengurus kelas": pgskls = "Bukan Pengurus kelas"
                return `
Pendaftaran @${NomorWA.replace(/[@c.us]/g, '')} berhasil pada ${UserData.user[`${NomorWA}`].pendaftaran.tanggal} jam ${UserData.user[`${NomorWA}`].pendaftaran.jam}
₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋
Nomor: ${NomorWA.replace('@c.us', '')}
Nama: ${UserData.user[`${NomorWA}`].profile.nama}
Asal: ${UserData.user[`${NomorWA}`].profile.asal}
Tanggal lahir: ${UserData.user[`${NomorWA}`].profile.tgllhr}
Sekolah: ${UserData.user[`${NomorWA}`].profile.sekolah.nama}
Kelas: ${UserData.user[`${NomorWA}`].profile.sekolah.kelas}
Absen: ${UserData.user[`${NomorWA}`].profile.sekolah.absen}
Status: ${pgskls}

⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻
Untuk menggunakan bot silahkan kirim *${prefix}menu*
Total Pengguna yang telah terdaftar ${jumlahmember}
`
            } else if (status === "Guru") {
                return `
Pendaftaran @${NomorWA.replace(/[@c.us]/g, '')} berhasil pada ${UserData.user[`${NomorWA}`].pendaftaran.tanggal} jam ${UserData.user[`${NomorWA}`].pendaftaran.jam}
₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋
Nomor: ${NomorWA.replace('@c.us', '')}
Nama: ${UserData.user[`${NomorWA}`].profile.nama}
Asal: ${UserData.user[`${NomorWA}`].profile.asal}
Tanggal lahir: ${UserData.user[`${NomorWA}`].profile.tgllhr}
Sekolah: ${UserData.user[`${NomorWA}`].profile.sekolah.nama}
Kelas: ${UserData.user[`${NomorWA}`].profile.sekolah.kelas}
⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻
Untuk menggunakan bot silahkan kirim *${prefix}menu*
Total Pengguna yang telah terdaftar ${jumlahmember}
`
            }
        } else {
            return `
Pendaftaran @${NomorWA.replace(/[@c.us]/g, '')} berhasil pada ${UserData.user[`${NomorWA}`].pendaftaran.tanggal} jam ${UserData.user[`${NomorWA}`].pendaftaran.jam}
₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋
Nomor: ${NomorWA.replace('@c.us', '')}
Nama: ${UserData.user[`${NomorWA}`].profile.nama}
Asal: ${UserData.user[`${NomorWA}`].profile.asal}
Tanggal lahir: ${UserData.user[`${NomorWA}`].profile.tgllhr}
⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻
Untuk menggunakan bot silahkan kirim *${prefix}menu*
Total Pengguna yang telah terdaftar ${jumlahmember}
`
        }
    } else if (RegMed == 'mysql') {
        const sekolah = UserData[0].sekolah === null
        if (!sekolah) {
            const status = UserData[0].status
            let pgskls = UserData[0].penguruskelas
            if (status === "Siswa") {
                (pgskls) ? pgskls = "Pengurus kelas": pgskls = "Bukan Pengurus kelas"
                return `
Pendaftaran @${NomorWA.replace(/[@c.us]/g, '')} berhasil pada ${UserData[0].pendaftaran}
₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋
Nomor: ${NomorWA.replace('@c.us', '')}
Nama: ${UserData[0].nama}
Asal: ${UserData[0].asal}
Tanggal lahir: ${UserData[0].tgl_lahir}
Sekolah: ${UserData[0].sekolah}
Kelas: ${UserData[0].kelas}
Absen: ${UserData[0].absen}
Status: ${pgskls}

⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻
Untuk menggunakan bot silahkan kirim *${prefix}menu*
Total Pengguna yang telah terdaftar ${mysqlJM}
`
            } else if (status === "Guru") {
                return `
Pendaftaran @${NomorWA.replace(/[@c.us]/g, '')} berhasil pada ${UserData[0].pendaftaran}
₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋
Nomor: ${NomorWA.replace('@c.us', '')}
Nama: ${UserData[0].nama}
Asal: ${UserData[0].asal}
Tanggal lahir: ${UserData[0].tgl_lahir}
Sekolah: ${UserData[0].sekolah}
Kelas: ${UserData[0].kelas}
⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻
Untuk menggunakan bot silahkan kirim *${prefix}menu*
Total Pengguna yang telah terdaftar ${mysqlJM}
`
            }
        } else {
            return `
Pendaftaran @${NomorWA.replace(/[@c.us]/g, '')} berhasil pada ${UserData[0].pendaftaran}
₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋
Nomor: ${NomorWA.replace('@c.us', '')}
Nama: ${UserData[0].nama}
Asal: ${UserData[0].asal}
Tanggal lahir: ${UserData[0].tgl_lahir}
⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻
Untuk menggunakan bot silahkan kirim *${prefix}menu*
Total Pengguna yang telah terdaftar ${mysqlJM}
`
        }
    }
}