import DrawingProperties from  './drawingProperties';

export default class DocumentProperties extends DrawingProperties {
  constructor(options) {
    super();
    this.format =  options.format || { size: '800x536', name: 'Business Card' };
    this.padding = options.padding || 10;
    this.gridSize = options.gridSize || 10;
  }
}
