import ImageEditor from './editor';
import Vue from 'vue/dist/vue.js';
import '../scss/app.scss';
import '../css/fonts.css';
import html from '../index.html';


window.addEventListener('load', () => {
  Vue.component('toolbar', {
    data: function () {
      return {

      }
    },
    methods: {
      openPanel(panel) {
        this.$emit('update:panel', panel);
      },
      remove() {},
      undo() {},
      redo() {},
    },
    template: '#toolbar'
  });

  Vue.component('sidebar', {
    props: ['panel'],
    template: '#sidebar',
    data: function() {
      return { size: '800x800' };
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
      }
    },
  });

  let app = new Vue({
    el: 'section.app',
    data: {
      panel: 'new',
    }
  });


  let editor = new ImageEditor({
    id: 'editor',
    width: 800,
    height: 500
  });
});
