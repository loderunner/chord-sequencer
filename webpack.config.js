module.exports = {
    context: __dirname + '/js',
    entry: './index.js',
    output: {
        path: __dirname,
        filename: 'index.js'
    },
    resolve: {
        root: __dirname + '/js'
    },

    devtool : "#source-map"
};