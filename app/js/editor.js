'use strict';
import { fabric } from 'fabric';
import HistoryManager from './history';

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

    this.canvas.on('mouse:down', function(options) {
      if (this.isMovingMode === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = options.e.clientX;
        this.lastPosY = options.e.clientY;
      }
    });

    this.canvas.on('mouse:move', function(options) {
      if (this.isDragging) {
        let dx = this.lastPosX - options.e.clientX;
        let dy = this.lastPosY - options.e.clientY;
        if (dx > -1 * this.vptCoords.tl.x && dx < this.width - this.vptCoords.br.x) {
          this.viewportTransform[4] -= dx;
        }
        if (dy > -1 * this.vptCoords.tl.y && dy < this.height - this.vptCoords.br.y) {
          this.viewportTransform[5] -= dy;
        }
        this.requestRenderAll();
        this.lastPosX = options.e.clientX;
        this.lastPosY = options.e.clientY;
      }
    });

    this.canvas.on('mouse:up', function(options) {
      this.isDragging = false;
      this.selection = true;
    });

    this.canvas.on('drop', (options) => {
      options.e.preventDefault();
      this.addSign(options.e.dataTransfer.getData('source'))
      .then((result) => this.drawSign(result, options.e.layerX, options.e.layerY));
    });

    this.canvas.on('text:editing:entered', () => {
      $(`#${this.config.id}`).trigger('onTextEditEnter');
    });

    this.canvas.on({
      'object:modified': () => this.saveHistory(),
      'object:removed': () => this.saveHistory(),
      'path:created':  () => this.saveHistory()
    });

    this.canvas.on({
      'object:selected': () => this.fireObjectSelection(),
      'selection:updated': () => this.fireObjectSelection()
    });

  }

  fireObjectSelection() {
    let activeObject = this.canvas.getActiveObject();
    if (activeObject.type === 'i-text') {
      $(`#${this.config.id}`).trigger('onSelectText', { scale: activeObject.scaleX });
    }
    if (activeObject.type === 'path') {
      let color = new fabric.Color(activeObject.stroke);
      $(`#${this.config.id}`).trigger('onSelectPath', { opacity: color.getAlpha() });
    }
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

  setBackground(image) {
    let scale = Math.min(this.canvas.getWidth() / image.width, this.canvas.getHeight() / image.height);
    if (scale > 1) {
      scale = 1;
    }
    let width = Math.round(image.width * scale);
    let height = Math.round(image.height * scale);
    this.canvas.setDimensions({ width: width, height: height });
    image.set({ scaleX: scale, scaleY: scale, originX: 'left', originY: 'top' });
    this.canvas.setBackgroundImage(image, () => {
      this.canvas.renderAll();
      $(`#${this.config.id}`).trigger('onBackgroundChange', { width: width, height: height });
    });
  }

  setBackgroundFromURL(image) {
    fabric.Image.fromURL(image, (source) => {
      this.setBackground(source);
      this.saveHistory();
    }, { crossOrigin: 'anonymous' });
  }

  setDrawingMode(mode) {
    this.canvas.isDrawingMode = mode;
  }

  setMovingMode(mode) {
    this.canvas.isDrawingMode = false;
    this.canvas.defaultCursor = mode ? 'pointer' : 'default';
    this.canvas.isMovingMode = mode;
    $(`#${this.config.id}`).trigger('onMovingModeChange', { mode: mode });
  }

  toggleMovingMode() {
    this.canvas.isDrawingMode = false;
    this.canvas.isMovingMode = !this.canvas.isMovingMode;
    this.canvas.defaultCursor = this.canvas.isMovingMode ? 'pointer' : 'default';
    $(`#${this.config.id}`).trigger('onMovingModeChange', { mode: this.canvas.isMovingMode });
  }

  setPencil() {
    this.canvas.freeDrawingBrush.shadow.blur = 0;
    this.canvas.freeDrawingBrush.strokeLineCap = 'square';
    this.canvas.freeDrawingBrush.strokeLineJoin = 'bevel';
  }

  setBrush() {
    this.canvas.freeDrawingBrush.shadow.blur = this.canvas.freeDrawingBrush.width / 2;
    this.canvas.freeDrawingBrush.strokeLineCap = 'round';
    this.canvas.freeDrawingBrush.strokeLineJoin = 'round';
  }

  setDrawingColor(color, opacity) {
    let drawingColor = new fabric.Color(color);
    drawingColor.setAlpha(opacity);
    this.canvas.freeDrawingBrush.color = drawingColor.toRgba();
    this.canvas.freeDrawingBrush.shadow.color = drawingColor.toRgba();
    let activeObject = this.canvas.getActiveObject();
    if (activeObject && activeObject.type === 'path') {
      activeObject.set({ 'stroke': drawingColor.toRgba() });
      activeObject.setShadow({ color: drawingColor.toRgba() });
      this.canvas.renderAll();
      this.saveHistory();
    }
  }

  setTextColor(color) {
    this.textColor = new fabric.Color(color);
    this.textColor.setAlpha(this.config.opacity);
  }

  setDrawingWidth(size) {
    this.canvas.freeDrawingBrush.width = size;
  }

  addText(text, options) {
    let config = {
      fill: this.textColor.toRgba(),
      fontSize: 12,
      fontFamily: 'Sans Serif',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      lockUniScaling: true,
      scaleX: 2,
      scaleY: 2,
      lineHeight: 1.15
    };

    Object.getOwnPropertyNames(config).forEach(value => {
      config[value] = options[value] || config[value];
    });

    let itext = new fabric.IText(text, config);
    itext.set({ left: this.canvas.width / 2 - itext.width, top: this.canvas.height / 2 - itext.height });
    this.canvas.add(itext);
    this.canvas.setActiveObject(itext);
    this.canvas.renderAll();
    this.saveHistory();
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

  updateObject(params) {
    let activeObject = this.canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.scaleX = params.scale;
      activeObject.scaleY = params.scale;
      this.canvas.renderAll();
      this.saveHistory();
    }
  }
}

export default ImageEditor;
