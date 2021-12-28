require('dotenv').config()
const {
    decryptMedia
} = require('@open-wa/wa-automate')
const fs = require('fs')
const got = require('got')
const yts = require('yt-search')
const fetch = require('node-fetch')
const mathjs = require("mathjs")
const primbon = require('primbon-scraper')
const Tesseract = require("tesseract.js")
const updateJson = require('update-json-file')
const text2image = require('@mrijoo/text2image')
const {
    chatAI,
    removebg,
    scraper,
    absensi
} = require('./lib')
const {
    msgFilter,
    color,
    processTime,
    isUrl
} = require('./util/msgFilter')
const {
    uploadImages
} = require('./util/fetcher')
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta').locale('id')
const botset = JSON.parse(fs.readFileSync('./lib/json/bot.json'))

module.exports = msgHandler = async (client, message) => {
    try {
        const {
            type,
            id,
            from,
            t,
            sender,
            isGroupMsg,
            chatId,
            chat,
            caption,
            isMedia,
            mimetype,
            quotedMsg,
            mentionedJidList
        } = message
        let {
            body
        } = message
        const {
            name,
            formattedTitle
        } = chat
        let {
            pushname,
            verifiedName,
            formattedName
        } = sender
        let {
            general,
            sticker
        } = setting = JSON.parse(fs.readFileSync('./settings.json'))
        let pkg = JSON.parse(fs.readFileSync('./package.json'))
        const {
            langID
        } = require('./message')
        
        const UserDataJSON = './lib/json/user.json'
        const DataAbsensiJSON = './lib/json/absensi.json'
        let UserData = JSON.parse(fs.readFileSync(UserDataJSON))
        let DataAbsensi = JSON.parse(fs.readFileSync(DataAbsensiJSON))
        let prefix, SimiPrivate, SimiGrup
        let GlobalChat = general.GlobalChat
        let Owner = general.owner
        pushname = pushname || verifiedName || formattedName
        const botNumber = await client.getHostNumber() + '@c.us'
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const groupMembers = isGroupMsg ? await client.getGroupMembersId(groupId) : ''
        const isPrivate = sender.id === chat.contact.id
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber) : false
        const isOwner = sender.id === Owner + '@c.us'
        const isReg = await ValReg()
        const isRegGrup = await ValRegGRUP()
        const isGSCH = await ValGSCH()
        const chats = (type === 'chat') ? body : (type === 'image' || type === 'video') ? caption : ''
        const isImage = type === 'image'

        let guruorpgls
        if (isReg === true) {
            if (!UserData.user[`${sender.id}`].profile.sekolah === undefined) {
                guruorpgls = UserData.user[`${sender.id}`].profile.sekolah.status === "Guru" || UserData.user[`${sender.id}`].profile.sekolah.penguruskelas || isOwner
            } else {
                guruorpgls = false
            }
        }

        if (isPrivate) {
            let val = isReg === 'pending'
            if (isReg && !val) {
                val = UserData.user[`${sender.id}`].settings.prefix === undefined
                if (val) {
                    prefix = general.prefix
                } else {
                    prefix = UserData.user[`${sender.id}`].settings.prefix
                }
                val = UserData.user[`${sender.id}`].settings.simi === undefined
                if (!val) {
                    SimiPrivate = UserData.user[`${sender.id}`].settings.simi
                }
            } else {
                prefix = general.prefix
            }
        } else if (isGroupMsg) {
            let val = isReg === 'pending'
            if (UserData.grup[`${chatId}`] === undefined) {
                updateJson(UserDataJSON, (data) => {
                        data.grup[`${chatId}`] = {
                            pendaftaran: 'belum',
                            sekolah: {},
                            settings: {}
                        }
                        return data
                    })
                    .then(() => {
                        if (isReg && !val) {
                            UserData = JSON.parse(fs.readFileSync(UserDataJSON))
                            val = UserData.grup[`${chatId}`].settings.prefix === undefined
                            if (val) {
                                prefix = general.prefix
                            } else {
                                prefix = UserData.grup[`${chatId}`].settings.prefix
                            }
                            val = UserData.grup[`${chatId}`].settings.simi === undefined
                            if (!val) {
                                SimiGrup = UserData.grup[`${chatId}`].settings.simi
                            }
                        } else {
                            prefix = general.prefix
                        }
                    })
                    .catch(error => console.error(error))
            } else if (isReg && !val) {
                UserData = JSON.parse(fs.readFileSync(UserDataJSON))
                val = UserData.grup[`${chatId}`].settings.prefix === undefined
                if (val) {
                    prefix = general.prefix
                } else {
                    prefix = UserData.grup[`${chatId}`].settings.prefix
                }
                val = UserData.grup[`${chatId}`].settings.simi === undefined
                if (!val) {
                    SimiGrup = UserData.grup[`${chatId}`].settings.simi
                }
            } else {
                prefix = general.prefix
            }
        }

        String.prototype.toRandomCase = function () {
            return this.split('').map(function (c) {
                return c[Math.round(Math.random()) ? 'toUpperCase' : 'toLowerCase']();
            }).join('');
        }

        const convertTime = async (detik) => new Promise((resolve, reject) => {
            let menit = detik / 60;
            let jam = menit / 60;
            detik = Math.floor(detik);
            menit = Math.floor(menit);
            jam = Math.floor(jam);
            jam = jam % 60;
            menit = menit % 60;
            detik = detik % 60;
            if (jam > 0) {
                resolve(jam + " jam " + menit + " menit " + detik + " detik")
            } else if (menit > 0) {
                resolve(menit + " menit " + detik + " detik")
            } else {
                resolve(detik + " detik")
            }
            const err = 'Error'
            reject(err)
        })

        const Platfom = async (platfom) => new Promise((resolve, reject) => {
            switch (platfom) {
                case 'aix':
                    resolve("IBM AIX");
                    break;
                case 'android':
                    resolve("Android");
                    break;
                case 'darwin':
                    resolve("Darwin (MacOS, IOS etc)");
                    break;
                case 'freebsd':
                    resolve("FreeBSD");
                    break;
                case 'linux':
                    resolve("Linux");
                    break;
                case 'openbsd':
                    resolve("OpenBSD");
                    break;
                case 'sunos':
                    resolve("SunOS");
                    break;
                case 'win32':
                    resolve("Windows");
                    break;
                default:
                    resolve("unknown");
            }
        })

        const sleep = async (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function replaceAll(string, find, replace) {
            return string.replace(new RegExp(find, 'g'), replace);
        }

        function banChat() {
            if (GlobalChat == true) {
                return false
            } else {
                return true
            }
        }

        const isMuted = (chatId) => {
            if (botset.includes(chatId)) {
                return false
            } else {
                return true
            }
        }

        const Calculator = (string) => {
            return new Promise((resolve, reject) => {
                resolve(mathjs.evaluate(string));
            })
        }

        const OCR = (Gambar) => {
            return new Promise((resolve, reject) => {
                Tesseract.recognize(
                    Gambar,
                    'ind'
                ).then(({
                    data: {
                        text
                    }
                }) => {
                    resolve(text)
                })
            })
        }

        function TeksAlay(string) {
            let a = string.replace(/[A]/g, 4).replace(/[E]/g, 3);
            return a.toRandomCase();
        }

        function getAge(tgllhr) {
            var today = new Date();
            var birthDate = new Date(tgllhr);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }

        async function ValReg() {
            let reg = false
            if (UserData.user === undefined && UserData.grup === undefined) {
                updateJson(UserDataJSON, (data) => {
                        data = {
                            user: {},
                            grup: {}
                        }
                        return data
                    })
                    .then(() => {
                        updateJson(UserDataJSON, (data) => {
                                data.user[`${sender.id}`] = {
                                    pendaftaran: 'belum'
                                }
                                return data
                            })
                            .then(() => {
                                reg = false
                            })
                            .catch(error => console.error(error))
                    })
                    .catch(error => console.error(error))
            } else if (UserData.user[`${sender.id}`] === undefined) {
                updateJson(UserDataJSON, (data) => {
                        data.user[`${sender.id}`] = {
                            pendaftaran: 'belum'
                        }
                        return data
                    })
                    .then(() => {
                        reg = false
                    })
                    .catch(error => console.error(error))
            } else if (UserData.user[`${sender.id}`].pendaftaran === 'belum') {
                reg = false
            } else if (UserData.user[`${sender.id}`].pendaftaran === 'pending') {
                reg = 'pending'
            } else {
                const val = UserData.user[`${sender.id}`].profile.nama === undefined && UserData.user[`${sender.id}`].profile.asal === undefined && UserData.user[`${sender.id}`].profile.tgllhr === undefined
                if (!val) return reg = true
            }
            return reg
        }

        async function ValRegGRUP() {
            let reg = false
            if (isPrivate) return reg = false
            if (UserData.user === undefined && UserData.grup === undefined) {
                updateJson(UserDataJSON, (data) => {
                        data = {
                            user: {},
                            grup: {}
                        }
                        return data
                    })
                    .then(() => {
                        updateJson(UserDataJSON, (data) => {
                                data.grup[`${chatId}`].pendaftaran = {
                                    pendaftaran: 'belum',
                                    sekolah: {},
                                    settings: {}
                                }
                                return data
                            })
                            .then(() => {
                                reg = false
                            })
                            .catch(error => console.error(error))
                    })
                    .catch(error => console.error(error))
            } else if (UserData.grup[`${chatId}`] === undefined) {
                updateJson(UserDataJSON, (data) => {
                        data.grup[`${chatId}`] = {
                            pendaftaran: 'belum',
                            sekolah: {},
                            settings: {}
                        }
                        return data
                    })
                    .then(() => {
                        reg = false
                    })
                    .catch(error => console.error(error))
            } else if (UserData.grup[`${chatId}`].pendaftaran === 'belum') {
                reg = false
            } else if (UserData.grup[`${chatId}`].pendaftaran === 'pending') {
                reg = 'pending'
            } else {
                const val = UserData.grup[`${chatId}`].sekolah.nama === undefined && UserData.grup[`${chatId}`].sekolah.kelas === undefined && UserData.grup[`${chatId}`].sekolah.jumlahsiswa === undefined
                if (!val) return reg = true
            }
            return reg
        }

        async function Daftar() {
            const emoji = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
            UserData = JSON.parse(fs.readFileSync(UserDataJSON))
            const isi = chats.toLowerCase()
            if (isPrivate) {
                if (isReg === true) return client.reply(from, langID.isReg(), id)
                if (isMedia) return client.reply(from, "Silakan isi dengan benar", id)
                if (type === 'sticker') return client.reply(from, "Silakan isi dengan benar", id)
                if (emoji.test(chats)) return client.reply(from, "Silakan isi dengan benar", id)
                const validasi = await client.checkNumberStatus(sender.id)
                if (UserData.user === undefined) {
                    if (!validasi.canReceiveMessage) return client.reply(from, 'Nomor WhatsApp tidak valid [ Tidak terdaftar di WhatsApp ]', id)
                    updateJson(UserDataJSON, (data) => {
                            data = {
                                user: {},
                                grup: {}
                            }
                            data.user[`${sender.id}`] = {
                                pendaftaran: 'pending',
                                profile: {},
                                settings: {}
                            }
                            return data
                        })
                        .then(() => {
                            client.sendText(from, 'Silakan jawab dengan benar. jawab batal jika ingin membatalkan pendaftaran', id)
                            client.sendText(from, 'Nama mu?', id)
                        })
                        .catch(error => console.error(error))
                } else if (UserData.user[`${sender.id}`] === undefined || UserData.user[`${sender.id}`].pendaftaran === 'belum') {
                    if (!validasi.canReceiveMessage) return client.reply(from, 'Nomor WhatsApp tidak valid [ Tidak terdaftar di WhatsApp ]', id)
                    updateJson(UserDataJSON, (data) => {
                            data.user[`${sender.id}`] = {
                                pendaftaran: 'pending',
                                profile: {},
                                settings: {}
                            }
                            return data
                        })
                        .then(() => {
                            client.sendText(from, 'Silakan jawab dengan benar. jawab *batal* jika ingin membatalkan pendaftaran', id)
                            client.sendText(from, 'Nama mu?', id)
                        })
                        .catch(error => console.error(error))
                } else if (isi === "batal") {
                    updateJson(UserDataJSON, (data) => {
                            delete data.user[`${sender.id}`]
                            return data
                        })
                        .then(() => {
                            client.sendText(from, 'Pendaftaran telah dibatalkan', id)
                        })
                        .catch(error => console.error(error))
                } else if (UserData.user[`${sender.id}`].profile.nama === undefined) {
                    updateJson(UserDataJSON, (data) => {
                            data.user[`${sender.id}`].profile.nama = chats
                            return data
                        })
                        .then(() => {
                            client.sendText(from, 'Asal?', id)
                        })
                        .catch(error => console.error(error))
                } else if (UserData.user[`${sender.id}`].profile.asal === undefined) {
                    updateJson(UserDataJSON, (data) => {
                            data.user[`${sender.id}`].profile.asal = chats
                            return data
                        })
                        .then(() => {
                            client.sendText(from, 'Tanggal lahir mu? tahun/bulan/tanggal', id)
                        })
                        .catch(error => console.error(error))
                } else if (UserData.user[`${sender.id}`].profile.tgllhr === undefined) {
                    if (!chats.match(/^((19|20)\d{2})\/(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/)) return client.reply(from, 'Silakan tulis dengan format yang benar. contoh *2000/01/15*', id)
                    updateJson(UserDataJSON, (data) => {
                            data.user[`${sender.id}`].profile.tgllhr = chats
                            return data
                        })
                        .then(async () => {
                            const umur = await getAge(chats)
                            if (umur <= 30) {
                                updateJson(UserDataJSON, (data) => {
                                        data.user[`${sender.id}`].profile.sekolah = 'pending'
                                        return data
                                    })
                                    .then(() => {
                                        client.sendText(from, "Apakah kamu masih sekolah? jika iya jawab *ya* jika tidak jawab *tidak*", id)
                                    })
                                    .catch(error => console.error(error))
                            } else if (umur <= 75) {
                                updateJson(UserDataJSON, (data) => {
                                        data.user[`${sender.id}`].profile.sekolah = 'pending'
                                        return data
                                    })
                                    .then(() => {
                                        client.sendText(from, "Apakah profesi anda guru? jika iya jawab *ya* jika tidak jawab *tidak*", id)
                                    })
                                    .catch(error => console.error(error))
                            } else {
                                updateJson(UserDataJSON, (data) => {
                                        data.user[`${sender.id}`].pendaftaran = {
                                            tanggal: `${moment().format('DD/MM/YYYY')}`,
                                            jam: `${moment().format('HH:mm:ss')}`
                                        }
                                        return data
                                    })
                                    .then(() => {
                                        UserData = JSON.parse(fs.readFileSync(UserDataJSON))
                                        client.sendTextWithMentions(from, langID.textReg(sender.id, UserData, prefix), id)
                                    })
                            }
                        })
                        .catch(error => console.error(error))
                } else if (UserData.user[`${sender.id}`].profile.sekolah === 'pending') {
                    const umur = await getAge(UserData.user[`${sender.id}`].profile.tgllhr)
                    if (umur <= 30) {
                        if (isi == 'ya') {
                            updateJson(UserDataJSON, (data) => {
                                    data.user[`${sender.id}`].profile.sekolah = {
                                        status: "Siswa"
                                    }
                                    return data
                                })
                                .then(() => {
                                    client.sendText(from, 'Nama Sekolah mu?', id)
                                })
                                .catch(error => console.error(error))
                        } else if (isi == 'guru') {
                            updateJson(UserDataJSON, (data) => {
                                    data.user[`${sender.id}`].profile.sekolah = {
                                        status: "Guru"
                                    }
                                    return data
                                })
                                .then(() => {
                                    client.sendText(from, 'Nama Sekolah anda mengajar?', id)
                                })
                                .catch(error => console.error(error))
                        } else if (isi == 'tidak') {
                            delete UserData.user[`${sender.id}`].profile.sekolah
                            fs.writeFile("./lib/json/user.json", JSON.stringify(UserData, null, 4), function (err) {
                                if (err) throw err;
                                updateJson(UserDataJSON, (data) => {
                                        data.user[`${sender.id}`].pendaftaran = {
                                            tanggal: `${moment().format('DD/MM/YYYY')}`,
                                            jam: `${moment().format('HH:mm:ss')}`
                                        }
                                        return data
                                    })
                                    .then(() => {
                                        UserData = JSON.parse(fs.readFileSync(UserDataJSON))
                                        client.sendTextWithMentions(from, langID.textReg(sender.id, UserData, prefix), id)
                                    })
                            })
                        } else {
                            client.sendText(from, 'ya/tidak', id)
                        }
                    } else {
                        if (isi == 'ya') {
                            updateJson(UserDataJSON, (data) => {
                                    data.user[`${sender.id}`].profile.sekolah = {
                                        status: "Guru"
                                    }
                                    return data
                                })
                                .then(() => {
                                    client.sendText(from, 'Nama Sekolah anda mengajar?', id)
                                })
                                .catch(error => console.error(error))
                        } else if (isi == 'tidak') {
                            delete UserData.user[`${sender.id}`].profile.sekolah
                            fs.writeFile("./lib/json/user.json", JSON.stringify(UserData, null, 4), function (err) {
                                if (err) throw err;
                                updateJson(UserDataJSON, (data) => {
                                        data.user[`${sender.id}`].pendaftaran = {
                                            tanggal: `${moment().format('DD/MM/YYYY')}`,
                                            jam: `${moment().format('HH:mm:ss')}`
                                        }
                                        return data
                                    })
                                    .then(() => {
                                        UserData = JSON.parse(fs.readFileSync(UserDataJSON))
                                        client.sendTextWithMentions(from, langID.textReg(sender.id, UserData, prefix), id)
                                    })
                                    .catch(error => console.error(error))
                            })
                        } else {
                            client.sendText(from, 'ya/tidak', id)
                        }
                    }
                } else if (UserData.user[`${sender.id}`].profile.sekolah.status === 'Siswa') {
                    if (UserData.user[`${sender.id}`].profile.sekolah.nama === undefined) {
                        updateJson(UserDataJSON, (data) => {
                                data.user[`${sender.id}`].profile.sekolah.nama = chats
                                return data
                            })
                            .then(() => {
                                client.sendText(from, 'Kelas mu?', id)
                            })
                            .catch(error => console.error(error))
                    } else if (UserData.user[`${sender.id}`].profile.sekolah.kelas === undefined) {
                        updateJson(UserDataJSON, (data) => {
                                data.user[`${sender.id}`].profile.sekolah.kelas = chats
                                return data
                            })
                            .then(() => {
                                client.sendText(from, 'Absen mu?', id)
                            })
                            .catch(error => console.error(error))
                    } else if (UserData.user[`${sender.id}`].profile.sekolah.absen === undefined) {
                        if (isNaN(chats)) return await client.reply(from, 'Absen harus berupa angka!!', id)
                        updateJson(UserDataJSON, (data) => {
                                data.user[`${sender.id}`].profile.sekolah.absen = Number(chats)
                                return data
                            })
                            .then(() => {
                                client.sendText(from, 'Apakah kamu pengurus kelas? jika iya jawab ya jika tidak jawab tidak')
                            })
                            .catch(error => console.error(error))
                    } else if (UserData.user[`${sender.id}`].profile.sekolah.penguruskelas === undefined) {
                        if (isi == 'ya') {
                            updateJson(UserDataJSON, (data) => {
                                    data.user[`${sender.id}`].profile.sekolah.penguruskelas = true
                                    return data
                                })
                                .then(() => {
                                    updateJson(UserDataJSON, (data) => {
                                            data.user[`${sender.id}`].pendaftaran = {
                                                tanggal: `${moment().format('DD/MM/YYYY')}`,
                                                jam: `${moment().format('HH:mm:ss')}`
                                            }
                                            return data
                                        })
                                        .then(() => {
                                            UserData = JSON.parse(fs.readFileSync(UserDataJSON))
                                            client.sendTextWithMentions(from, langID.textReg(sender.id, UserData, prefix, true), id)
                                        })
                                })
                                .catch(error => console.error(error))
                        } else if (isi == 'tidak') {
                            updateJson(UserDataJSON, (data) => {
                                    data.user[`${sender.id}`].profile.sekolah.penguruskelas = false
                                    return data
                                })
                                .then(() => {
                                    updateJson(UserDataJSON, (data) => {
                                            data.user[`${sender.id}`].pendaftaran = {
                                                tanggal: `${moment().format('DD/MM/YYYY')}`,
                                                jam: `${moment().format('HH:mm:ss')}`
                                            }
                                            return data
                                        })
                                        .then(() => {
                                            UserData = JSON.parse(fs.readFileSync(UserDataJSON))
                                            client.sendTextWithMentions(from, langID.textReg(sender.id, UserData, prefix, true), id)
                                        })
                                })
                                .catch(error => console.error(error))
                        } else {
                            client.reply(from, 'ya atau tidak?', id)
                        }
                    }
                } else if (UserData.user[`${sender.id}`].profile.sekolah.status === 'Guru') {
                    if (UserData.user[`${sender.id}`].profile.sekolah.nama === undefined) {
                        updateJson(UserDataJSON, (data) => {
                                data.user[`${sender.id}`].profile.sekolah.nama = chats
                                data.user[`${sender.id}`].profile.sekolah.pkelas = true
                                data.user[`${sender.id}`].profile.sekolah.kelas = []
                                return data
                            })
                            .then(() => {
                                client.sendText(from, 'Kelas anda mengajar? isikan satu persatu', id)
                            })
                            .catch(error => console.error(error))
                    } else if (UserData.user[`${sender.id}`].profile.sekolah.pkelas) {
                        if (isi === 'sudah') {
                            if (UserData.user[`${sender.id}`].profile.sekolah.kelas.length === 0) return client.reply(from, "??", id)
                            updateJson(UserDataJSON, (data) => {
                                    delete data.user[`${sender.id}`].profile.sekolah.pkelas
                                    data.user[`${sender.id}`].pendaftaran = {
                                        tanggal: `${moment().format('DD/MM/YYYY')}`,
                                        jam: `${moment().format('HH:mm:ss')}`
                                    }
                                    return data
                                })
                                .then(() => {
                                    UserData = JSON.parse(fs.readFileSync(UserDataJSON))
                                    client.sendTextWithMentions(from, langID.textReg(sender.id, UserData, prefix), id)
                                })
                                .catch(error => console.error(error))
                        } else if (isi === 'list') {
                            const array = UserData.user[`${sender.id}`].profile.sekolah.kelas
                            let no = 0,
                                kelas = "List kelas\n"
                            array.forEach(element => {
                                no++
                                kelas += `${no}. *${element}*\n`
                            })
                            client.reply(from, kelas, id)
                        } else if (isi.includes('hapus')) {
                            const kelas = isi.slice(6)
                            const getkelas = UserData.user[`${sender.id}`].profile.sekolah.kelas.indexOf(kelas)
                            if (getkelas === -1) return client.reply(from, `Kelas *${kelas}* tidak ada`, id)
                            updateJson(UserDataJSON, (data) => {
                                    data.user[`${sender.id}`].profile.sekolah.kelas.splice(getkelas, 1)
                                    return data
                                })
                                .then(() => {
                                    client.sendText(from, `Kelas *${kelas}* telah terhapus`, id)
                                })
                                .catch(error => console.error(error))
                        } else {
                            updateJson(UserDataJSON, (data) => {
                                    data.user[`${sender.id}`].profile.sekolah.kelas.push(isi)
                                    return data
                                })
                                .then(() => {
                                    client.sendText(from, 'Ada lagi? Jika sudah semua jawab dengan sudah', id)
                                })
                                .catch(error => console.error(error))
                        }
                    }
                }
            } else if (isGroupMsg) { // group daftar
                if (!isGroupAdmins || !isOwner) return
                if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                if (UserData.user[`${sender.id}`].pendaftaran === 'pending') return console.log("Pending")
                if (isRegGrup === true) return client.reply(from, 'Grup sudah terdaftar', id)
                if (UserData.grup[chatId].pendaftaran === undefined || UserData.grup[chatId].pendaftaran === 'belum') {
                    updateJson(UserDataJSON, (data) => {
                            data.grup[chatId].pendaftaran = "pending"
                            data.grup[chatId].sekolah = {}
                            return data
                        })
                        .then(() => {
                            client.sendText(from, 'Silakan jawab dengan benar. jawab batal jika ingin membatalkan pendaftaran', id)
                            client.sendText(from, 'Nama Sekolah?', id)
                        })
                        .catch(error => console.error(error))
                } else if (isi === "batal") {
                    updateJson(UserDataJSON, (data) => {
                            delete data.grup[chatId]
                            return data
                        })
                        .then(() => {
                            client.sendText(from, 'Pendaftaran telah dibatalkan', id)
                        })
                        .catch(error => console.error(error))
                } else if (UserData.grup[chatId].sekolah.nama === undefined) {
                    updateJson(UserDataJSON, (data) => {
                            data.grup[`${chatId}`].sekolah.nama = chats
                            return data
                        })
                        .then(() => {
                            client.sendText(from, 'Kelas?', id)
                        })
                        .catch(error => console.error(error))
                } else if (UserData.grup[chatId].sekolah.kelas === undefined) {
                    updateJson(UserDataJSON, (data) => {
                            data.grup[`${chatId}`].sekolah.kelas = chats
                            return data
                        })
                        .then(() => {
                            client.sendText(from, 'Jumlah Siswa?', id)
                        })
                        .catch(error => console.error(error))
                } else if (UserData.grup[chatId].sekolah.jumlahsiswa === undefined) {
                    if (isNaN(chats)) return await client.reply(from, 'Jumlah Siswa harus berupa angka!!', id)
                    updateJson(UserDataJSON, (data) => {
                            data.grup[`${chatId}`].sekolah.jumlahsiswa = chats
                            return data
                        })
                        .then(() => {
                            updateJson(UserDataJSON, (data) => {
                                    data.grup[`${chatId}`].pendaftaran = {
                                        tanggal: `${moment().format('DD/MM/YYYY')}`,
                                        jam: `${moment().format('HH:mm:ss')}`
                                    }
                                    return data
                                })
                                .then(() => {
                                    client.sendText(from, 'Pendaftaran berhasil', id)
                                })
                                .catch(error => console.error(error))
                        })
                        .catch(error => console.error(error))
                } else {
                    client.reply(from, 'Grup sudah terdaftar', id)
                }
            } else {
                console.log("ERROR DAFTAR")
            }
        }

        function cekkehadiran() {
            const GetUserNA = UserData.user[`${sender.id}`].profile.nama
            const GetUserAB = UserData.user[`${sender.id}`].profile.sekolah.absen
            for (let i = 0; i < DataAbsensi[chatId].absensi.length; i++) {
                if (GetUserNA.match(DataAbsensi[chatId].absensi[i].nama)) {
                    const abs = DataAbsensi[chatId].absensi[i].absen
                    if (abs == GetUserAB) {
                        return {
                            status: true,
                            index: i
                        }
                    }
                }
            }
            return {
                status: false,
                index: -1
            }
        }

        async function addgrupSet(settings, status) {
            if (UserData.user === undefined && UserData.grup === undefined) {
                updateJson(UserDataJSON, (data) => {
                        data = {
                            user: {},
                            grup: {}
                        }
                        return data
                    })
                    .then(() => {
                        updateJson(UserDataJSON, (data) => {
                                data.grup[`${chatId}`] = {
                                    pendaftaran: "belum",
                                    settings: {}
                                }
                                data.grup[`${chatId}`].settings[`${settings}`] = status
                                return data
                            })
                            .then(() => {
                                valsts = true
                            })
                            .catch(error => console.error(error))
                    })
                    .catch(error => console.error(error))
            } else {
                updateJson(UserDataJSON, (data) => {
                        data.grup[`${chatId}`] = {
                            pendaftaran: "belum",
                            settings: {}
                        }
                        return data
                    })
                    .then(() => {
                        updateJson(UserDataJSON, (data) => {
                                data.grup[`${chatId}`].settings[`${settings}`] = status
                                return data
                            })
                            .then(() => {
                                valsts = true
                            })
                            .catch(error => console.error(error))
                    })
                    .catch(error => console.error(error))
            }
        }

        async function CAI(iscmd, chat) {
            if (general.autoread) {
                client.sendSeen(chatId)
            }
            if (!isCmd) {
                if (isPrivate) {
                    if (SimiPrivate) {
                        let chatai = await chatAI(chat, iscmd, prefix)
                        let jkr = chatai.length
                        let jk = chatai.split(' ').length
                        let typing = (jk * jkr) / 40 / (100 / 2.2) * 1000;
                        let cekchatAI = chatai === undefined
                        if (!cekchatAI) {
                            client.simulateTyping(from, true)
                            await sleep(typing)
                            client.sendText(from, chatai, id)
                            client.simulateTyping(from, false)
                        }
                    }
                } else if (isGroupMsg) {
                    if (SimiGrup) {
                        let chatai = await chatAI(chat, iscmd, prefix)
                        let jkr = chatai.length
                        let jk = chatai.split(' ').length
                        let typing = (jk * jkr) / 40 / (100 / 2.2) * 1000;
                        let cekchatAI = chatai === undefined
                        if (!cekchatAI) {
                            client.simulateTyping(from, true)
                            await sleep(typing)
                            client.sendText(from, chatai, id)
                            client.simulateTyping(from, false)
                        }
                    }
                }
            }
        }

        function ValGSCH() {
            if (isPrivate) {
                return false
            } else if (isGroupMsg) {
                if (isRegGrup) {
                    return true
                } else {
                    return false
                }
            }
        }

        body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(prefix)) ? caption : ''
        if (body[1] === ' ') {
            body = body.replace(' ', '')
        }
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const uaOverride = process.env.UserAgent
        const arg = body.substring(body.indexOf(' ') + 1)
        const url = args.length !== 0 ? args[0] : ''
        const txt = body.slice(command.length + 2)
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
        const isQuotedFile = quotedMsg && quotedMsg.type === 'document'
        const isQuotedAudio = quotedMsg && quotedMsg.type === 'audio'
        const isQuotedGif = quotedMsg && quotedMsg.type === 'gif'
        const isSticker = quotedMsg && quotedMsg.type === 'sticker'
        const isQuotedSticker = quotedMsg && quotedMsg.type === 'sticker'

        let Sticker =  {}
        if (isReg) {
            if (sticker.author === false) {
                Sticker['author'] = UserData.user[`${sender.id}`].profile.nama
            } else {
                Sticker['author'] = sticker.author
            }
            if (sticker.pack === false) {
                Sticker['pack'] = pkg.name
            } else {
                Sticker['pack'] = sticker.pack
            }
        }
        if (isPrivate) {
            if (isReg === 'pending') return Daftar()
        } else if (isGroupMsg) {
            if (isRegGrup === 'pending') return Daftar()
        }
        if (!isMedia) {
            CAI(isCmd, chats)
        }
        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) {
            return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        }
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) {
            return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))
        }
        if (!isCmd && !isGroupMsg) {
            return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Message from', color(pushname), 'Message', color(chats, 'lime'))
        }
        if (!isCmd && isGroupMsg) {
            return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Message from', color(pushname), 'in', color(name || formattedTitle), 'Message', color(chats, 'lime'))
        }
        if (isCmd && !isGroupMsg) {
            console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        }
        if (isCmd && isGroupMsg) {
            console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))
        }

        if (isGroupMsg) {
            if (isRegGrup) {
                msgFilter.addFilter(from, 0)
            } else {
                msgFilter.addFilter(from, general.delay)
            }
        } else {
            msgFilter.addFilter(from, general.delay)
        }

        if (body === prefix + 'off' && isMuted(chatId) == true) {
            if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id); {
                if (!isGroupAdmins) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin grup!', id)
                botset.push(chatId)
                fs.writeFileSync('./lib/json/bot.json', JSON.stringify(botset, null, 2))
                client.reply(from, `Bot telah di nonaktifkan pada grup ini! ${prefix}on untuk mengaktifkan!`, id)
            }
        }
        if (body === prefix + 'on' && isMuted(chatId) == false) {
            if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id); {
                if (!isGroupAdmins) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin grup!', id)
                let index = botset.indexOf(chatId);
                botset.splice(index, 1)
                fs.writeFileSync('./lib/json/bot.json', JSON.stringify(botset, null, 2))
                client.reply(from, `Bot telah di aktifkan!`, id)
            }
        }

        if (isMuted(chatId) && !banChat() || isOwner) {
            switch (command) {
                case 'menu':
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (isGSCH) {
                        client.sendText(from, langID.textMenuSCH(pushname, prefix), id)
                    } else {
                        client.sendText(from, langID.textMenu(pushname, prefix), id)
                    }
                    break

                case 'about':
                    client.sendText(from, langID.textAbout(), id)
                    break

                case 'bot':
                case 'getbot':
                    client.sendText(from, `wa.me/${botNumber.replace('@c.us', '')}`)
                    client.sendContact(chatId, `${botNumber}`)
                    break

                case 'daftar':
                    Daftar()
                    break

                case 'prefix':
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (args.length === 0) return client.reply(from, `Prefix tidak boleh kosong. contoh *${prefix}prefix ,*`, id)
                    if (args[0] == prefix) return client.reply(from, `Prefix yang kamu masukan sama dengan prefix yang sekarang digunakan`, id)
                    if (isPrivate) {
                        updateJson(UserDataJSON, (data) => {
                                data.user[`${sender.id}`].settings.prefix = args[0]
                                return data
                            })
                            .then(() => {
                                client.sendText(from, `Berhasil mengganti prefix dari *${prefix}* menjadi *${args[0]}*`, id)
                            })
                            .catch(error => console.error(error))
                    } else if (isGroupMsg) {
                        if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
                        if (args.length === 0) return client.reply(from, `prefix tidak boleh kosong. contoh *${prefix}prefix ,*`, id)
                        addgrupSet('prefix', args[0]).then(() => {
                            client.sendText(from, `Berhasil mengganti prefix dari *${prefix}* menjadi *${args[0]}*`, id)
                        })
                    }
                    break

                case 'sticker':
                case 'stiker':
                case 'gs':
                case 'vgs':
                case 'tsc':
                case 'stikergif':
                case 'stickergif':
                case 'gifstiker':
                case 'gifsticker':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    client.simulateTyping(from, true)
                    if ((isMedia && isImage || isQuotedImage) && args.length === 0) {
                        try {
                            const encryptMedia = isQuotedImage ? quotedMsg : message
                            const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                            const mediaData = await decryptMedia(encryptMedia, uaOverride)
                            const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                            await client.sendImageAsSticker(from, imageBase64, {
                                author: Sticker.author,
                                pack: Sticker.pack
                            }).then(() => {
                                console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                            })
                        } catch (err) {
                            console.error(err)
                            client.reply(from, '', id)
                        }
                    } else if (args[0] === 'nobg') {
                        if ((isMedia && isImage || isQuotedImage)) {
                            try {
                                const encryptMedia = isQuotedImage ? quotedMsg : message
                                const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                                const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                                const nobg = await removebg(imageBase64)
                                const hasil = `data:${_mimetype};base64,${nobg}`
                                await client.sendImageAsSticker(from, hasil, {
                                    author: Sticker.author,
                                    pack: Sticker.pack
                                })
                            } catch (err) {
                                console.log(err)
                                if (err[0].title == 'Authorization failed') return client.reply(from, "Error, silakan hubungi admin bot", id) && client.sendText(Owner, 'key removebg ga bisa bos')
                                if (err[0].title == 'Rate limit exceeded') return client.reply(from, "Error, silakan hubungi admin bot", id) && client.sendText(Owner, 'Rate limit exceeded')
                                client.reply(from, `Gambar tidak dapat terbaca, pastikan objek gambar jelas`, id)
                            }
                        } else {
                            client.reply(from, 'tidak ada gambar', id)
                        }
                    } else if (args.length >= 1) {
                        if (isUrl(url)) {
                            client.sendStickerfromUrl(from, url, {}, {
                                author: Sticker.author,
                                pack: Sticker.pack
                            }).then(() => {
                                console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                            }).catch((err) => {
                                console.log(err)
                            })
                        } else if (isMedia || isQuotedImage) {
                            try {
                                const encryptMedia = isQuotedImage ? quotedMsg : message
                                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                                const imageBase64 = mediaData.toString('base64')
                                const hsl = await scraper.meme(imageBase64, txt)
                                client.sendImageAsSticker(from, hsl, {
                                        author: Sticker.author,
                                        pack: Sticker.pack
                                    })
                                    .then(() => console.log(`Sticker Processed for ${processTime(t, moment())} Second`))
                                    .catch((err) => console.error(err))
                            } catch (err) {
                                console.log(err)
                            }
                        } else {
                            text2image.convert(txt, "lib/font/ObelixProBIt-cyr", {
                                family: 'pg'
                            }, {
                                x: 70,
                                y: 50,
                                width: 400,
                                height: 400
                            }, {}).then(base64 => {
                                client.sendImageAsSticker(from, base64, {
                                    author: Sticker.author,
                                    pack: Sticker.pack
                                })
                            })
                        }
                    } else if (isMedia) {
                        (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10)
                        try {
                            const mediaData = await decryptMedia(message, uaOverride)
                            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                            await client.sendMp4AsSticker(from, imageBase64, {}, {
                                author: Sticker.author,
                                pack: Sticker.pack
                            }).then(() => {
                                console.log(`Sticker Gif Processed for ${processTime(t, moment())} Second`)
                            })
                        } catch (e) {
                            client.reply(from, `Size File terlalu besar! mohon kurangi durasi video.`, id)
                        }
                    } else if (quotedMsg && quotedMsg.type == 'video' || quotedMsg && quotedMsg.mimetype == 'image/gif') {
                        try {
                            const mediaData = await decryptMedia(quotedMsg, uaOverride)
                            await client.sendMp4AsSticker(from, mediaData, {}, {
                                author: Sticker.author,
                                pack: Sticker.pack
                            })
                            console.log(`Sticker Gif Processed for ${processTime(t, moment())} Second`)
                        } catch (e) {
                            client.reply(from, `Size File terlalu besar! mohon kurangi durasi video.`, id)
                        }
                    } else if (args.length !== 1) return client.reply(from, `Kirim Gambar/Video dengan caption ${prefix}stiker / Dengan url giphy \nContoh : *${prefix}stiker https://media.giphy.com/media/fe85BL1FFJ85hKY8RH/giphy.gif*`, id)
                    client.simulateTyping(from, false)
                    break

                case 'gtts':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    try {
                        if (args.length === 0) return client.reply(from, `Kirim perintah *${prefix}gtts [ kodebahasa ] [ Teks ]*, contoh *${prefix}gtts id hai kamu*`, id)
                        const gtts = require('node-gtts')(args[0])
                        const text = body.slice(9)
                        const dirm = "./media"
                        if (text === '') return client.reply(from, 'Masukkan teksnya', id)
                        if (text.length > 500) return client7.reply(from, 'Teks terlalu panjang!', id)
                        if (!fs.existsSync(dirm)) {
                            fs.mkdirSync(dirm);
                        }
                        gtts.save(`${dirm}/tts.mp3`, text, function () {
                            client.sendPtt(from, './media/tts.mp3', id)
                        })
                    } catch (err) {
                        console.log(err)
                        client.reply(from, `Kode bahasa tidak tersedia silakan kirim *${prefix}kodebahasa* untuk melihat list kode bahasa`, id)
                    }
                    break

                case 'kb':
                case 'kodebahasa':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    client.sendText(from, langID.textKodeBahasa(), id)
                    break

                case 'simi':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (isPrivate) {
                        if (args[0] == 'on') {
                            if (SimiPrivate) return await client.reply(from, 'Simi sudah on', id)
                            updateJson(UserDataJSON, (data) => {
                                    data.user[`${sender.id}`].settings.simi = true
                                    return data
                                })
                                .then(() => {
                                    client.sendText(from, `Simi aktif`, id)
                                })
                                .catch(error => console.error(error))
                        } else if (args[0] == 'off') {
                            if (!SimiPrivate) return await client.reply(from, 'Simi sudah off', id)
                            updateJson(UserDataJSON, (data) => {
                                    data.user[`${sender.id}`].settings.simi = false
                                    return data
                                })
                                .then(() => {
                                    client.sendText(from, `Simi off!`, id)
                                })
                                .catch(error => console.error(error))
                        } else {
                            client.reply(from, `${prefix}simi on/off`)
                        }
                    } else if (isGroupMsg) {
                        if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
                        if (args.length !== 1) return client.reply(from, `Untuk mengaktifkan simsimi pada Group Chat\n\nPenggunaan\n${prefix}simi on --mengaktifkan\n${prefix}simi off --nonaktifkan\n`, id)
                        if (args[0] == 'on') {
                            if (SimiGrup) return await client.reply(from, 'Simi sudah on', id)
                            addgrupSet('simi', true).then(() => {
                                client.sendText(from, `Simi on`, id)
                            })
                        } else if (args[0] == 'off') {
                            if (!SimiGrup) return await client.reply(from, 'Simi sudah off', id)
                            addgrupSet('simi', false).then(() => {
                                client.sendText(from, `Simi off!`, id)
                            })
                        } else {
                            client.reply(from, `Untuk mengaktifkan simsimi pada Group Chat\n\nPenggunaan\n${prefix}simi on --mengaktifkan\n${prefix}simi off --nonaktifkan\n`, id)
                        }
                    }
                    break

                case 'gempa':
                case 'infogempa':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    const getinfo = await got.get('https://api.izo.my.id/infogempa').json()
                    const {
                        potensi, koordinat, lokasi, kedalaman, magnitude, waktu, map
                    } = getinfo
                    const hasil = `*${waktu}*\n📍 *Lokasi* : *${lokasi}*\n〽️ *Kedalaman* : *${kedalaman}*\n💢 *Magnitude* : *${magnitude}*\n🔘 *Potensi* : *${potensi}*\n📍 *Koordinat* : *${koordinat}*`
                    client.sendFileFromUrl(from, map, 'shakemap.jpg', hasil, id)
                    break

                case 'gempadirasakan':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    const getinfogs = await got.get('https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json').json()
                    let gempa = 'Gempa Yang Dirasakan\n'
                    for (let i = 0; i < getinfogs.Infogempa.gempa.length; i++) {
                        const {
                            Tanggal,
                            Jam,
                            Lintang,
                            Bujur,
                            Magnitude,
                            Kedalaman,
                            Wilayah,
                            Dirasakan
                        } = getinfogs.Infogempa.gempa[i]
                        gempa += `\n${Tanggal}, ${Jam}\n📍 Lokasi : ${Wilayah}\n〽️ Kedalaman : ${Kedalaman}\n💢 Magnitude : ${Magnitude}\n🔘 Potensi : Dirasakan (Skala MMI): ${Dirasakan}\n📍 Koordinat : ${Lintang} - ${Bujur}\n\n`
                        gempa += `════════════════════════════════════════════════\n`
                    }
                    client.sendFileFromUrl(from, 'https://izo.my.id/BMKG/Skala-MMI.png', 'shakemap.jpg', gempa, id)
                    break

                case 'ssweb':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (!isUrl(args[0])) return client.reply(from, `Screenshot website\n\nPemakaian: ${prefix}ss [url]\n\ncontoh: ${prefix}ss https://www.google.com`, id)
                    const ss = await scraper.apiflash(args[0])
                    await client.sendFile(from, ss, 'ss.jpg', '', id)
                        .catch(() => {
                            client.reply(from, 'Ada yang Error!', id)
                        })
                    break

                case 'covid':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (args.length === 0) return client.reply(from, `Kirim perintah *${prefix}covid [ negara ]*, contoh *${prefix}covid indonesia*`, id)
                    const covid = await scraper.covid(args)
                    client.sendText(from, covid, id)
                    break

                case 'kalkulator':
                case 'calculator':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    let sl = txt
                    sl = replaceAll(sl, 'x', '*')
                    sl = replaceAll(sl, '÷', '/')
                    sl = replaceAll(sl, '=', '')
                    Calculator(sl).then(hasil => client.reply(from, `${hasil}`, id))
                    break

                case 'teksalay':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (args.length == 0) return client.reply(from, `Kirim ${prefix}teksalay [teks]`, id)
                    client.sendText(from, TeksAlay(txt.toRandomCase()), id)
                    break

                case 'artinama':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (args.length == 0) return client.reply(from, `Kirim ${prefix}artinama [nama]`, id)
                    const getartin = await primbon.artiNama(txt)
                    client.sendText(from, getartin, id)
                    break

                case 'artimimpi':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (args.length == 0) return client.reply(from, `Kirim ${prefix}artimimpi [kata kunci mimpi]. Contoh ${prefix}artimimpi hantu`, id)
                    const getartim = await primbon.tafsirMimpi(txt)
                    client.sendText(from, getartim, id)
                    break

                case 'cocok?':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    const nama1 = arg.split('&')[0]
                    const nama2 = arg.split('&')[1]
                    const getartij = await primbon.Jodoh(nama1, nama2)
                    console.log(getartij)
                    let love, tkcck
                    if (getartij.love.includes("1")) {
                        love = 1
                        tkcck = "10%"
                    } else if (getartij.love.includes("2")) {
                        love = 2
                        tkcck = "30%"
                    } else if (getartij.love.includes("3")) {
                        love = 3
                        tkcck = "50%"
                    } else if (getartij.love.includes("4")) {
                        love = 4
                        tkcck = "80%"
                    } else if (getartij.love.includes("5")) {
                        love = 5
                        tkcck = "100%"
                    }
                    client.sendText(from, `${nama1} dan ${nama2}\n\nTingkat Kecocokan: ${tkcck}\nSisi Positif: ${getartij.positif}\nSisi Negatif: ${getartij.negatif}`, id)
                    client.sendStickerfromUrl(from, `https://izo.my.id/img/Bahan/love${love}.png`, ``, {
                        author: Sticker.author,
                        pack: Sticker.pack
                    })
                    break

                case 'totext':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (isMedia && type === 'image' || isQuotedImage) {
                        client.reply(from, langID.wait(), id)
                        const encryptMedia = isQuotedImage ? quotedMsg : message
                        mediaData = await decryptMedia(encryptMedia, uaOverride)
                        client.reply(from, await OCR(mediaData), id)
                    } else {
                        client.sendText(from, `Silakan kirim/reply gambar dengan caption *${prefix}totext*`)
                    }
                    break

                case 'play':
                    if (isGSCH) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (!args.length >= 1) return client.reply(from, `Format salah, ${prefix}play judul lagu - artis`, id)
                    client.simulateTyping(from, true)
                    yts(body.slice(6))
                        .then((res) => {
                            const {
                                title,
                                description,
                                url,
                                videoId,
                                seconds,
                                timestamp,
                                duration,
                                views,
                                genre,
                                uploadDate,
                                ago,
                                image,
                                thumbnail,
                                author
                            } = res.videos[0]
                            fetch(`https://api.izo.my.id/yta?url=https://youtu.be/${videoId}`)
                                .then((res) => res.json().then(async (body) => {
                                    const link = await scraper.urlShortener(body.result)
                                    if (seconds >= 800) {
                                        client.reply(from, `Judul: *${title}*\nUploader: *${author.name}*\nDurasi: *${ await convertTime(seconds)}* terlalu panjang.\nkamu bisa download sendiri menggunakan link ini. ${link}`)
                                        client.simulateTyping(from, false)
                                    } else {
                                        client.reply(from, `Judul: *${title}*\nUploader: *${author.name}*\nDurasi: *${ await convertTime(seconds)}*\n\n _*Sedang mengirim audio*_`, id)
                                        client.sendFile(from, link, `${title}.mp3`, null, id)
                                        client.simulateTyping(from, false)
                                    }
                                }))
                                .catch((err) => {
                                    console.log(err)
                                    client.sendText(from, `Error`)
                                    client.simulateTyping(from, false)
                                })
                        }).catch(err => {
                            console.log(err)
                            client.reply(from, `Error`, id);
                            client.simulateTyping(from, false)
                        })
                    break

                case 'motivasi':
                    fetch('https://oldpastz.izo.my.id/raw/HAR9k6uTlc')
                        .then(res => res.text().then(body => {
                            let splitmotivasi = body.split('\n')
                            let randommotivasi = splitmotivasi[Math.floor(Math.random() * splitmotivasi.length)]
                            client.reply(from, randommotivasi, id)
                        }))
                        .catch((err) => {
                            console.error(err)
                            client.reply(from, 'Ada yang Error!', id)
                        })
                    break
                case 'tag':
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (!isGroupMsg) return client.reply(from, 'perintah ini hanya dapat digunakan di dalam grup', id)
                    if (!args.length >= 1) return client.reply(from, 'Pesan tidak boleh kosong', id)
                    let tunjuk = groupMembers[Math.floor(Math.random() * groupMembers.length)]
                    Getmem: while (tunjuk == botNumber) {
                        if (tunjuk == botNumber) {
                            tunjuk = groupMembers[Math.floor(Math.random() * groupMembers.length)]
                            continue Getmem
                        } else {
                            continue
                        }
                    }
                    client.sendTextWithMentions(from, `${txt} 👉 @${tunjuk}`, id)
                    break

                case 'join':
                    if (!isOwner) return
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (args.length >= 1) {
                        const link = body.slice(6)
                        const invite = link.replace('https://chat.whatsapp.com/', '')
                        if (link.match(/(https:\/\/chat.whatsapp.com)/gi)) {
                            const check = await client.inviteInfo(invite);
                            if (!check) {
                                client.reply(from, 'Sepertinya link grup bermasalah', id)
                            } else {
                                await client.joinGroupViaLink(invite)
                                client.reply(from, 'Bergabung', id)
                            }
                        } else {
                            client.reply(from, 'Link chat grup salah atau sudah expired', id)
                        }
                    } else {
                        client.reply(from, `Kirim perintah *${prefix}join* link group\n\nEx:\n#join https://chat.whatsapp.com/***`, id)
                    }
                    break

                case 'add':
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                    if (args.length === 0) return client.reply(from, `Untuk menggunakan fitur ini, kirim perintah *${prefix}add* 628xxxxx`, id)
                    if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                    if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                    try {
                        await client.addParticipant(from, `${txt}@c.us`)
                    } catch {
                        client.reply(from, 'err', id)
                    }
                    break

                case 'kick':
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
                    if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
                    if (!isBotGroupAdmins) return client.reply(from, 'Wahai admin, jadikan saya sebagai admin grup dahulu :)', id)
                    if (mentionedJidList.length === 0) return client.reply(from, 'Tag member yang akan di kick', id)
                    if (mentionedJidList[0] === botNumber) return await client.reply(from, ':)', id)
                    await client.sendTextWithMentions(from, `Request diterima, mengeluarkan ${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')}`)
                    for (let i = 0; i < mentionedJidList.length; i++) {
                        if (groupAdmins.includes(mentionedJidList[i])) return await client.sendText(from, 'Gagal, kamu tidak bisa mengeluarkan admin grup.')
                        await client.removeParticipant(groupId, mentionedJidList[i])
                    }
                    break

                    //#sekolah
                case 'absen':
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (!isGroupMsg) return client.reply(from, "Hanya Grup", id)
                    if (!isRegGrup) return client.reply(from, `Grup belum terdaftar *${prefix}daftar* untuk mendaftarkan grup`, id)
                    if (guruorpgls) {
                        let pesanAB = txt
                        if (!args.length == 0) {
                            pesanAB = txt
                        }
                        updateJson(DataAbsensiJSON, (data) => {
                                data[chatId] = {
                                    judulabsen: pesanAB,
                                    jumlahsiswa: UserData.grup[chatId].sekolah.jumlahsiswa,
                                    absensi: []
                                }
                                return data
                            })
                            .then(() => {
                                client.sendText(from, 'List Absen Telah dibuat', id)
                            })
                            .catch(error => console.error(error))
                    } else return client.reply(from, 'Kamu bukan penguruskelas', id)
                    break

                case 'hadir':
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (!isGroupMsg) return client.reply(from, "Hanya Grup", id)
                    if (!isRegGrup) return client.reply(from, `Grup belum terdaftar *${prefix}daftar* untuk mendaftarkan grup`, id)
                    if (!UserData.user[`${sender.id}`].profile.sekolah.status === "Guru") return client.reply(from, 'Maaf absen hanya diperuntukkan untuk siswa', id)
                    const Cekkehadiran = await cekkehadiran()
                    if (Cekkehadiran.status && args.length === 0) {
                        client.reply(from, 'Kamu sudah absen', id)
                    } else if (Cekkehadiran.status) {
                        updateJson(DataAbsensiJSON, (data) => {
                                data[chatId].absensi[`${Cekkehadiran.index}`].pesan = txt
                                return data
                            })
                            .then(() => {
                                client.reply(from, 'Pesan absen telah diganti', id)
                            })
                            .catch(error => console.error(error))
                    } else {
                        const usrabs = {
                            nama: `${UserData.user[`${sender.id}`].profile.nama}`,
                            absen: `${UserData.user[`${sender.id}`].profile.sekolah.absen}`,
                            pesan: txt,
                            waktu: moment().format('HH.mm.ss')
                        }
                        updateJson(DataAbsensiJSON, (data) => {
                                data[chatId].absensi.push(usrabs)
                                return data
                            })
                            .then(() => {
                                client.reply(from, 'Absen telah terisih', id)
                            })
                            .catch(error => console.error(error))
                    }
                    break

                case 'absensi':
                case 'listabsensi':
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    if (!isGroupMsg) return client.reply(from, "Hanya Grup", id)
                    if (!isRegGrup) return client.reply(from, `Grup belum terdaftar *${prefix}daftar* untuk mendaftarkan grup`, id)
                    if (!guruorpgls) return client.reply(from, "Hanya dapat digunakan oleh guru/pengurus kelas", id)
                    if (args[0] === 'excel') {
                        await absensi.excel(chatId).then((dir) => {
                                client.sendFile(from, dir, 'absensi.xlsx', id)
                            })
                            .catch(error => console.error(error))
                    } else {
                        client.reply(from, await absensi.kehadiran(chatId), id)
                    }
                    break

                    //#owner
                case 'deluser':
                    if (!isOwner) return
                    if (args.length === 0) return client.reply(from, 'Nomornya?', id)
                    if (isNaN(args[0])) return await client.reply(from, 'Angka!!', id)
                    const NODelP = args[0] + '@c.us'
                    if (UserData.user[NODelP] === undefined) return client.reply(from, 'Nomor tidak ada di DB', id)
                    updateJson(UserDataJSON, (data) => {
                            delete data.user[NODelP]
                            return data
                        })
                        .then(() => {
                            client.sendText(from, 'Pendaftaran telah dihapus', id)
                        })
                        .catch(error => console.error(error))
                    break

                case 'delgrup':
                    if (!isOwner) return
                    updateJson(UserDataJSON, (data) => {
                            delete data.grup[chatId]
                            return data
                        })
                        .then(() => {
                            client.sendText(from, 'Pendaftaran Grup telah dihapus', id)
                        })
                        .catch(error => console.error(error))
                    break

                case 'gchat':
                    if (!isOwner) return await client.reply(from, 'Anda Siapa?', id)
                    if (args[0] === 'on') {
                        if (setting.general.GlobalChat) return await client.reply(from, 'Global chat sudah on', id)
                        setting.general.GlobalChat = true
                        GlobalChat = true
                        fs.writeFileSync('./settings.json', JSON.stringify(setting, null, 2))
                        client.reply(from, 'Obrolan global telah diaktifkan!', id)
                    } else if (args[0] === 'off') {
                        if (!setting.general.GlobalChat) return await client.reply(from, 'Global chat sudah off', id)
                        setting.general.GlobalChat = false
                        GlobalChat = false
                        fs.writeFileSync('./settings.json', JSON.stringify(setting, null, 2))
                        client.reply(from, 'Obrolan global telah dinonaktifkan!', id)
                    } else {
                        client.sendText(from, `${prefix}gchat on/off`, id)
                    }
                    break

                case 'stat':
                case 'stats':
                case 'botstat':
                case 'ping':
                    if (!isReg) return client.reply(from, langID.notReg(prefix, isPrivate), id)
                    client.simulateTyping(from, true)
                    const os = require('os')
                    const loadedMsg = await client.getAmountOfLoadedMessages()
                    const chatIds = await client.getAllChatIds()
                    const groups = await client.getAllGroups()
                    const battery = await client.getBatteryLevel() === 'ERROR: NO_BATT_ON_MD' ? '♾️' : await client.getBatteryLevel()
                    const isCharged = await client.getBatteryLevel() === 'ERROR: NO_BATT_ON_MD' ? true : await client.getBatteryLevel()
                    const {
                        receive
                    } = JSON.parse(fs.readFileSync('./util/stat.json'))
                    const UPTIME = await convertTime(os.uptime())
                    const osPlatfom = await Platfom(os.platform())
                    const device = await client.getMe()
                    client.reply(from, `💻 *Platform Info* :\n- CPU: ${os.cpus()[0].model}\n- RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB\n- Platform: ${osPlatfom}\n- UPTIME: ${UPTIME}\n\n*📱 Device Info* :\n- 🔋 Battery: ${battery} ${isCharged ? '🔌 Charging...' : '⚡ Discharging'}\n- 24 Hours Online : ${device.is24h == undefined ? '♾️' : device.is24h }\n\n*Status* :\n- ${loadedMsg} Loaded Messages\n- ${groups.length} Group Chats\n- ${chatIds.length - groups.length} Personal Chats\n- ${chatIds.length} Total Chats\n- ${receive.chat} Chats Received\n\nSpeed: ${processTime(t, moment())} Second`, id)
                    client.simulateTyping(from, false)
                    break

                default:
                    if (body.length > 1) {
                        console.log(color('[ERROR]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), `Unregistered Command ${command} from`, color(pushname))
                        client.reply(from, `Perintah _*${command}*_ tidak terdaftar.`, id)
                    }
                    break
            }
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}