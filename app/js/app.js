// import ImageEditor from './editor';
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
    methods: {
      openPanel(panel) {
        this.$emit('update:panel', panel);
      },
    },
  });

  let app = new Vue({
    el: 'section.app',
    data: {
      panel: 'new',
    },
    methods: {
    }
  });


  let editor = new ImageEditor({
    id: 'editor',
    width: 800,
    height: 450
  });
});
