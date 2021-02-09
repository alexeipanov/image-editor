class FontEntry {
  constructor({id, name, weights, styles}) {
    this.id = id;
    this.name = name;
    this.weights = weights;
    this.styles = styles.sort((a, b) => b - a);
  }

  isRegular() {
    return this.styles.includes('normal');
  }

  isItalic() {
    return this.styles.includes('italic');
  }
}

class FileEntry {
  constructor({id, name, weight, style}) {
    this.id = id;
    this.name = name;
    this.weight = weight;
    this.style = style;
  }

  filename() {
    return `${this.id}-latin-${this.weight}-${this.style}.woff2`;
  }
}

class FontList {
  constructor(fonts) {
    this.fonts = fonts.map(font => new FontEntry(font));
  }

  files() {
    return this.fonts.reduce(
      (f, font) => f.splice(f.length, 0, font.weights.reduce(
        (w, weight) => w.splice(w.length, 0, font.styles.reduce(
          (s, style) => s.splice(s.length, 0, new FileEntry({ id: font.id, name: font.name, weight, style })) && s, []
        )) && w.flat(), []
      )) && f.flat(), []
    )
  }
}

export { FontEntry, FontList };
