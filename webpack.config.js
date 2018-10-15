const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtWebpackPlugin = require("@sencha/ext-react-webpack-plugin");
const portfinder = require("portfinder");
const sourcePath = path.join(__dirname, "./src");

module.exports = function(env) {
  env = env || {};
  var buildprofile =
    env.profile || process.env.npm_package_extbuild_defaultprofile;
  var buildenvironment =
    env.environment || process.env.npm_package_extbuild_defaultenvironment;
  var buildverbose =
    env.verbose || process.env.npm_package_extbuild_defaultverbose;
  if (buildprofile == "all") {
    buildprofile = "";
  }
  const isProd = buildenvironment === "production";

  portfinder.basePort = (env && env.port) || 1962; // the default port to use
  return portfinder.getPortPromise().then(port => {
    const plugins = [
      new HtmlWebpackPlugin({
        template: "index.html",
        hash: true
      })
      // new ExtWebpackPlugin({
      //   framework: "react",
      //   port: port,
      //   profile: buildprofile,
      //   environment: buildenvironment,
      //   verbose: buildverbose
      // })
    ];
    if (!isProd) {
      plugins.push(new webpack.HotModuleReplacementPlugin());
    }
    return {
      mode: "development",
      cache: true,
      devtool: isProd ? "source-map" : "cheap-module-source-map",
      context: sourcePath,
      entry: path.join(__dirname, "src", "index.js"),
      output: {
        path: path.join(__dirname, "build"),
        filename: "index.bundle.js"
      },
      mode: process.env.NODE_ENV || "development",
      resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"]
      },

      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ["babel-loader"]
          },
          {
            test: /\.(css|scss)$/,
            use: [
              "style-loader", // creates style nodes from JS strings
              "css-loader", // translates CSS into CommonJS
              "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
          },
          {
            test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
            loaders: ["file-loader"]
          }
        ]
      },
      plugins,
      devServer: {
        contentBase: path.join(__dirname, "src", "./build"),
        historyApiFallback: true,
        hot: false,
        host: "0.0.0.0",
        port: port,
        disableHostCheck: false,
        compress: isProd,
        inline: !isProd,
        stats: {
          assets: false,
          children: false,
          chunks: false,
          hash: false,
          modules: false,
          publicPath: false,
          timings: false,
          version: false,
          warnings: false,
          colors: {
            green: "\u001b[32m"
          }
        }
      }
    };
  });
};
