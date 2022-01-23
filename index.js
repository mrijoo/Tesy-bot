const fs = require('fs')
const {
    create,
    Client
} = require('@open-wa/wa-automate')
const {
    msgFilter,
    nocache
} = require('./util')
const {
    WA,
    general
} = setting = JSON.parse(fs.readFileSync('./settings.json'))
const OwnerNumber = setting.general.owner + '@c.us'
const updateJson = require('update-json-file');
const argsS = process.argv.slice(2)

let db
if (general.Register == "mysql") {
    db = require('./lib/db')
}

const start = (client = new Client()) => {
    console.log('[DEV]', msgFilter.color('mrijoo', 'green'))
    console.log('[WEBSITE]', msgFilter.color('mrijoo.net', 'green'))
    console.log('[CLIENT] CLIENT Started!')

    client.onAnyMessage((fn) => messageLog(fn.fromMe, fn.type))
    var messageLog = function messageLog(fromMe, type) {
        return updateJson('./util/stat.json', function (data) {
            fromMe ? data.sent[type] ? data.sent[type] += 1 : data.sent[type] = 1 : data.receive[type] ? data.receive[type] += 1 : data.receive[type] = 1;
            return data;
        });
    };

    client.onStateChanged((state) => {
        console.log('[Client State]', state)
        if (state === 'CONFLICT' || state === 'DISCONNECTED') client.forceRefocus()
    })

    client.onMessage((message) => {
        client.getAmountOfLoadedMessages().then((msg) => (msg >= 1000) && client.cutMsgCache())
        if (general.Register == "json") {
            require('./msgHandler')(client, message)
        } else if (general.Register == "mysql") {
            require('./msgHandler')(client, message, db)
        }
    })

    client.onAddedToGroup((chat) => {
        client.sendText(chat.groupMetadata.id, `Halo member grup *${chat.contact.name}* terimakasih sudah menginvite bot`)
    })

    client.onIncomingCall((call) => {
            client.sendText(call.peerJid, 'Maaf, bot tidak bisa menerima panggilan. Bot otomatis memblokir apabila menerima panggilan')
                .then(() => client.contactBlock(call.peerJid))
        })
        .catch((err) => {
            console.error(err)
        })

    client.onPlugged(async (Plugged) => {
        Plugged ? console.log('[DEVICE]', msgFilter.color('🔌 Charging...', 'lime')) : console.log('[DEVICE]', msgFilter.color('⚡ Discharging!', 'lime'))
        while (Plugged) {
            if (await client.getBatteryLevel() == 100) {
                console.log('[DEVICE]', msgFilter.color('🔋 Battery Level 100', 'lime'))
                client.sendText(OwnerNumber, 'Battery Level 100')
                break
            } else {
                Plugged = await client.getIsPlugged()
            }
        }
    })
}
let session
if (argsS === undefined) {
    session = 'session'
    nocache(session)
} else {
    session = argsS
}

nocache(session)
const options = {
    sessionId: `${session}`,
    multiDevice: WA.multiDevice,
    headless: WA.headless,
    ezqr: WA.ezqr,
    popup: WA.popup,
    qrTimeout: WA.qrTimeout,
    authTimeout: WA.authTimeout,
    restartOnCrash: start,
    cacheEnabled: WA.cacheEnabled,
    useChrome: WA.useChrome,
    hostNotificationLang: WA.hostNotificationLang,
    logConsole: WA.logConsole,
    killProcessOnBrowserClose: WA.killProcessOnBrowserClose,
    throwErrorOnTosBlock: WA.throwErrorOnTosBlock,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
    ]
}

create(options)
    .then((client) => start(client))
    .catch((err) => new Error(err))