export default class DrawingProperties {
  static defaults(settings) {
    return {};
  }

  type() {
    return this.constructor.name;
  }
}
