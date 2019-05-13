const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const dotenv = require('dotenv');

dotenv.config();
const { PORT } = process.env;
if (!PORT) {
  throw new Error('missing environment variables');
}

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    clientLogLevel: 'error',
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
    open: true,
    port: PORT
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
});
