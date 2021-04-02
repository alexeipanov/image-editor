import { fabric } from 'fabric';
import HistoryManager from './history';
import PropertiesManager from './propertiesManager';

class ImageEditor {

  constructor(options) {
    this.config = options;
    this.canvas = new fabric.Canvas(this.config.id);
    this.canvas.setDimensions({width: options.width, height: options.height})
    this.store = options.store;
    this.historyManager = new HistoryManager();
    this.propertiesManager = new PropertiesManager();

    this.canvas.on('drop', (options) => {
      options.e.preventDefault();
      let item = options.e.dataTransfer.getData('item');
      let type = options.e.dataTransfer.getData('type');
      let properties = this.propertiesManager.create(type, { item: item });
      this.store.setProperties(properties.type(), properties);
      this.drawHandler = properties.draw();
      this.drawHandler();
    });

    this.canvas.on({
      'selection:updated': () => this.fireObjectSelection(),
      'selection:created': () => this.fireObjectSelection(),
      'before:selection:cleared': () => this.fireClearSelection()
    });

  }

  fireObjectSelection() {
    let activeObject = this.canvas.getActiveObject();
    this.store.onSelect(activeObject);
  }

  fireClearSelection() {
    let activeObject = this.canvas.getActiveObject();
    this.store.onClearSelection(activeObject);
  }

  addText() {
    let itext = new fabric.IText(this.store.TextProperties.text, this.store.TextProperties);
    itext.set({ left: this.canvas.width / 2 - itext.width, top: this.canvas.height / 2 - itext.height });
    this.canvas.add(itext);
    this.canvas.requestRenderAll();
    this.canvas.setActiveObject(itext);
  }

  addImage() {
    fabric.Image.fromURL(this.store.ImageProperties.item, image => {
      let scaleFactorX = 1;
      let scaleFactorY = 1;
      if (image.height >= this.canvas.height) {
        scaleFactorY = (this.canvas.height - this.store.DocumentProperties.padding * 2) / image.height;
      }
      if (image.width >= this.canvas.width) {
        scaleFactorX = (this.canvas.width - this.store.DocumentProperties.padding * 2) / image.width;
      }
      let scaleFactor = Math.min(scaleFactorX, scaleFactorY);
      image.set({
        top: this.store.DocumentProperties.padding,
        left: this.store.DocumentProperties.padding,
        scaleY: scaleFactor,
        scaleX: scaleFactor
      });
      this.canvas.add(image);
      this.canvas.setActiveObject(image);
    });
  }

  addBackground() {
    fabric.Image.fromURL(this.store.BackgroundProperties.item, background => {
      let scale = Math.max(this.canvas.getWidth() / background.width, this.canvas.getHeight() / background.height);
      background.set({ scaleX: scale, scaleY: scale, originX: 'left', originY: 'top' });
      this.canvas.setBackgroundImage(background, () => this.canvas.requestRenderAll());
    });
  }

  addIcon() {
    let source = this.store.IconProperties.extractSVG(this.store.IconProperties.item);
    fabric.loadSVGFromString(source, (objects, options) => {
      let icon = fabric.util.groupSVGElements(objects, options);
      let scaleFactorX = 1 / 5;
      let scaleFactorY = 1 / 5;
      if (icon.height >= this.canvas.height) {
        scaleFactorY = (this.canvas.height - this.store.DocumentProperties.padding * 2) / 5 /icon.height;
      }
      if (icon.width >= this.canvas.width) {
        scaleFactorX = (this.canvas.width - this.store.DocumentProperties.padding * 2) / 5 / icon.width;
      }
      let scaleFactor = Math.min(scaleFactorX, scaleFactorY);
      icon.set({
        top: this.store.DocumentProperties.padding,
        left: this.store.DocumentProperties.padding,
        scaleY: scaleFactor,
        scaleX: scaleFactor
      });
      this.canvas.add(icon);
      this.canvas.setActiveObject(icon);

    });
  }

  updateObject(options) {
    let activeObject = this.canvas.getActiveObject();
    if (activeObject && PropertiesManager.type(activeObject.type) === options.type) {
      Object.assign(activeObject, options);
      this.canvas.requestRenderAll();
    }
  }

  removeObject() {
    let activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.remove(activeObject);
    }
  }
}

export default ImageEditor;
