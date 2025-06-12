import DrawingProperties from  './drawingProperties';

export default class SettingProperties extends DrawingProperties {
  constructor(options) {
    super();
    this.padding = options.padding || 10;
  }
}
