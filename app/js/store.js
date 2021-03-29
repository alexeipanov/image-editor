import PropertiesManager from './propertiesManager';

let propertiesManager = new PropertiesManager();

export default class Store {
  constructor(options = {}) {
    this.selection = false;
    this.fonts = options.fonts;
    this.images = options.images;
    this.backgrounds = options.backgrounds;
    this.sizes = [7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 36, 48, 64, 72];
    this.TextProperties = {};
    this.ImageProperties = {};
    this.SettingProperties = {};
    this.BackgroundProperties = {};
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
    let imageProperties = {
      item: null,
      scaleX: 1,
      scaleY: 1
    };
    let settingProperties = {
      padding: 10
    }
    let backgroundProperties = {
      item: null
    };
    let TextProperties = propertiesManager.create('TextProperties', textProperties);
    this.setProperties('TextProperties', TextProperties);
    let ImageProperties = propertiesManager.create('ImageProperties', imageProperties);
    this.setProperties('ImageProperties', ImageProperties);
    let SettingProperties = propertiesManager.create('SettingProperties', settingProperties);
    this.setProperties('SettingProperties', SettingProperties);
    let BackgroundProperties = propertiesManager.create('BackgroundProperties', backgroundProperties);
    this.setProperties('BackgroundProperties', BackgroundProperties);
  }

  setProperties(type, properties) {
    Object.assign(this[type], properties);
  }
}
