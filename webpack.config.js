const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const ASSETS_URL = 'assets/[name].[hash:8].[ext]'

module.exports = {
  context: __dirname,
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|svg|webp|avif|mp4|ogg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      state: path.resolve(__dirname, 'src/state/index.ts'),
      SlotMachine: path.resolve(__dirname, 'src/SlotMachine/index.ts'),
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: ASSETS_URL,
  },
  plugins: [new ForkTsCheckerWebpackPlugin({ devServer: false }), new HtmlWebpackPlugin({ template: './index.html' })],
  watchOptions: {
    ignored: /node_modules/,
  },
  devServer: {
    open: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 8080,
    server: {
      type: 'https',
      options: {
        requestCerts: true,
        key: path.join(__dirname, '.certs', 'dev.key'),
        cert: path.join(__dirname, '.certs', 'dev.cert'),
      },
    },
  },
}
