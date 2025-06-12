// export default class Utils {
  export function mergeProperties(defaults, options) {
    for (const property of defaults) {
      let [key, value] = property;
      defaults.set(key, key in options && options[key] || value);
    }
    return defaults;
  }
// }
