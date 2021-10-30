// IMPORT
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const readline = require('readline');
const os = require('os');
const path = require("path");
const fs = require("fs")
const crypto = require('crypto');
const { stdin: input, stdout: output } = require('process');
// os.homedir()
const rl = readline.createInterface({ input, output });
const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);

// CONFIG
const carnet = []
const SECRET_KEY = 'vOVH6sAzeNWjRRIqCc7rdgs01LwHzfR3';
const HELLO_WORLD = "HELLO";
const OK = "OK :)";
const CONF_FILE = "conf.json"

// VAR
const YOU = "YOU"
const pathToConf = path.join(process.argv[1], "..", "cool")
const fullPathToConf = path.join(pathToConf, CONF_FILE)
const SCAN_CMD = "/scan"
let pos = process.argv.indexOf("-n");
const pseudo = pos === -1 ? undefined : process.argv[pos + 1].toUpperCase();
const port = 41234;

// IF NO ARGS
if (!pseudo) {
    console.log("missing args -p {{your-pseudo}}")
}

// FUNC UTILS
if (!fs.existsSync(pathToConf)) {
    fs.mkdirSync(pathToConf, { recursive: true })
    fs.closeSync()
}
fs.writeFileSync(pathToConf, "OK")

const getMyLocalAdd = () => {
    var networkInterfaces = os.networkInterfaces();
    return Object.entries(networkInterfaces).map(el => el[1]).flat().filter(el => el.family === 'IPv4').find(el => { return el.address !== "127.0.0.1" && el.address !== "localhost" }).address
}
var myLocalAddr = getMyLocalAdd()

// CODEC FUNCTION
const encrypt = (data) => {
    const cipher = crypto.createCipheriv(algorithm, SECRET_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return JSON.stringify({
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    });
}

const decrypt = (hash) => {
    hash = JSON.parse(hash)
    const decipher = crypto.createDecipheriv(algorithm, SECRET_KEY, Buffer.from(hash.iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrpyted.toString()
}

// WHEN YOU RECIEVE MESSAGE
server.on('message', (buf, senderInfo) => {
    const data = '' + buf
    ifAddrNotInCarnetAddIt(senderInfo.address)
    if (data === HELLO_WORLD) {
        console.log("new camarade incomming !")
        server.send(OK, port, senderInfo.address)
        return;
    }
    if (data === OK) {
        return;
    }
    const mem = rl.line
    rl.line = ""
    readline.clearLine(process.stdin, 0)
    readline.cursorTo(process.stdin, 0)
    rl.pause();
    console.log(decrypt(data))
    rl.write(mem)
    rl.resume();
});

// WHEN YOU PRESS ENTER (SEND MESSAGE)
rl.on("line", (data) => {
    readline.moveCursor(process.stdin, 0, -1)
    readline.clearLine(process.stdin, 0)
    if (data !== SCAN_CMD) {
        console.log(`${YOU} : ${data}`)
        data = encrypt(`${pseudo} : ${data}`)
        for (const dest of carnet) {
            if (dest === myLocalAddr)
                continue;
            server.send(data, port, dest, (err, i) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    } else {
        netscan()
    }

})

// IF YOU CLOSE (CTRL^C)
server.on('close', () => {
    console.log("server stop")
    process.exit()
})

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

rl.on('close', () => {
    console.log("readline stop")
    process.exit()
})

// LISTENING
server.bind(port);
server.on('listening', async () => {
    console.clear();
    console.log(`My Local adresse IP is ${myLocalAddr}`)
    await netscan()
});

// NET SCAN
const netscan = async () => {
    console.log("scaning network please wait..")
    let progress = 0;
    let max = 255;
    const ip = "192.168"
    const promises = [];
    for (let i = 1; i < max; i++) {
        for (let j = 1; j < max; j++) {
            const a = `${ip}.${i}.${j}`
            if (myLocalAddr === a)
                continue
            promises.push(new Promise((resolve) => server.send(HELLO_WORLD, port, a, () => {
                progress++
                process.stdout.write(`\r${Math.ceil((100 * progress) / ((max * max) - 1))} %`)
                resolve()
            })))
        }
    }
    await Promise.all(promises)
    process.stdout.write(`\n${carnet.length} camarade(s) found !\n`)
    console.log("Write Something...");
}

// CARNET UPDATE METHOD
const ifAddrInCarnetRemoveIt = (a) => {
    if (carnet.includes(a)) {
        carnet = carnet.filter(el !== a)
    }
}

const ifAddrNotInCarnetAddIt = (a) => {
    if (!carnet.includes(a)) {
        carnet.push(a)
    }
}