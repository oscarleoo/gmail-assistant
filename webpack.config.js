const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    popup: "./src/popup/popup.js",
    background: "./src/background/background.js",
    content: "./src/content/content.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src/manifest.json",
          to: "manifest.json",
        },
        {
          from: "src/popup/popup.html",
          to: "popup.html",
        },
        {
          from: "src/popup/popup.css",
          to: "popup.css",
        },
        {
          from: "src/icons",
          to: "icons",
        },
      ],
    }),
  ],
  resolve: {
    extensions: [".js"],
  },
};
