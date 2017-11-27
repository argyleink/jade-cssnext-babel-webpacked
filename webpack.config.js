const path                = require('path')
// const ExtractTextPlugin   = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin   = require('html-webpack-plugin')
const CopyWebpackPlugin   = require('copy-webpack-plugin')
const CleanWebpackPlugin  = require('clean-webpack-plugin')
const Dashboard           = require('webpack-dashboard/plugin')

const PATHS = {
  output: `${__dirname}/public/`,
  jade:   `${__dirname}/app/jade/`
}

let jadePage = name => {
  return new HtmlWebpackPlugin({
    filename: `${name}.html`,
    template: `${PATHS.jade}${name}.jade`,
    inject:   false
  })
}

module.exports = {
  entry: {
    index: path.resolve(__dirname, ('app/js/index.js')),
    // about: path.resolve(__dirname, (PATHS.entries + 'about.js'))
  },
  output: {
    path:     PATHS.output,
    filename: 'js/[name].js',
    pathinfo: true
  },
  cache: true,
  module: { rules: [
    {
      test:     /\.css$/,
      use: [
        'style-loader',
        { loader: 'css-loader', options: { importLoaders: 1 } },
        'postcss-loader'
      ]
    },
    { 
      test:     /\.jade$/,
      use:      [{
        loader: 'jade-loader',
        options: {
          locals: {
            project: 'Bolt'
          }
        }
      }]
    }
  ]},
  plugins: [
    new CleanWebpackPlugin([PATHS.output]),
    jadePage('index'),
    // jadePage('about'),
    // new ExtractTextPlugin('css/[name].css'),
    new CopyWebpackPlugin([
      { from: 'app/images', to: 'images' }
    ]),
    new Dashboard()
  ],
  devtool: '#eval-cheap-module-source-map', //inline-source-map
  devServer: { 
    contentBase:  PATHS.output,
    port:         3030
  },
}