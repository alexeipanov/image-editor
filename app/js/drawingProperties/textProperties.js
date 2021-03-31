import DrawingProperties from  './drawingProperties';

export default class TextProperties extends DrawingProperties {
  constructor(options) {
    super();
    this.text = options.text || '';
    this.fontFamily = options.fontFamily;
    this.fontSize = options.fontSize || 12;
    this.fontStyle = options.fontStyle;
    this.fontWeight = options.fontWeight;
    this.textAlign = options.textAlign || 'left';
    this.fill =  options.fill || '#000';
    this.textDecoration = options.textDecoration || 'none';
    this.lockUniScaling = options.lockUniScaling || true;
    this.lineHeight = options.lineHeight || 1.5;
    this.scaleX = options.scaleX || 1;
    this.scaleY = options.scaleY || 1;
  }

  static defaults(settings) {
    return {
      fontFamily: settings.fonts[0].name,
      fontStyle: settings.fonts[0].styles[0],
      fontWeight: settings.fonts[0].weights[0]
    }
  }
}
