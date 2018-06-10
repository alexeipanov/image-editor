$(document).ready(function() {
  var editor = new ImageEditor({ id: 'editor', width: 800, height: 600 });

  $('#input-image').on('change', function() {
    var file = $(this)[0].files[0];
    if (file) {
      editor.setBackground(window.URL.createObjectURL(file));
    }
  });

});