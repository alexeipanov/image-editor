import DrawingProperties from  './drawingProperties';

export default class ImageProperties extends DrawingProperties {
  constructor(options) {
    super();
    this.item = options.item || null;
    this.scaleX = 1;
    this.scaleY = 1;
  }

  draw() {
    return function() {
      this.addImage();
    }
  }
}
