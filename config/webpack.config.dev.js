const _ = require('lodash')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VersionFilePlugin = require('webpack-version-file-plugin')

const config = require('./config.js')

module.exports = (env = { vendor: 'chrome' }) => _.merge({}, config, {
  mode: 'development',

  output: {
    path: path.resolve(__dirname, `../build/dev/${env.vendor}`)
  },

  devtool: 'source-map',

  plugins: [
    new CopyWebpackPlugin([{ from: './src' }], {
      ignore: ['js/**/*', 'manifest*.json', '.DS_Store'],
      copyUnmodified: false
    }),
    new VersionFilePlugin({
      packageFile: path.resolve(__dirname, '../package.json'),
      template: path.resolve(__dirname, `../src/manifest.${env.vendor}.json`),
      outputFile: path.resolve(__dirname, `../build/dev/${env.vendor}/manifest.json`)
    })
  ],

  watch: true
})
