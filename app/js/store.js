import PropertiesManager from './propertiesManager';

let propertiesManager = new PropertiesManager();

export default class Store {
  constructor(options = {}) {
    this.fonts = options.fonts;
    this.sizes = [7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 36, 48, 64, 72];
    this.TextProperties = {};
    let textProperties = {
      fill: '#000',
      fontSize: 12,
      fontStyle: options.fonts[0].styles[0],
      fontWeight: options.fonts[0].weights[0],
      fontFamily: options.fonts[0].name,
      textAlign: 'left',
      textDecoration: 'none',
      lockUniScaling: true,
      lineHeight: 1.5,
      scaleX: 1,
      scaleY: 1,
      text: ''
    };
    let TextProperties = propertiesManager.create('TextProperties', textProperties);
    this.setProperties('TextProperties', TextProperties);
  }

  setProperties(type, properties) {
    Object.assign(this[type], properties);
  }
}
