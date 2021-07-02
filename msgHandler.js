require('dotenv').config()
const {
    decryptMedia
} = require('@open-wa/wa-automate')
const fs = require('fs')
const got = require('got')
const mathjs = require("mathjs");
const primbon = require('primbon-scraper')
const {
    chatAI,
    removebg,
    tsc,
    scraper
} = require('./lib')
const {
    msgFilter,
    color,
    processTime,
    isUrl
} = require('./util/msgFilter')
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta').locale('id')
const simi = JSON.parse(fs.readFileSync('./lib/json/simi.json'))
const botset = JSON.parse(fs.readFileSync('./lib/json/bot.json'))
let {
    general,
    sticker
} = setting = JSON.parse(fs.readFileSync('./settings.json'))
const {
    menuID
} = require('./message')
let prefix = general.prefix
let GlobalChat = general.GlobalChat
let Owner = general.owner

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
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        const botNumber = await client.getHostNumber() + '@c.us'
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isOwner = sender.id === Owner + '@c.us'
        const SimiPrivate = simi.private.includes(sender.id)
        const SimiGrup = simi.grup.includes(chatId)
        const isPrivate = sender.id === chat.contact.id
        const chats = (type === 'chat') ? body : (type === 'image' || type === 'video') ? caption : ''
        const isImage = type === 'image'

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
                resolve(jam + " jam " + menit + " menit " + detik + " detik ")
            } else if (menit > 0) {
                console.log(detik)
                resolve(menit + " menit " + detik + " detik ")
            } else {
                resolve(detik + " detik ")
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

        function TeksAlay(string) {
            let a = string.replace(/[A]/g, 4).replace(/[E]/g, 3);
            return a.toRandomCase();
        }
        async function CAI(iscmd, chat) {
            if (!isCmd) {
                if (isPrivate) {
                    if (SimiPrivate) {
                        let chatai = await chatAI(chat, iscmd, prefix)
                        console.log(chatai)
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
                        let chatai = await chatAI(chat, SimiPrivate, iscmd)
                        let jkr = chatai.length
                        let jk = chatai.split(' ').length
                        let typing = (jk * jkr) / 40 / (100 / 2.2) * 1000;
                        let cekchatAI = chatai === undefined
                        console.log(jk)
                        console.log(typing)
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

        body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const uaOverride = process.env.UserAgent
        const arg = body.substring(body.indexOf(' ') + 1)
        const url = args.length !== 0 ? args[0] : ''
        const txt = body.slice(command.length + 2)
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        CAI(isCmd, chats)

        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg && !isOwner) {
            return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        }
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg && !isOwner) {
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

        msgFilter.addFilter(from)
        //client.sendSeen(chatId)

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
                    client.sendText(from, menuID.textMenu(pushname), id)
                    break

                case 'about':
                    client.sendText(from, menuID.textAbout(), id)
                    break

                case 'bot':
                case 'getbot':
                    client.sendText(from, `wa.me/${botNumber.replace('@c.us', '')}`)
                    client.sendContact(chatId, `${botNumber}`)
                    break

                case 'owner':
                case 'creator':
                    client.sendContact(chatId, `${Owner}@c.us`)
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
                    client.simulateTyping(from, true)
                    if ((isMedia && isImage || isQuotedImage) && args.length === 0) {
                        try {
                            const encryptMedia = isQuotedImage ? quotedMsg : message
                            const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                            const mediaData = await decryptMedia(encryptMedia, uaOverride)
                            const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                            await client.sendImageAsSticker(from, imageBase64, {
                                author: sticker.author,
                                pack: sticker.pack
                            }).then(() => {
                                console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                            })
                        } catch (err) {
                            console.error(err)
                            client.reply(from, 'Error!', id)
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
                                    author: sticker.author,
                                    pack: sticker.pack
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
                                author: sticker.author,
                                pack: sticker.pack
                            }).then(() => {
                                console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                            })
                        } else {
                            const hasil = await tsc(txt)
                            client.sendImageAsSticker(from, hasil, {
                                author: sticker.author,
                                pack: sticker.pack
                            })
                        }
                    } else if (isMedia) {
                        (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10)
                        try {
                            const mediaData = await decryptMedia(message, uaOverride)
                            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                            await client.sendMp4AsSticker(from, imageBase64, {}, {
                                author: sticker.author,
                                pack: sticker.pack
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
                                author: sticker.author,
                                pack: sticker.pack
                            })
                            console.log(`Sticker Gif Processed for ${processTime(t, moment())} Second`)
                        } catch (e) {
                            client.reply(from, `Size File terlalu besar! mohon kurangi durasi video.`, id)
                        }
                    } else if (args.length !== 1) return client.reply(from, `Kirim Gambar/Video dengan caption ${prefix}stiker / Dengan url giphy \nContoh : *${prefix}stiker https://media.giphy.com/media/fe85BL1FFJ85hKY8RH/giphy.gif*`, id)
                    client.simulateTyping(from, false)
                    break

                case 'gtts':
                    try {
                        if (args.length === 0) return client.reply(from, `Kirim perintah *${prefix}gtts [ kodebahasa ] [ Teks ]*, contoh *${prefix}gtts id hai kamu*`, id)
                        let bahasa = args[0]
                        console.log(args[0])
                        const gtts = require('node-gtts')(bahasa)
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
                    client.sendText(from, menuID.textKodeBahasa(), id)
                    break

                case 'simi':
                    if (isPrivate) {
                        let cek = simi.private.includes(sender.id)
                        if (args[0] == 'on') {
                            if (cek) return await client.reply(from, 'simi sudah on', id)
                            simi.private.push(`${sender.id}`)
                            fs.writeFile("./lib/json/simi.json", JSON.stringify(simi, null, 4), function (err) {
                                if (err) throw err;
                                client.sendText(from, 'simi aktif', id)
                            });
                        } else if (args[0] == 'off') {
                            if (!cek) return await client.reply(from, 'simi sudah off', id)
                            let ceknp = simi.private.indexOf(sender.id)
                            simi.private.splice(ceknp, 1)
                            fs.writeFile("./lib/json/simi.json", JSON.stringify(simi, null, 4), function (err) {
                                if (err) throw err;
                                client.reply(from, 'simi off!', id)
                            });
                        } else {
                            client.reply(from, `${prefix}simi on/off`)
                        }
                    } else if (isGroupMsg) {
                        if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
                        if (args.length !== 1) return client.reply(from, `Untuk mengaktifkan simi-simi pada Group Chat\n\nPenggunaan\n${prefix}simi on --mengaktifkan\n${prefix}simi off --nonaktifkan\n`, id)
                        let cek = simi.grup.includes(chatId);
                        if (args[0] == 'on') {
                            if (cek) return await client.reply(from, 'simi sudah on', id)
                            simi.grup.push(`${chatId}`)
                            fs.writeFile("./lib/json/simi.json", JSON.stringify(simi, null, 4), function (err) {
                                if (err) throw err;
                                client.sendText(from, 'simi aktif', id)
                            });
                        } else if (args[0] == 'off') {
                            if (!cek) return await client.reply(from, 'simi sudah off', id)
                            let ceknp = simi.grup.indexOf(chatId)
                            simi.grup.splice(ceknp, 1)
                            fs.writeFile("./lib/json/simi.json", JSON.stringify(simi, null, 4), function (err) {
                                if (err) throw err;
                                client.reply(from, 'simi off!', id)
                            });
                        } else {
                            client.reply(from, `Untuk mengaktifkan simi-simi pada Group Chat\n\nPenggunaan\n${prefix}simi on --mengaktifkan\n${prefix}simi off --nonaktifkan\n`, id)
                        }
                    }
                    break

                case 'gempa':
                case 'infogempa':
                    const getinfo = await got.get('https://api.izo.my.id/infogempa').json()
                    const {
                        potensi, koordinat, lokasi, kedalaman, magnitude, waktu, map
                    } = getinfo
                    const hasil = `*${waktu}*\n📍 *Lokasi* : *${lokasi}*\n〽️ *Kedalaman* : *${kedalaman}*\n💢 *Magnitude* : *${magnitude}*\n🔘 *Potensi* : *${potensi}*\n📍 *Koordinat* : *${koordinat}*`
                    client.sendFileFromUrl(from, map, 'shakemap.jpg', hasil, id)
                    break

                case 'gempadirasakan':
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
                    if (!isUrl(args[0])) return client.reply(from, `Screenshot website\n\nPemakaian: ${prefix}ss [url]\n\ncontoh: ${prefix}ss https://www.google.com`, id)
                    const ss = await scraper.apiflash(args[0])
                    await client.sendFile(from, ss, 'ss.jpg', '', id)
                        .catch(() => {
                            client.reply(from, 'Ada yang Error!', id)
                        })
                    break

                case 'covid':
                    if (args.length === 0) return client.reply(from, `Kirim perintah *${prefix}covid [ negara ]*, contoh *${prefix}covid indonesia*`, id)
                    const copid = await scraper.covid(args)
                    client.sendText(from, copid)
                    break

                case 'kalkulator':
                case 'calculator':
                    let sl = txt
                    sl = replaceAll(sl, 'x', '*')
                    sl = replaceAll(sl, '÷', '/')
                    sl = replaceAll(sl, '=', '')
                    Calculator(sl).then(hasil => client.reply(from, `${hasil}`, id))
                    break

                case 'teksalay':
                    if (args.length == 0) return client.reply(from, `Kirim ${prefix}teksalay [teks]`, id)
                    client.sendText(from, TeksAlay(txt.toRandomCase()), id)
                    break

                case 'artinama':
                    if (args.length == 0) return client.reply(from, `Kirim ${prefix}artinama [nama]`, id)
                    const getartin = await primbon.artiNama(txt)
                    client.sendText(from, getartin, id)
                    break

                case 'artimimpi':
                    if (args.length == 0) return client.reply(from, `Kirim ${prefix}artimimpi [kata kunci mimpi]. Contoh ${prefix}artimimpi hantu`, id)
                    const getartim = await primbon.tafsirMimpi(txt)
                    client.sendText(from, getartim, id)
                    break

                case 'cocok?':
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
                        author: sticker.author,
                        pack: sticker.pack
                    })
                    break

                    //#owner
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
                    client.simulateTyping(from, true)
                    const os = require('os')
                    const loadedMsg = await client.getAmountOfLoadedMessages()
                    const chatIds = await client.getAllChatIds()
                    const groups = await client.getAllGroups()
                    const battery = await client.getBatteryLevel()
                    const isCharged = await client.getIsPlugged()
                    const {
                        receive
                    } = JSON.parse(fs.readFileSync('./util/stat.json'))
                    const UPTIME = await convertTime(os.uptime())
                    const osPlatfom = await Platfom(os.platform())
                    const device = await client.getMe()
                    client.reply(from, `💻 *Platform Info* :\n- CPU: ${os.cpus()[0].model}\n- RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB\n- Platform: ${osPlatfom}\n- UPTIME: ${UPTIME}\n\n*📱 Device Info* :\n- 🔋 Battery: ${battery} ${isCharged ? '🔌 Charging...' : '⚡ Discharging'}\n- 24 Hours Online : ${device.is24h}\n\n*Status* :\n- ${loadedMsg} Loaded Messages\n- ${groups.length} Group Chats\n- ${chatIds.length - groups.length} Personal Chats\n- ${chatIds.length} Total Chats\n- ${receive.chat} Chats Received\n\nSpeed: ${processTime(t, moment())} Second`, id)
                    client.simulateTyping(from, false)
                    break

                default:
                    console.log(color('[ERROR]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Unregistered Command from', color(pushname))
                    if (isPrivate) {
                        client.sendText(from, "Perintah tidak terdaftar", id)
                    }
                    break
            }
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}