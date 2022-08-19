import { resolve as _resolve } from "path";

const mode = process.env.NODE_ENV;

export const entry = "./src/index.ts";
export const output = {
  path: _resolve(__dirname, "dist"),
  filename: "bundle.js",
  clean: true,
  environment: {
    arrowFunction: false,
  },
};
export const devtool = mode === "production" ? "source-map" : "eval-source-map";
export const module = {
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
};
export const resolve = {
  extensions: [".tsx", ".ts", ".js"],
};
