<h1> <img src="assets/logo.png" width="20px"/> Console Messenger</h1>

Console Messenger is a **NodeJS**, **console**, **lightweight**, **local**, **encrypted** and **real time** chat application on localnetwork.

You have to download [NodeJS](https://nodejs.org/en/download/)

You can find a ready to use version [here](https://github.com/theophile-br/console-messenger/tree/release)

# Build

```bash
npm i
npm run package
```

# Execute

```bash
node bundle/cm.js -p {{pseudo}}
```

# How it work ?

The app use **UDP** protocol to send message.

The node module crypto and cipher is use to encrypt and decrypt message.

At the start of the application, the program search friend on the local network by broadcasting to all local address.
