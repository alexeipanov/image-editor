import PropertiesManager from './propertiesManager';

let propertiesManager = new PropertiesManager();

export default class Store {
  constructor(options = {}) {
    this.selection = false;
    this.fonts = options.fonts;
    this.images = options.images;
    this.backgrounds = options.backgrounds;
    this.icons = options.icons;
    this.sizes = [7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 36, 48, 64, 72];
    this.icons = [
      'behance',
      'facebook',
      'github',
      'instagram',
      'linkedin',
      'pinterest',
      'reddit',
      'snapchat',
      'soundcloud',
      'strava',
      'twitter',
      'vimeo',
      'youtube'
    ];
    this.formats = [
      { size: '800x536', name: 'Business Card' },
      { size: '618x800', name: 'Flyer' },
      { size: '566x800', name: 'A4' },
      { size: '800x800', name: 'Square' },
      { size: '820x312', name: 'Facebook Cover' }
    ];
    this.IconProperties = {};
    this.TextProperties = {};
    this.ImageProperties = {};
    this.DocumentProperties = {};
    this.BackgroundProperties = {};
    let textProperties = {
      fontStyle: options.fonts[0].styles[0],
      fontWeight: options.fonts[0].weights[0],
      fontFamily: options.fonts[0].name,
    };
    let imageProperties = {
    };
    let backgroundProperties = {
    };
    let iconProperties = {
    };
    let documentProperties = {
      format: this.formats[0],
    };
    let TextProperties = propertiesManager.create('TextProperties', textProperties);
    this.setProperties('TextProperties', TextProperties);
    let ImageProperties = propertiesManager.create('ImageProperties', imageProperties);
    this.setProperties('ImageProperties', ImageProperties);
    let BackgroundProperties = propertiesManager.create('BackgroundProperties', backgroundProperties);
    this.setProperties('BackgroundProperties', BackgroundProperties);
    let IconProperties = propertiesManager.create('IconProperties', iconProperties);
    this.setProperties('IconProperties', IconProperties);
    let DocumentProperties = propertiesManager.create('DocumentProperties', documentProperties);
    this.setProperties('DocumentProperties', DocumentProperties);
  }

  setProperties(type, properties) {
    Object.assign(this[type], properties);
  }

  onSelect(object) {
    this.selection = true;
    let properties = propertiesManager.create(object.type, object);
    this.setProperties(properties.type(), properties);
    this.onSelectionChange(properties.type());
  }

  onClearSelection(object) {
    this.selection = false;
    let properties = propertiesManager.create(object.type, propertiesManager.defaults(object.type, this));
    this.setProperties(properties.type(), properties);
  }
}
