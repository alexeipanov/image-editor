let packages = {
  babel: require('broccoli-babel-transpiler'),
  sass: require('broccoli-sass-source-maps')(require('sass')),
  funnel: require('broccoli-funnel'),
  reload: require('broccoli-livereload'),
  uglify: require('broccoli-optimize-js'),
  imagemin: require('broccoli-imagemin'),
  svgstore: require('broccoli-svgstore'),
  merge: require('broccoli-merge-trees'),
};

let appHtml = new packages.funnel('app', { files: ['index.html'] });

let appFont = new packages.funnel('app/fonts', { destDir: 'fonts' });

let appIcons = new packages.funnel('app/images/icons');
appIcons = new packages.svgstore(appIcons, { outputFile: 'images/icons.svg' });

let optimizeImages = (node) => {
  return new packages.imagemin(node, {
    plugins: [
        require('imagemin-svgo')({ plugins: [{ cleanupIDs: false }] }),
    ]
  });
};

let appCss = new packages.sass(['app/scss'], 'app.scss', 'css/app.css');
let fabric = new packages.funnel('node_modules/fabric/dist/', { files: ['fabric.js'] });
fabric = new packages.uglify(fabric, { mangle: true, compress: true, sourceMap: false });
fabric = new packages.funnel(fabric, { destDir: 'vendor/js',
  getDestinationPath: function(relativePath) {
    if (relativePath === 'fabric.js') {
      return 'fabric.min.js';
    }
    return relativePath;
  }
});

let appJs = new packages.funnel('app/js', { files: ['app.js'], destDir: 'js' });

let editorJs = new packages.funnel('app/js', { files: ['editor.js', 'history.js'] });
editorJs = new packages.babel(editorJs, {
  browserPolyfill: true,
  minified: false,
   presets: [
    ['env', {
      'targets': {
        'browsers': [
          'last 1 Chrome versions',
          'last 1 Firefox versions',
          'last 1 Safari versions'
        ]
      }
    }]
  ],
});

editorJs = new packages.funnel(editorJs, { destDir: 'js' });

let app = new packages.merge([
  appJs,
  appCss,
  appHtml,
  appFont,
  appIcons,
  editorJs,
  fabric,
], { overwrite: true });

app = new packages.reload(app, {
  target: /^[a-zA-Z0-9._-]+.html$/
});

module.exports = app;
