// IMPORT
const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const readline = require("readline");
const os = require("os");
const fs = require("fs");
const crypto = require("crypto");
const { stdin: input, stdout: output } = require("process");
const rl = readline.createInterface({ input, output });
const algorithm = "aes-256-ctr";
const iv = crypto.randomBytes(16);

// CONFIG
const carnet = [];
const SECRET_KEY = "vOVH6sAzeNWjRRIqCc7rdgs01LwHzfR3";
const CODE = {
  HELLO: "HELLO",
  MESSAGE: "MSG",
};

// VAR
const YOU = "YOU";
const SCAN_CMD = "/scan";

// ARG PARSE
let pos = process.argv.indexOf("-n");
const pseudo = pos === -1 ? undefined : process.argv[pos + 1].toUpperCase();
const port = 41234;

// IF NO ARGS
if (pseudo === undefined) {
  console.log("missing args -p {{your-pseudo}}");
}

// FUNC UTILS
const getMyLocalAdd = () => {
  var networkInterfaces = os.networkInterfaces();
  return Object.entries(networkInterfaces)
    .map((el) => el[1])
    .flat()
    .filter((el) => el.family === "IPv4")
    .find((el) => {
      return el.address !== "127.0.0.1" && el.address !== "localhost";
    }).address;
};
var myLocalAddr = getMyLocalAdd();

// CODEC FUNCTION
const encrypt = (data) => {
  const cipher = crypto.createCipheriv(algorithm, SECRET_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    SECRET_KEY,
    Buffer.from(hash.iv, "hex")
  );
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);
  return decrpyted.toString();
};

// WHEN YOU RECIEVE MESSAGE
server.on("message", (buf, senderInfo) => {
  const data = JSON.parse(decrypt(JSON.parse("" + buf)));
  ifAddrNotInCarnetAddIt(senderInfo.address);
  if (data.code === CODE.HELLO) {
    server.send(
      JSON.stringify(
        encrypt({ code: CODE.MESSAGE, content: `${pseudo} is here` })
      ),
      port,
      senderInfo.address
    );
    return;
  }
  const mem = rl.line;
  rl.line = "";
  readline.clearLine(process.stdin, 0);
  readline.cursorTo(process.stdin, 0);
  rl.pause();
  console.log(data.content);
  rl.write(mem);
  rl.resume();
});

// WHEN YOU PRESS ENTER (SEND MESSAGE)
rl.on("line", (data) => {
  readline.moveCursor(process.stdin, 0, -1);
  readline.clearLine(process.stdin, 0);
  if (data !== SCAN_CMD) {
    console.log(`${YOU} : ${data}`);
    data = encrypt({ code: CODE.MESSAGE, content: `${pseudo} : ${data}` });
    for (const dest of carnet) {
      if (dest === myLocalAddr) continue;
      server.send(JSON.stringify(data), port, dest, (err, i) => {
        if (err) {
          console.log(err);
        }
      });
    }
  } else {
    netscan();
  }
});

// IF YOU CLOSE (CTRL^C)
server.on("close", () => {
  console.log("program stop");
  process.exit();
});

server.on("error", (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

rl.on("close", () => {
  console.log("program stop");
  process.exit();
});

// LISTENING
server.bind(port);
server.on("listening", async () => {
  console.clear();
  console.log(`My Local adresse IP is ${myLocalAddr}`);
  await netscan();
});

// NET SCAN
const netscan = async () => {
  console.log("scaning network please wait..");
  let progress = 0;
  let max = 255;
  const ip = "192.168";
  const promises = [];
  const hash = encrypt(JSON.stringify({ code: CODE.HELLO, content: "" }));
  for (let i = 1; i < max; i++) {
    for (let j = 1; j < max; j++) {
      const a = `${ip}.${i}.${j}`;
      if (myLocalAddr === a) continue;
      promises.push(
        new Promise((resolve) =>
          server.send(JSON.stringify(hash), port, a, () => {
            progress++;
            process.stdout.write(
              `\r${Math.ceil((100 * progress) / (max * max - 1))} %`
            );
            resolve();
          })
        )
      );
    }
  }
  await Promise.all(promises);
  process.stdout.write(`\n${carnet.length} camarade(s) found !\n`);
  console.log("Write Something...");
};

const ifAddrNotInCarnetAddIt = (a) => {
  if (!carnet.includes(a)) {
    carnet.push(a);
  }
};
