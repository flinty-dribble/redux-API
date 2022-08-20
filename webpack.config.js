/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require("path");

const mode = process.env.NODE_ENV;

module.exports = {
  entry: "./src/redux.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
    environment: {
      arrowFunction: false,
    },
  },
  devtool: mode === "production" ? "source-map" : "eval-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
