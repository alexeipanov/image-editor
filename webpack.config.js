const { CleanWebpackPlugin } = require('clean-webpack-plugin');
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
              ['@babel/preset-env', { targets: {
                  'browsers': [
                    'last 1 Chrome versions',
                    'last 1 Firefox versions',
                    'last 1 Safari versions'
                  ]
                }
              }]
            ]
          }
        }
      },
      {
        test: /\.(woff|woff2)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          }
        }]
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '',
          }
        },
        'css-loader'
        ]
      },
      {
        test: /\.(html)$/,
        use: [
        {
          loader: 'file-loader',

        },
        {
          loader: 'extract-loader',
          options: {
            publicPath: '',
          }
      },
        {
          loader: 'html-loader',
          options: {
            attributes: {
              list: [
                {
                  tag: 'img',
                  attribute: 'src',
                  type: 'src'
                }
              ]
            }
          }
        },


        ]
      },
      {
        test: /\.(png|jpe?g)$/i,
        exclude: /node_modules/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          }
        }]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'app.css',
    }),
    new SVGSpritemapPlugin('**/solid/?(file|undo|redo|times|font|image|palette|icons|bold|italic|align-left|align-center|align-right).svg',
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
