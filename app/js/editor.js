'use strict';
class ImageEditor {

  constructor(options) {
    this.config = options;
    this.canvas = new fabric.Canvas(this.config.id);
  }

  setBackground(image) {
    this.canvas.backgroundColor = 'transparent';
    fabric.Image.fromURL(image, (source) => {
      var scale = Math.min(this.config.width / source.width, this.config.height / source.height);
      if (scale > 1) {
        scale = 1;
      }
      this.canvas.setDimensions({width: source.width * scale, height: source.height * scale});
      source.set({scaleX: scale, scaleY: scale, originX: 'left', originY: 'top'});
      this.canvas.setBackgroundImage(source, this.canvas.renderAll.bind(this.canvas));
    });
  }

}