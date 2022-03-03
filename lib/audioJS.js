//https://github.com/shime/play-sound/blob/master/index.js
//https://github.com/shime/find-exec
var exec = require('child_process').execSync
var platform = require('os').platform()

const findExec = function () {
    var commands = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.apply(arguments)
    var command = null

    commands.some(function (c) {
        if (isExec(findCommand(c))) {
            command = c
            return true
        }
    })

    return command
}

function isExec(command) {
    try {
        exec(command, { stdio: 'ignore' })
        return true
    }
    catch (_e) {
        return false
    }
}

function findCommand(command) {
    if (/^win/.test(platform)) {
        return "where " + command
    } else {
        return "command -v " + command
    }
}


var fs = require('fs')
    , spawn = require('child_process').spawn
    , players = [
        'mplayer',
        'afplay',
        'mpg123',
        'mpg321',
        'play',
        'omxplayer',
        'aplay',
        'cmdmp3',
        'cvlc',
        'powershell'
    ]

function Play(opts) {
    opts = opts || {}

    this.players = opts.players || players
    this.player = opts.player || findExec(this.players)
    this.urlRegex = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/i
    // Regex by @stephenhay from https://mathiasbynens.be/demo/url-regex

    this.play = function (what, options, next) {
        next = next || function () { }
        next = typeof options === 'function' ? options : next
        options = typeof options === 'object' ? options : {}
        options.stdio = 'ignore'

        var isURL = this.player == 'mplayer' && this.urlRegex.test(what)

        if (!what) return next(new Error("No audio file specified"))

        if (!this.player) {
            return next(new Error("Couldn't find a suitable audio player"))
        }

        var args = Array.isArray(options[this.player]) ? options[this.player].concat(what) : [what]
        var process = spawn(this.player, args, options)
        if (!process) {
            next(new Error("Unable to spawn process with " + this.player))
            return null
        }
        process.on('close', function (err) { next(err && !err.killed ? err : null) })
        return process
    }

    this.test = function (next) { this.play('./assets/test.mp3', next) }
}


// $ mplayer foo.mp3 
new Play().play('foo.mp3', function (err) {
    if (err) throw err
})

// // { timeout: 300 } will be passed to child process
// player.play('foo.mp3', { timeout: 300 }, function(err){
//   if (err) throw err
// })

// // configure arguments for executable if any
// player.play('foo.mp3', { afplay: ['-v', 1 ] /* lower volume for afplay on OSX */ }, function(err){
//   if (err) throw err
// })

// // access the node child_process in case you need to kill it on demand
// var audio = player.play('foo.mp3', function(err){
//   if (err && !err.killed) throw err
// })
// audio.kill()