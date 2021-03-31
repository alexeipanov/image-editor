import { expect } from 'chai';
import { FontList }  from '../js/fontList.js';

describe('FontList class', function() {
  let fontList = new FontList([
    {"id":"arvo","name":"Arvo","weights":["400","700"],"styles":["italic","normal"]},
    {"id":"cabin","name":"Cabin","weights":["400","500","600","700"],"styles":["italic","normal"]}
  ]);
  it('Expand font list to file list', function() {
    expect(fontList.files()).to.have.lengthOf(12);
  });
  let arvo = fontList.fonts[0];
  it('Check is Arvo font contains both normal and italic styles', function() {
    expect(arvo.isRegular()).to.eq(true);
    expect(arvo.isItalic()).to.eq(true);
  });
});
