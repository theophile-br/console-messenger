<h1> <img src="assets/logo.png" width="20px"/> Console Messenger</h1>

Console Messenger is a **console**, **lightweight**, **local**, **encrypted** and **real time** chat application.

# Build

```bash
npm i
npm run package
```

The program is available in the **bundle** directory.

# Execute

```bash
node bundle/console-messenger.js -p {{pseudo}}
```

# How it work ?

The app use **UDP** protocol to send message.

The node module crypto and cipher is use to encrypt and decrypt message.

At the start of the application, the program search friend on the local network by broadcasting to all local address.
