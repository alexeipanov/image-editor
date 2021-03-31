import DrawingProperties from  './drawingProperties';

export default class IconProperties extends DrawingProperties {
  constructor(options) {
    super();
    this.item = options.item || null;
  }

  extractSVG(source) {

  }

  draw() {
    return function() {
      this.addIcon();
    }
  }
}
