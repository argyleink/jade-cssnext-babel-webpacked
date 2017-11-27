const path                = require('path')
const HtmlWebpackPlugin   = require('html-webpack-plugin')
const CopyWebpackPlugin   = require('copy-webpack-plugin')
const CleanWebpackPlugin  = require('clean-webpack-plugin')
const BrowserSyncPlugin   = require('browser-sync-webpack-plugin')

const PATHS = {
  output: `${__dirname}/public/`,
  jade:   `${__dirname}/app/jade/`
}

// todo: fetch this from the dir
const PAGES = [
  'index',
  'about',
]

module.exports = {
  entry: PAGES.reduce((entries, entry) => {
    entries[entry] = path.resolve(__dirname, `app/js/${entry}.js`)
    return entries
  }, {}),
  output: {
    path:     PATHS.output,
    filename: 'js/[name].js',
    pathinfo: true
  },
  cache: true,
  module: { rules: [
    {
      test:     /\.js$/,
      exclude:  /node_modules/,
      use:      [{
        loader: 'babel-loader',
        options: { presets: [
          ['babel-preset-env', {
            targets: {
              browsers: ['last 2 versions']
            }
          }]
        ]}
      }],
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        { loader: 'css-loader', options: { importLoaders: 1 } },
        'postcss-loader'
      ]
    },
    { 
      test: /\.jade$/,
      loader: 'jade-loader' // todo: get locals working
    }
  ]},
  plugins: [
    new CleanWebpackPlugin([PATHS.output]),
    ...PAGES.map(name =>
      new HtmlWebpackPlugin({
        filename: `${name}.html`,
        template: `${PATHS.jade}${name}.jade`,
        inject:   false
      })
    ),
    new CopyWebpackPlugin([
      { from: 'app/images', to: 'images' }
    ]),
    new BrowserSyncPlugin({
      host:   'localhost',
      port:   3030,
      proxy: 'http://localhost:8080/'
    }, {
      reload: false
    })
  ],
  devtool: '#eval-cheap-module-source-map',
  devServer: { 
    contentBase: PATHS.output
  },
}