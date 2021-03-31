import fonts from './fonts';
import { FontList } from './fontList'
import Store from './store';
import ImageEditor from './editor';
import Vue from 'vue/dist/vue.js';
import VueHead from 'vue-head';
import '../scss/app.scss';
import html from '../index.html';
import image1 from '../images/courtney-corlew-472715.jpg';
import image2 from '../images/everaldo-coelho-486015.jpg';
import image3 from '../images/willian-justen-de-vasconcellos-507620.jpg';
import image4 from '../images/gleb-kozenko-262704.jpg';
import bg1 from '../images/joe-woods-4Zaq5xY5M_c.jpg';
import bg2 from '../images/vincent-burkhead-LhlxYMfnTF0.jpg';
import bg3 from '../images/w-qjCHPZbeXCQ.jpg';
import bg4 from '../images/jj-ying-7JX0-bfiuxQ.jpg';
import FontFaceObserver from 'fontfaceobserver';
import SvgExtractor from './utils/svgExtractor';

window.addEventListener('load', () => {
  Vue.use(VueHead);
  let fontList = new FontList(fonts);
  Promise.all(fontList.files().map(file => new FontFaceObserver(file.name, { style: file.style, weight: file.weight }).load()))
    .then(() => {

      let store =  new Store({
        fonts: fontList.fonts,
        images: [image1, image2, image3, image4],
        backgrounds: [bg1, bg2, bg3, bg4],
        icons: [
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
        ]
      });
      store.IconProperties.extractSVG = SvgExtractor.extract();
      Vue.component('toolbar', {
        template: '#toolbar',
        data: function() {
          return {
            store: store
          };
        },
        methods: {
          openPanel(panel) {
            this.$emit('update:panel', panel);
          },
          remove() {
            editor.removeObject();
          },
          undo() {},
          redo() {},
        },
      });

      Vue.component('sidebar', {
        props: ['panel'],
        template: '#sidebar',
        data: function() {
          return {
            selectedSize: '800x800',
            sizeList: [
              { size: '800x536', name: 'Business Card' },
              { size: '618x800', name: 'Flyer' },
              { size: '566x800', name: 'A4' },
              { size: '800x800', name: 'Square' },
              { size: '820x312', name: 'Facebook Cover' },
            ],
            textColor: '#000000',
            store: store,
            font: store.fonts[0]
          };
        },
        watch: {
          'store.TextProperties': {
            handler: function() {
              editor.updateObject(this.store.TextProperties);
            },
            deep: true
          },
          'store.TextProperties.fontFamily': function() {
            this.font = this.store.fonts.find(font => font.name === this.store.TextProperties.fontFamily) || this.store.fonts[0];
          }
        },
        methods: {
          openPanel(panel) {
            this.$emit('update:panel', panel);
          },
          newDrawing(size) {
            let [width, height] = this.parseSize(size);
            editor.canvas.clear();
            editor.canvas.setDimensions({ width: width, height: height });
          },
          parseSize(size) {
            return size.split('x');
          },
          addImages() {
            for (let file of event.target.files) {
              if (file.type.startsWith('image/')) {
                let url = URL.createObjectURL(file);
                this.store.images.push(url);
              }
            }
          },
          addBackgrounds() {
            for (let file of event.target.files) {
              if (file.type.startsWith('image/')) {
                let url = URL.createObjectURL(file);
                this.store.backgrounds.push(url)
              }
            }
          },
          uploadImages() {
            this.$refs.imageInput.click();
          },
          isSelected(item, value) {
            return item === value;
          },
          addText() {
            editor.addText();
          },
          addImage() {
            editor.addImage();
          },
          addBackground() {
            editor.addBackground();
          },
          addIcon() {
            editor.addIcon();
          },
          startDrag(event, item, type) {
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.setData('item', item);
            event.dataTransfer.setData('type', type);
          }
        },
      });

      new Vue({
        el: 'section.app',
        data: {
          panel: 'new',
          text: ''
        },
        head: {
          link: fontList.files().map(file => new Object({ rel: 'preload', href: `fonts/${file.filename()}`, as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }))
        },
      });

      let editor = new ImageEditor({
        id: 'editor',
        width: 800,
        height: 500,
        store: store
      });

    });
});
