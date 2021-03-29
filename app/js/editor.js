'use strict';
import { fabric } from 'fabric';
import HistoryManager from './history';
import PropertiesManager from './propertiesManager';
import Utils from './utils';

const ZOOM_RATIO = 0.25;
const GRID_COLOR = '#a6a6a6';
const GRID_OPACITY = 0.5;
const GRID_WIDTH = 1;

class ImageEditor {

  constructor(options) {
    this.config = options;
    this.canvas = new fabric.Canvas(this.config.id);
    this.canvas.setWidth(options.width);
    this.canvas.setHeight(options.height);
    if (options.image) {
      this.setBackgroundFromURL(options.image);
    }
    this.historyManager = new HistoryManager();
    this.state = [];
    this.historyPos = 0;
    this.saveHistory();
    this.store = options.store;
    this.propertiesManager = new PropertiesManager();

    // this.canvas.on('mouse:down', function(options) {
    //   if (this.isMovingMode === true) {
    //     this.isDragging = true;
    //     this.selection = false;
    //     this.lastPosX = options.e.clientX;
    //     this.lastPosY = options.e.clientY;
    //   }
    // });

    // this.canvas.on('mouse:move', function(options) {
    //   if (this.isDragging) {
    //     let dx = this.lastPosX - options.e.clientX;
    //     let dy = this.lastPosY - options.e.clientY;
    //     if (dx > -1 * this.vptCoords.tl.x && dx < this.width - this.vptCoords.br.x) {
    //       this.viewportTransform[4] -= dx;
    //     }
    //     if (dy > -1 * this.vptCoords.tl.y && dy < this.height - this.vptCoords.br.y) {
    //       this.viewportTransform[5] -= dy;
    //     }
    //     this.requestRenderAll();
    //     this.lastPosX = options.e.clientX;
    //     this.lastPosY = options.e.clientY;
    //   }
    // });

    // this.canvas.on('mouse:up', function(options) {
    //   this.isDragging = false;
    //   this.selection = true;
    // });

    this.canvas.on('drop', (options) => {
      options.e.preventDefault();
      let item = options.e.dataTransfer.getData('item');
      let type = options.e.dataTransfer.getData('type');
      let properties = this.propertiesManager.create(type, { item: item });
      this.store.setProperties(properties.type(), properties);
      this.drawHandler = properties.draw();
      this.drawHandler();
    });

    // this.canvas.on('text:editing:entered', () => {
    //   // $(`#${this.config.id}`).trigger('onTextEditEnter');
    // });

    // this.canvas.on({
    //   'object:modified': () => this.saveHistory(),
    //   'object:removed': () => this.saveHistory(),
    //   'path:created':  () => this.saveHistory()
    // });

    this.canvas.on({
      'selection:updated': () => this.fireObjectSelection(),
      'selection:created': () => this.fireObjectSelection(),
      'before:selection:cleared': () => this.fireClearSelection()
    });

  }

  fireObjectSelection() {
    let activeObject = this.canvas.getActiveObject();
    this.store.selection = true;
    let properties = this.propertiesManager.create(activeObject.type, activeObject);
    this.store.setProperties(properties.type(), properties);
  }

  fireClearSelection() {
    let activeObject = this.canvas.getActiveObject();
    this.store.selection = false;
    let properties = this.propertiesManager.create(activeObject.type, this.propertiesManager.defaults(activeObject.type, this.store));
    this.store.setProperties(properties.type(), properties);
  }

  setSnap(snap) {
    this.config.snap = snap;
    // $('canvas#vcedit').trigger('onSnapToggle', snap);
  };

  toggleSnap() {
    this.setSnap(!this.config.snap);
  };

  drawGrid() {
    let grid = new fabric.Group();
    let margin;
    let zoom = this.getZoom();
    let size = (VCWIDTH - margin) / ((VCABSWIDTH - 3) / 5);
    for (var i = 0; i < ((canvas.width - margin) / size); i++) {
      grid.add(new fabric.Line([i * size + margin / 2, 0, i * size + margin / 2, canvas.height], {
        stroke: GRID_COLOR,
        opacity: GRID_OPACITY,
        selectable: false,
        strokeWidth: GRID_WIDTH
      }));
    }
    for (i = 0; i < ((canvas.height - margin) / size); i++) {
      grid.add(new fabric.Line([0, i * size + margin / 2, canvas.width, i * size + margin / 2], {
        stroke: GRID_COLOR,
        opacity: GRID_OPACITY,
        selectable: false,
        strokeWidth: GRID_WIDTH
      }));
    }
    this.grid = grid;
    canvas.add(this.grid);
    canvas.bringForward(this.grid);
    canvas.renderAll();
    $('canvas#vcedit').trigger('onGridToggle', 'draw');
  };

  deleteGrid() {
    canvas.remove(this.grid);
    canvas.renderAll();
    this.grid = null;
    $('canvas#vcedit').trigger('onGridToggle', 'delete');
  };

  toggleGrid() {
    switch (this.grid) {
      case null:
      this.drawGrid();
      break;
      default:
      this.deleteGrid();
      break;
    }
  };

  // setDrawingMode(mode) {
  //   this.canvas.isDrawingMode = mode;
  // }

  // setMovingMode(mode) {
  //   this.canvas.isDrawingMode = false;
  //   this.canvas.defaultCursor = mode ? 'pointer' : 'default';
  //   this.canvas.isMovingMode = mode;
  //   $(`#${this.config.id}`).trigger('onMovingModeChange', { mode: mode });
  // }

  // toggleMovingMode() {
  //   this.canvas.isDrawingMode = false;
  //   this.canvas.isMovingMode = !this.canvas.isMovingMode;
  //   this.canvas.defaultCursor = this.canvas.isMovingMode ? 'pointer' : 'default';
  //   $(`#${this.config.id}`).trigger('onMovingModeChange', { mode: this.canvas.isMovingMode });
  // }

  // setPencil() {
  //   this.canvas.freeDrawingBrush.shadow.blur = 0;
  //   this.canvas.freeDrawingBrush.strokeLineCap = 'square';
  //   this.canvas.freeDrawingBrush.strokeLineJoin = 'bevel';
  // }

  // setBrush() {
  //   this.canvas.freeDrawingBrush.shadow.blur = this.canvas.freeDrawingBrush.width / 2;
  //   this.canvas.freeDrawingBrush.strokeLineCap = 'round';
  //   this.canvas.freeDrawingBrush.strokeLineJoin = 'round';
  // }

  setTextColor(color) {
    this.textColor = new fabric.Color(color);
    this.textColor.setAlpha(this.config.opacity);
  }



  addText() {
    let itext = new fabric.IText(this.store.TextProperties.text, this.store.TextProperties);
    itext.set({ left: this.canvas.width / 2 - itext.width, top: this.canvas.height / 2 - itext.height });
    this.canvas.add(itext);
    this.canvas.requestRenderAll();
    this.canvas.setActiveObject(itext);
    // this.canvas.renderAll();
    // this.saveHistory();
  }

  addImage() {
    fabric.Image.fromURL(this.store.ImageProperties.item, image => {
      let scaleFactorX = 1;
      let scaleFactorY = 1;
      if (image.height >= this.canvas.height) {
        scaleFactorY = (this.canvas.height - this.store.SettingProperties.padding * 2) / image.height;
      }
      if (image.width >= this.canvas.width) {
        scaleFactorX = (this.canvas.width - this.store.SettingProperties.padding * 2) / image.width;
      }
      let scaleFactor = Math.min(scaleFactorX, scaleFactorY);
      image.set({
        top: this.store.SettingProperties.padding,
        left: this.store.SettingProperties.padding,
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
      this.canvas.setBackgroundImage(background, () => this.canvas.renderAll());
    });
  }

  removeObject() {
    let activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.remove(activeObject);
    }
  }

  hasSelection() {
    return this.canvas.getActiveObject() !== null;
  }

  getImagePromise(source) {
    return new Promise((resolve) => fabric.loadSVGFromURL(source, resolve));
  }

  crop(size) {
    if (size.width) {
      this.canvas.setWidth(size.width);
    }
    if (size.height) {
      this.canvas.setHeight(size.height);
    }
    this.canvas.renderAll();
  }

  resize(size) {
    let image = this.canvas.backgroundImage;
    this.crop(size);
    this.setBackground(image);
  }

  zoomIn() {
    let zoom = this.canvas.getZoom() + ZOOM_RATIO;
    this.canvas.setZoom(zoom);
    this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), zoom);
  }

  zoomOut() {
    let zoom = this.canvas.getZoom() - ZOOM_RATIO;
    this.canvas.setZoom(zoom);
    this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), zoom);
    if (Math.round(zoom) === 1) {
      this.canvas.absolutePan({ x: 0, y: 0 });
    }
  }

  saveHistory() {
    this.state.push(JSON.stringify(this.canvas));
    if (this.state.length >= 50) {
      this.state.shift();
    }
    this.historyPos = this.state.length - 1;
  }

  clearHistory() {
    this.state = [];
    this.historyPos = 0;
  }

  undo() {
    if (this.historyPos > 0) {
      this.historyPos--;
      this.canvas.loadFromJSON(this.state[this.historyPos], function() {});
    }
  }

  redo() {
    if (this.historyPos < this.state.length - 1) {
      this.historyPos++;
      this.canvas.loadFromJSON(this.state[this.historyPos], function() {});
    }
  }

  saveToImage(format, callback) {
    return this.canvas.toDataURL({ format: format });
  }

  clear() {
    this.canvas.clear();
    this.canvas.backgroundImage = null;
    this.clearHistory();
    this.saveHistory();
    this.canvas.setWidth(this.config.width);
    this.canvas.setHeight(this.config.height);
    $(`#${this.config.id}`).trigger('onBackgroundChange', { width: this.config.width, height: this.config.height });
  }

  updateObject(options) {
    let activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      Object.assign(activeObject, options);
      this.canvas.renderAll();
      // this.saveHistory();
    }
  }
}

export default ImageEditor;
