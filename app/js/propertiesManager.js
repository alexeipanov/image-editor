import IconProperties from './drawingProperties/iconProperties';
import SizeProperties from './drawingProperties/sizeProperties';
import TextProperties from './drawingProperties/textProperties';
import ImageProperties from './drawingProperties/imageProperties';
import SettingProperties from './drawingProperties/settingProperties';
import BackgroundProperties from './drawingProperties/backgroundProperties';

const properties = { SizeProperties, TextProperties, ImageProperties, BackgroundProperties, IconProperties, SettingProperties };

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

  defaults(type, settings) {
    let proxiedType = new Proxy({ type: type }, typeProxyHandler).type;
    let Properties = properties[proxiedType];
    return Properties.defaults(settings);
  }
}
