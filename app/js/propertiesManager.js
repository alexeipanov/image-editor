import IconProperties from './drawingProperties/iconProperties';
import TextProperties from './drawingProperties/textProperties';
import ImageProperties from './drawingProperties/imageProperties';
import DocumentProperties from './drawingProperties/documentProperties';
import BackgroundProperties from './drawingProperties/backgroundProperties';

const properties = { TextProperties, ImageProperties, BackgroundProperties, IconProperties, DocumentProperties };

const typeProxyHandler = {
  get: function(target, prop) {
    switch (prop === 'type' && target.type) {
      case 'i-text':
      return 'TextProperties';
      case 'image':
      return 'ImageProperties';
      case 'background':
      return 'BackgroundProperties';
      case 'path':
      return 'IconProperties';
    }
    return Reflect.get(...arguments);
  },
}

export default class propertiesManager {
  create(type, options) {
    let proxiedType = new Proxy({ type: type }, typeProxyHandler).type;
    let Properties = properties[proxiedType];
    return new Properties(options);
  }

  static type(type) {
    return new Proxy({ type: type }, typeProxyHandler).type;
  }

  defaults(type, settings) {
    let proxiedType = new Proxy({ type: type }, typeProxyHandler).type;
    let Properties = properties[proxiedType];
    return Properties.defaults(settings);
  }
}
