const path = require('path');
module.exports = {
    target:"node",
    entry: "./src/app.ts",
    output: {
       filename: "app.js",
       path: path.resolve(__dirname, 'release')
    },
    resolve: {
       extensions: [".webpack.js", ".web.js", ".ts", ".js"]
    },
    module: {
       rules: [{ test: /\.ts$/, loader: "ts-loader" }]
    }
}