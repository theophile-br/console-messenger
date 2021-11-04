// IMPORT
const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const readline = require("readline");
const os = require("os");
const crypto = require("crypto");
const { stdin: input, stdout: output } = require("process");
const rl = readline.createInterface({ input, output });
const algorithm = "aes-256-ctr";
const iv = crypto.randomBytes(16);

// CONFIG
const carnet = [];
const SECRET_KEY = "vOVH6sAzeNWjRRIqCc7rgsd01LwHzfR3";
const YOU = "YOU";
const SCAN_CMD = "/scan";
const port = 41234;
let pseudo = "";
let myLocalAddr = "";
let myMask = "";

// ENUM
const CODE = {
  HELLO: "HELLO",
  MESSAGE: "MSG",
};

// ARG PARSE
const main = () => {
  let pos = process.argv.indexOf("-p");
  pseudo = pos === -1 ? undefined : process.argv[pos + 1].toUpperCase();

  // IF NO ARGS
  if (pseudo === undefined) {
    console.log("missing args -p {{your-pseudo}}");
    process.exit();
  }

  // RETRIVE NETWORK INFO
  try {
    var addr = getMyLocalAdd().split("/")
  } catch {
    console.log("no network available")
    process.exit()
  }

  myLocalAddr = addr[0] ;
  myMask = addr[1] ;

  // WHEN YOU RECIEVE MESSAGE
  server.on("message", (buf, senderInfo) => {
    const data = decrypt("" + buf);
    ifAddrNotInCarnetAddIt(senderInfo.address);
    if (data.code === CODE.HELLO) {
      server.send(
        encrypt({ code: CODE.MESSAGE, content: `${pseudo} is here !` }),
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
        server.send(data, port, dest, (err, i) => {
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
    console.log(`My Local adresse IP is ${myLocalAddr}/${myMask}`);
    await netscan();
  });
};

// CODEC FUNCTION
const encrypt = (data) => {
  data = JSON.stringify(data);
  const cipher = crypto.createCipheriv(algorithm, SECRET_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  return JSON.stringify({
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  });
};

const decrypt = (hash) => {
  hash = JSON.parse(hash);
  const decipher = crypto.createDecipheriv(
    algorithm,
    SECRET_KEY,
    Buffer.from(hash.iv, "hex")
  );
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);
  return JSON.parse(decrpyted.toString());
};

// FUNC UTILS
// NET SCAN
const netscan = async () => {
  console.log("scaning network please wait..");
  let progress = 0;
  let max = 255;
  const nbrOfAddr = Math.pow(2,32 - parseInt(myMask))
  let ip = "";
  const a = new Array(parseInt(myMask)).fill(1).concat(new Array(32 - parseInt(myMask)).fill(0))
  const ipBit = [a.slice(0,8),a.slice(8,16),a.slice(16,24),a.slice(24,32)]
  const myLocalAddrSplit = myLocalAddr.split(".")
  for(let i = 0; i < ipBit.length; i++) {
    if(binToDec(ipBit[i].join("")) === 255) {
      ip += "" + myLocalAddrSplit[i] + "."
    } else {
      
    }
  }
  //console.log(nbrOfAddr)
  //console.log(ip)
  const promises = [];
  const hash = encrypt({ code: CODE.HELLO, content: "" });
  for (let i = 1; i < max; i++) {
      const a = `${ip}.${i}`;
      if (myLocalAddr === a) continue;
      promises.push(
        new Promise((resolve) =>
          server.send(hash, port, a, () => {
            progress++;
            process.stdout.write(
              `\r${Math.ceil((100 * progress) / (max - 1))} %`
            );
            resolve();
          })
        )
      );
  }
  await Promise.all(promises);
  console.log("\nWrite Something...\n");
};

//CONVERSION
const binToDec = (binary) => {
  return parseInt(binary, 2)
}

const decToBin = (dec) => {
  return (parseInt(myMask)).toString(2)
}

// ADD IP TO CARNET
const ifAddrNotInCarnetAddIt = (a) => {
  if (!carnet.includes(a)) {
    carnet.push(a);
  }
};

// GET LOCAL IP
const getMyLocalAdd = () => {
  var networkInterfaces = os.networkInterfaces();
  return Object.entries(networkInterfaces)
    .map((el) => el[1])
    .flat()
    .filter((el) => el.family === "IPv4")
    .find((el) => {
      return el.address !== "127.0.0.1" && el.address !== "localhost";
    }).cidr;
};

// LAUNCH PRG
main();
