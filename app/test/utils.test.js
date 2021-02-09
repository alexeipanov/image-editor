import { expect } from 'chai';
import { mergeProperties } from '../js/utils.js';

describe('mergeProperties', function() {
 it('combines default and user-defined properties', function() {
  let defaults = new Map([
    ['fontSize', 12],
    ['fontFamily', 'Roboto'],
    ['lockUniScaling', true],
    ['isNew', true]
  ]);
  let options = {
    fontSize: 16,
    lockUniScaling: null,
    isNew: false,
  };
  let merged = mergeProperties(defaults, options);
  console.log(merged)
  expect(merged.get('fontSize')).to.equal(16);
  expect(merged.get('fontFamily')).to.equal('Roboto');
  expect(merged.get('lockUniScaling')).to.equal(true);
  expect(merged.get('isNew')).to.equal(false);
 });
});
