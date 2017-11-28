const path                = require('path')
const HtmlWebpackPlugin   = require('html-webpack-plugin')
const CopyWebpackPlugin   = require('copy-webpack-plugin')
const CleanWebpackPlugin  = require('clean-webpack-plugin')
const BrowserSyncPlugin   = require('browser-sync-webpack-plugin')

const PATHS = {
  output: `${__dirname}/public/`,
  src:    `./app`,
  port:   3030
}

const PAGES = require('fs')
  .readdirSync(`${PATHS.src}/js/`)
  .filter(item => item.search('.js') > 0)
  .map(item => item.slice(0, item.length - 3))

module.exports = {
  entry: PAGES.reduce((entries, entry) => {
    entries[entry] = path.resolve(__dirname, `${PATHS.src}/js/${entry}.js`)
    return entries
  }, {}),
  output: {
    path:     PATHS.output,
    filename: 'js/[name].js',
    pathinfo: true
  },
  module: { rules: [
    // {
    //   test:     /\.js$/,
    //   exclude:  /node_modules/,
    //   use:      [{
    //     loader: 'babel-loader',
    //     options: { presets: [
    //       ['babel-preset-env', {
    //         targets: {
    //           browsers: ['chrome > 55']
    //         }
    //       }]
    //     ]}
    //   }],
    // },
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
      exclude:  /node_modules/,
      loader: 'jade-loader'
    }
  ]},
  plugins: [
    new CleanWebpackPlugin([PATHS.output]),
    ...PAGES.map(name =>
      new HtmlWebpackPlugin({
        filename: `${name}.html`,
        template: `${PATHS.src}/${name}.jade`,
        inject:   false,
        meta: {
          theme: '#000000'
        }
      })
    ),
    new CopyWebpackPlugin([
      { from: `${PATHS.src}/images`, to: 'images' }
    ]),
    new BrowserSyncPlugin({
      host:   'localhost',
      port:   PATHS.port,
      proxy: 'http://localhost:8080/'
    }, {
      reload: false
    })
  ],
  devtool: '#eval-source-map',
  devServer: { 
    contentBase: PATHS.output
  },
}