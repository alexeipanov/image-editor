'use strict';
class ImageEditor {

  constructor(options) {
    this.config = options;
    this.canvas = new fabric.Canvas(this.config.id);
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.shadow = new fabric.Shadow();
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

  setDrawingMode(mode) {
    this.canvas.isDrawingMode = mode;
  }

  setPencil() {
    this.canvas.freeDrawingBrush.shadow.blur = 0;
    this.canvas.freeDrawingBrush.strokeLineCap = 'square';
    this.canvas.freeDrawingBrush.strokeLineJoin = 'bevel';
  }

  setBrush() {
    this.canvas.freeDrawingBrush.shadow.blur = this.canvas.freeDrawingBrush.width / 2;
    this.canvas.freeDrawingBrush.strokeLineCap = 'round';
    this.canvas.freeDrawingBrush.strokeLineJoin = 'round';
  }

  setDrawingColor(color) {
    var drawingColor = new fabric.Color(color);
    drawingColor.setAlpha(this.config.opacity);
    this.canvas.freeDrawingBrush.color = drawingColor.toRgba();
    this.canvas.freeDrawingBrush.shadow.color = drawingColor.toRgba();
  }

  setTextColor(color) {
    this.textColor = new fabric.Color(color);
    this.textColor.setAlpha(this.config.opacity);
  }

  setDrawingWidth(size) {
    this.canvas.freeDrawingBrush.width = size;
  }

  addText(text, options) {
    var config = {
      fill: this.textColor.toRgba(),
      fontSize: 12,
      fontFamily: 'Sans Serif',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      scaleX: 2,
      scaleY: 2,
      lineHeight: 1.15
    };

    Object.getOwnPropertyNames(config).forEach(value => {
      config[value] = options[value] || config[value];
    });

    var itext = new fabric.IText(text, config);
    itext.set({left: this.canvas.width / 2 - itext.width, top: this.canvas.height / 2 - itext.height});
    this.canvas.add(itext);
    this.canvas.setActiveObject(itext);
    this.canvas.renderAll();
  }

}