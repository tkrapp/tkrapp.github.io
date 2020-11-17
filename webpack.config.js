const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const DEV_SERVER_HOST = "0.0.0.0";
const DEV_SERVER_PORT = 9000;

module.exports = {
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name]",
            allChunks: true,
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/html/index.html",
            chunks: ["index"],
        }),
        new HtmlWebpackPlugin({
            filename: "sudoku.html",
            template: "./src/html/sudoku.html",
            scriptLoading: "defer",
            inject: false,
            chunks: ["sudoku", "sudoku.css"],
        }),
    ],
    entry: {
        index: "./src/js/index.js",
        sudoku: "./src/js/sudoku.ts",
        "sudoku.css": "./src/css/sudoku.scss",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                // sass / scss loader for webpack
                test: /\.(sass|scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    "css-loader",
                    {
                        loader: `postcss-loader`,
                        options: {
                            options: {},
                        },
                    },
                    "sass-loader",
                ],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "build"),
    },
    devServer: {
        contentBase: path.join(__dirname, "dev"),
        compress: true,
        port: DEV_SERVER_PORT,
        host: DEV_SERVER_HOST,
    },
};
