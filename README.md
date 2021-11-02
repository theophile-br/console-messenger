# Console Messenger

Console Messenger is a **console**, **local**, **encrypted** and **real time** chat application

# Launch

```bash
node console-messenger.js -p {{pseudo}}
```

# Explaination

The app use UDP protocol to use send message.

The node module crypto and cipher is use to decrypt and decrypt message.

At the start of the application, the program search friend on the local network by brodacasting to all local addresse 192.168.\*.\*
