// IMPORT
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const readline = require('readline');
var os = require('os');
const crypto = require('crypto');

const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });
const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);
//192.168.232.87
//192.168.128.197
const getMyLocalAdd = () => {
    var networkInterfaces = os.networkInterfaces();
    return Object.entries(networkInterfaces).map(el => el[1]).flat().filter(el => el.family === 'IPv4').find(el => { return el.address !== "127.0.0.1" && el.address !== "localhost" }).address
}
var myLocalAddr = getMyLocalAdd()

const encrypt = (data) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
} 

const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrpyted.toString()        
}

// VAR
const YOU = "YOU"
const SCAN_CMD = "/scan"
let pos = process.argv.indexOf("-n");
const pseudo = pos === -1 ? undefined : process.argv[pos + 1].toUpperCase();
const port = 41234;
const carnet = [];

// IF NO ARGS
if (!pseudo) {
    console.log("missing args")
    process.exit()
}

// WHEN YOU RECIEVE MESSAGE
server.on('message', (msg, senderInfo) => {
    ifAddrNotInCarnetAddIt(senderInfo.address)
    const mem = rl.line
    rl.line = ""
    readline.clearLine(process.stdin, 0)
    readline.cursorTo(process.stdin, 0)
    rl.pause();
    console.log('' + msg)
    rl.write(mem)
    rl.resume();
});

// WHEN YOU PRESS ENTER (SEND MESSAGE)
rl.on("line", (data) => {
    readline.moveCursor(process.stdin, 0, -1)
    readline.clearLine(process.stdin, 0)
    if (data !== SCAN_CMD) {
        console.log(`${YOU} : ${data}`)
        for (const dest of carnet) {
            server.send(`${pseudo}: ${data}`, port, dest, (err, i) => {
                if (err) {
                    if (err.code === "EADDRNOTAVAIL") {
                        ifAddrInCarnetRemoveIt(a)
                    } else {
                        console.log(err)
                    }
                    return;
                }
            })
        }
    } else {
        console.log(data)
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
server.on('listening', () => {
    console.clear();
    console.log(`My Local adresse IP is ${myLocalAddr}`)
    //server.addMembership('224.0.0.114');
    server.send("COUCOU",port)
    console.log("Write Something...");
});

// NET SCAN
const netscan = async () => {
    const ip = "192.168"
    for (let i = 1; i < 255; i++) {
        for (let j = 1; j < 255; j++) {
            const a = `${ip}.${i}.${j}`
            if (myLocalAddr === a)
                continue
            console.log(a)
            server.emit
            // server.send("HELLO", port, a, (err, i) => {
            //     if (err) {
            //         ifAddrInCarnetRemoveIt(a)
            //         return;
            //     }
            //     ifAddrNotInCarnetAddIt(a)
            // })
        }
    }
    console.log(`${carnet.length} camarade found`)
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