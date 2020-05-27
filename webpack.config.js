const path = require('path');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    plugins: [
        new MiniCssExtractPlugin({
            filename: "./[name]",
            allChunks: true,
        }),
    ],
    entry: {
        index: "./src/index.js",
        sudoku: "./src/sudoku.ts",
        "sudoku.css": "./src/sudoku.scss",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            { // sass / scss loader for webpack
                test: /\.(sass|scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                    {
                        loader: `postcss-loader`,
                        options: {
                            options: {},
                        }
                    },
                    'sass-loader',
                ],
            }
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname),
    },
};