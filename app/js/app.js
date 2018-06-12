$(document).ready(function() {
  var editor = new ImageEditor({ id: 'editor', width: 800, height: 600, opacity: 0.5 });

  function toggleButtonState(button, buttonClass) {
    $('.' + buttonClass + '.active').attr('aria-pressed', false);
    $('.' + buttonClass + '.active').removeClass('active');
    button.attr('aria-pressed', true);
    button.addClass('active');
  }

  $('.set-drawing-color, .set-text-color').each(function(index, item) {
    $(item).find('span').css('color', $(item).data('color'));
  });

  $('#input-image').on('change', function() {
    var file = $(this)[0].files[0];
    if (file) {
      editor.setBackground(window.URL.createObjectURL(file));
    }
  });

  $('.set-drawing-color').on('click', function(event) {
    event.preventDefault();
    toggleButtonState($(this), 'set-drawing-color');
    editor.setDrawingColor($(this).data('color'));
  });

  $('.set-drawing-size').on('click', function(event) {
    event.preventDefault();
    toggleButtonState($(this), 'set-drawing-size');
    editor.setDrawingWidth($(this).data('size'));
  });

  $('.set-text-color').on('click', function(event) {
    event.preventDefault();
    toggleButtonState($(this), 'set-text-color');
    editor.setTextColor($(this).data('color'));
  });

  $('#pencil').on('click', function(event) {
    event.preventDefault();
    toggleButtonState($(this), 'tool-btn');
    editor.setDrawingMode(true);
    editor.setPencil();
  });

  $('#brush').on('click', function(event) {
    event.preventDefault();
    toggleButtonState($(this), 'tool-btn');
    editor.setDrawingMode(true);
    editor.setBrush();
  });

  $('#text').on('click', function(event) {
    event.preventDefault();
    toggleButtonState($(this), 'tool-btn');
    editor.setDrawingMode(false);
    editor.addText('default text', { fontSize: 32 });
  });

  $('#select').on('click', function(event) {
    event.preventDefault();
    toggleButtonState($(this), 'tool-btn');
    editor.setDrawingMode(false);
  });

  $('.set-drawing-color').first().trigger('click');
  $('.set-text-color').first().trigger('click');
  $('.set-drawing-size').first().trigger('click');

});