const {
    create,
    Client
} = require('@open-wa/wa-automate')
const {
    color,
    nocache
} = require('./util')
const updateJson = require('update-json-file');
const argsS = process.argv.slice(2)

const start = (client = new Client()) => {
    console.log('[DEV]', color('mrijoo', 'green'))
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
        require('./msgHandler')(client, message)
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
    headless: true,
    qrTimeout: 0,
    authTimeout: 0,
    restartOnCrash: start,
    cacheEnabled: false,
    useChrome: true,
    killProcessOnBrowserClose: true,
    throwErrorOnTosBlock: false,
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