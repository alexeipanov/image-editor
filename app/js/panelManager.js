class SizePanel {

}

class TextPanel {
  constructor(options) {
    this.text = options.text;
    this.fontFamily = options.fontFamily;
    this.fontSize = options.fontSize;
    this.fontStyle = options.fontStyle;
    this.fontWeight = options.fontWeight;
    this.textAlign = options.textAlign;
    this.fill =  options.fill;
    this.textDecoration = options.textDecoration;
    this.lockUniScaling = options.lockUniScaling;
    this.lineHeight = options.lineHeight;
    this.scaleX = options.scaleX;
    this.scaleY = options.scaleY;
  }
}

class ImagePanel {

}

class BackgroundPanel {

}

class IconPanel {

}

class SettingPanel {

}

const panels = { SizePanel, TextPanel, ImagePanel, BackgroundPanel, IconPanel, SettingPanel };

const panelProxyHandler = {
  get: function(target, prop, receiver) {
    switch (prop === 'type' && target.type) {
      case 'i-text':
      return 'TextPanel';
      break;
    }
    return Reflect.get(...arguments);
  },
}

export default class PanelManager {
  // constructor(type, options) {
  // }

  createPanel(options) {
    let proxiedOptions = new Proxy(options, panelProxyHandler);
    let Panel = panels[proxiedOptions.type];
    return new Panel(options);
  }
}
