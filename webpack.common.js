const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const fs = require('fs').promises;

const iconsList = [
  'file',
  'undo',
  'redo',
  'times',
  'font',
  'image',
  'palette',
  'icons',
  'bold',
  'italic',
  'align-left',
  'align-center',
  'align-right',
  'behance',
  'facebook',
  'github',
  'instagram',
  'linkedin',
  'pinterest',
  'reddit',
  'snapchat',
  'soundcloud',
  'strava',
  'twitter',
  'vimeo',
  'youtube'
];

let fontsMeta = [];
fonts_dir = 'node_modules/@fontsource/';

const fetchFontMeta = font => fs.readFile(`${fonts_dir}${font}/metadata.json`, 'utf8')
  .then(json => {
    let meta = JSON.parse(json);
    return {
      id: meta.fontId,
      name: meta.fontName,
      weights: meta.weights,
      styles: meta.styles
    }
  });


fs.readdir(fonts_dir)
  .then(fonts => Promise.all(fonts.map(font => fetchFontMeta(font))))
  .then(fonts => {
    fs.writeFile('app/js/fonts.js', `export default ${JSON.stringify(fonts)}`, 'utf8');
    fs.truncate('app/scss/fonts.scss');
    fonts.forEach(font =>
      font.weights.forEach(weight =>
        font.styles.forEach(style =>
          fs.appendFile('app/scss/fonts.scss', `@import "~@fontsource/${font.id}/latin-${weight}${style === 'italic' ? '-italic' : ''}.css";\n`, 'utf8')
        )
      )
    );
  });

module.exports = {
  entry: {
    app: './app/js/app.js',
  },
  output: {
    filename: 'app.js',
    path: __dirname + '/dist',
  },
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
        use: [
          { loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            }
          },
          'css-loader', 'sass-loader']
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
          options: {
            name: '[name].[ext]'
          }
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
            name: 'images/[name].[ext]',
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
    new SVGSpritemapPlugin(`**/?(solid|brands)/?(${iconsList.join('|')}).svg`,
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
