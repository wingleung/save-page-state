const _ = require('lodash')
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VersionFilePlugin = require('webpack-version-file-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = require('./config.js')

module.exports = (env = { vendor: 'chrome' }) => _.merge({}, config, {
  mode: 'production',

  output: {
    path: path.resolve(__dirname, `../build/prod/${env.vendor}`)
  },

  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },

  plugins: [
    new CopyWebpackPlugin([{ from: './src' }], {
      ignore: ['js/**/*', 'manifest*.json', '.DS_Store'],
      copyUnmodified: true
    }),
    new VersionFilePlugin({
      packageFile: path.resolve(__dirname, '../package.json'),
      template: path.resolve(__dirname, `../src/manifest.${env.vendor}.json`),
      outputFile: path.resolve(__dirname, `../build/prod/${env.vendor}/manifest.json`)
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' })
  ]
})
