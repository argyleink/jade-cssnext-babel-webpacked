const path                      = require('path')
const glob                      = require('glob')
const webpack                   = require('webpack')
const HtmlWebpackPlugin         = require('html-webpack-plugin')
const CopyWebpackPlugin         = require('copy-webpack-plugin')
const CleanWebpackPlugin        = require('clean-webpack-plugin')
const MiniCssExtractPlugin      = require("mini-css-extract-plugin")

const UglifyJsPlugin            = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin   = require("optimize-css-assets-webpack-plugin")

const PATHS = {
  output: `${__dirname}/public/`,
  src:    `./app`,
  views:  `./app/views/pages/`,
}

const PAGES = glob
  .sync(`${PATHS.views}**/*.jade`)
  .map(item => item.slice(PATHS.views.length, item.length - 5))

module.exports = {
  entry: PAGES.reduce((entries, entry) => {
    entries[entry] = path.resolve(__dirname, `${PATHS.views}${entry}.js`)
    return entries
  }, {}),
  output: {
    path:     PATHS.output,
    filename: 'js/[name].js',
    pathinfo: true
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'app/js'), 
      'node_modules'
    ],
    alias: {
      JS:  path.resolve(__dirname, 'app/js'),
      CSS: path.resolve(__dirname, 'app/css'),
    }
  },
  module: { rules: [
    {
      test:     /\.js$/,
      use:      [{
        loader: 'babel-loader',
        options: { presets: [
          ['babel-preset-env', {
            targets: {
              browsers: ['chrome > 55']
            },
            modules: false
          }]
        ]}
      }],
    },
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
      ]
    },
    { 
      test:     /\.jade$/,
      exclude:  /node_modules/,
      loader:   'jade-loader'
    },
  ]},
  plugins: [
    new CleanWebpackPlugin([PATHS.output]),
    ...PAGES.map(page =>
      new HtmlWebpackPlugin({
        filename: `${page}.html`,
        template: `${PATHS.views}${page}.jade`,
        inject:   false,
        page:     page,
        meta: {
          theme: '#000000'
        }
      })
    ),
    new MiniCssExtractPlugin({
      filename:       'css/[name].css',
      chunkFilename:  'css/[id].css',
    }),
    new CopyWebpackPlugin([{ 
      from: `${PATHS.src}/assets`,
      to:   'assets'
    }]),
  ],
  devServer: { 
    contentBase: PATHS.output,
    stats: {
      modules:  false,
      cached:   false,
      colors:   true,
      chunk:    false,
      children: false,
      builtAt:  false,
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name:       'common.bundle',
          chunks:     'initial',
          minChunks:  2
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: true,
          ecma:     7,
          toplevel: false,
          ie8:      false,
          safari10: false,
          output:   { comments: false },
          compress: { dead_code: true, drop_console: true }
        },
        sourceMap: false,
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
}