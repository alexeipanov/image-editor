const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

module.exports = {
  entry: {
    app: './app/js/app.js',
  },
  output: {
    filename: 'app.js',
    path: __dirname + '/dist',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }]
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './app/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'app.css',
    }),
    new SVGSpritemapPlugin(
      [
        '**/file.svg',
        '**/undo.svg',
        '**/redo.svg',
        '**/times.svg',
        '**/font.svg',
        '**/image.svg',
        '**/palette.svg',
        '**/icons.svg',
        '**/bold.svg',
        '**/italic.svg',
        '**/align-left.svg',
        '**/align-center.svg',
        '**/align-right.svg'
      ],
      {
        sprite: {
          prefix: false,
          generate: {
            title: false
          }
        },
        output: {
          filename: 'images/icons.svg'
        }
    })
  ]
}
