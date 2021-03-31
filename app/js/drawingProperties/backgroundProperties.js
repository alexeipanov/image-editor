import DrawingProperties from  './drawingProperties';

export default class BackgroundProperties extends DrawingProperties {
  constructor(options) {
    super();
    this.item = options.item || null;
  }

  draw() {
    return function() {
      this.addBackground();
    }
  }
}
