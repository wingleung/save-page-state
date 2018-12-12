const _ = require('lodash')
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VersionFilePlugin = require('webpack-version-file-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = require('./config.js')
const pkg = require('../package.json')

const appName = `${pkg.name}-${pkg.version}`

module.exports = _.merge({}, config, {
  mode: 'production',

  output: {
    path: path.resolve(__dirname, '../build/prod')
  },

  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },

  plugins: [
    new CopyWebpackPlugin([{ from: './src' }], {
      ignore: ['js/**/*', 'manifest.json', '.DS_Store'],
      copyUnmodified: true
    }),
    new VersionFilePlugin({
      packageFile: path.resolve(__dirname, '../package.json'),
      template: path.resolve(__dirname, '../src/manifest.json'),
      outputFile: path.resolve(__dirname, '../build/prod/manifest.json')
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' })
  ]
})
