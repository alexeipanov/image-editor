import DrawingProperties from  './drawingProperties';

export default class IconProperties extends DrawingProperties {
  constructor(options) {
    super();
    this.item = options.item || null;
  }

  extractSVG() {

  }

  draw() {
    return function() {
      this.addIcon();
    }
  }
}
