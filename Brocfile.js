let packages = {
  babel: require('broccoli-babel-transpiler'),
  sass: require('broccoli-sass'),
  merge: require('broccoli-merge-trees'),
  concat: require('broccoli-concat'),
  funnel: require('broccoli-funnel'),
  reload: require('broccoli-livereload'),
  svgstore: require('broccoli-svgstore'),
};

let appHtml = new packages.funnel('app', { files: ['index.html'] });
let jquery = new packages.funnel('node_modules/jquery/dist/', { files: ['jquery.min.js'], destDir: 'vendor/js' });
let fabric = new packages.funnel('node_modules/fabric/dist/', { files: ['fabric.js'], destDir: 'vendor/js' });
let bootstrapJs = new packages.funnel('node_modules/bootstrap/dist/js', { files: ['bootstrap.min.js'], destDir: 'vendor/js' });
let bootstrapCss = new packages.funnel('node_modules/bootstrap/dist/css', { files: ['bootstrap.min.css'], destDir: 'vendor/css' });
let appCss = new packages.sass(['app/scss'], 'app.scss', 'css/app.css');
let appIcons = new packages.funnel('app/images/icons');
appIcons = new packages.svgstore(appIcons, { outputFile: 'images/icons.svg' });
let appJs = new packages.babel('app/js', {
  browserPolyfill: true,
  minified: false,
  presets: [
    ['env', {
      'targets': {
        'browsers': [
          'ie 11',
          'last 1 Chrome versions',
          'last 1 Firefox versions',
          'last 1 Safari versions'
        ]
      }
    }]
  ],
});

appJs = new packages.concat(appJs, {
  inputFiles: ['**/*.js'],
  outputFile: 'app.js'
});

appJs = new packages.funnel(appJs, { destDir: 'js' });

let app = new packages.merge([
  appJs,
  appCss,
  appHtml,
  appIcons,
  jquery,
  fabric,
  bootstrapJs,
  bootstrapCss
], { overwrite: true });

app = new packages.reload(app, {
  target: /^[a-zA-Z0-9._-]+.html$/
});

module.exports = app;