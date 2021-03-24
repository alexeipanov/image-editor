class SizeProperties {

}

class TextProperties {
  constructor(options) {
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

  type() {
    return 'TextProperties';
  }

  static defaults(settings) {
    return {
      fontFamily: settings.fonts[0].name,
      fontStyle: settings.fonts[0].styles[0],
      fontWeight: settings.fonts[0].weights[0]
    }
  }
}

class ImageProperties {

}

class BackgroundProperties {

}

class IconProperties {

}

class SettingProperties {

}

const properties = { SizeProperties, TextProperties, ImageProperties, BackgroundProperties, IconProperties, SettingProperties };

const typeProxyHandler = {
  get: function(target, prop, receiver) {
    switch (prop === 'type' && target.type) {
      case 'i-text':
      return 'TextProperties';
      break;
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
