# Console Messenger

Console Messenger is a **console**, **lightweight**, **local**, **encrypted** and **real time** chat application.

# Execute

```bash
node console-messenger.js -p {{pseudo}}
```

# How it work ?

The app use **UDP** protocol to send message.

The node module crypto and cipher is use to encrypt and decrypt message.

At the start of the application, the program search friend on the local network by broadcasting to all local address.
