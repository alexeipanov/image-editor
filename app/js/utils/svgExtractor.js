export default class SvgExtractor {
  static extract() {
    return function(icon) {
      let iconsPack = document.getElementById('icons');
      let svgDoc = iconsPack.contentDocument;
      let sprite = svgDoc.getElementById(icon);
      let path = sprite.querySelector('path') || {};
      let source = '<svg xmlns="http://www.w3.org/2000/svg">' + path.outerHTML + '</svg>';
      return source;
    }
  }
}
