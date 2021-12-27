const fs = require('fs')
const axios = require('axios')
let { general, apikey } = JSON.parse(fs.readFileSync('./settings.json'))

const chatAI = async (chat, isCmd, prefix) => new Promise(async (resolve) => {
    //let regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    //chat = chat.replace(regex, "");
    chat = chat.toLowerCase();
    let isiChat = [{
            pesan: "hello",
            jawaban: "Hi"
        },
        {
            pesan: "%menu",
            jawaban: `${prefix}menu untuk melihat menu`
        },
        {
            pesan: "#menu",
            jawaban: `${prefix}menu untuk melihat menu`
        },
        {
            pesan: "/menu",
            jawaban: `${prefix}menu untuk melihat menu`
        },
        {
            pesan: "assalamualaikum",
            jawaban: "Waalaikumsalam"
        },
        {
            pesan: "apa kabar",
            jawaban: "alhamdulillah baik kamu?"
        },
        {
            pesan: "gimana kabar mu",
            jawaban: "alhamdulillah baik kamu?"
        },
        {
            pesan: "aku baik",
            jawaban: "alhamdulillah kalau baik ada apa ni?"
        },
        {
            pesan: "aku juga baik",
            jawaban: "alhamdulillah kalau baik ada apa ni?"
        },
        {
            pesan: "makasih",
            jawaban: "Sama - sama"
        },
        {
            pesan: "terima kasih",
            jawaban: "Sama - sama"
        },
        {
            pesan: "mau curhat",
            jawaban: "Silakan tapi maaf kalau ga nyambung dan jangan disingkat nanti aku ga ngerti"
        },
        {
            pesan: "boleh curhat",
            jawaban: "Boleh tapi maaf kalau ga nyambung dan jangan disingkat nanti aku ga ngerti"
        },
        {
            pesan: "bisa buatin stiker",
            jawaban: "Bisa kamu kirim aja gambar dengan caption .stiker atau reply .stiker gambar yang sudah ada nanti ku buatin"
        },
        {
            pesan: "bisa bikinin stiker",
            jawaban: "Bisa kamu kirim aja gambar dengan caption .stiker atau reply .stiker gambar yang sudah ada nanti ku buatin"
        },
        {
            pesan: "buatin stiker",
            jawaban: "Kamu kirim aja gambar dengan caption .stiker atau reply .stiker gambar yang sudah ada nanti ku buatin"
        },
        {
            pesan: "bikinin stiker",
            jawaban: "Kamu kirim aja gambar dengan caption .stiker atau reply .stiker gambar yang sudah ada nanti ku buatin"
        },
        {
            pesan: "ok",
            jawaban: "Ok"
        },
        {
            pesan: "hmm",
            jawaban: "Kenapa?"
        },
        {
            pesan: "cobaa",
            jawaban: "Simply count all typed entries and divide by five to get the number of words typed. To give an example, if you typed 200 characters in 1 minute, your net wpm typing speed would be (200 characters / 5) / 1 min = 40 WPM. If you typed 200 characters in 30 seconds your net speed would be (200/5) / 0.5 = 80 WPM."
        }
    ]

    for (let i = 0; i < isiChat.length; i++) {
        if (chat == "") return
        if (!isCmd) {
            if (chat.match(isiChat[i].pesan)) {
                resolve(isiChat[i].jawaban)
                break;
            } else {
                if (i == isiChat.length - 1) {
                    if (general.simsimi) {
                        resolve(simsimi(chat))
                    } else {
                        resolve(simi(chat))
                    }
                    break;
                }
            }
        }
    }
})

async function simi(chat) {
    const respon = await axios.get(`https://api.izo.my.id/sim?text=${encodeURIComponent(chat)}`)
    return (respon.data.result)
}

const simsimi = async (chat) => new Promise(async (resolve, reject) => {
    const headers = {
        "Content-Type": "application/json",
        "x-api-key": apikey.simsimi,
    };
    const options = {
        utext: chat,
        lang: "id",
        country: ["ID"],
        atext_bad_prob_max: 0.5,
    }
    await axios.post("https://wsapi.simsimi.com/190410/talk", options, {
            headers: headers,
        })
        .then(re => {
            resolve(re.data.atext);
        })
        .catch(error => {
            console.log(error)
            resolve(`Simsimi Error`);
        });
})

module.exports = chatAI;