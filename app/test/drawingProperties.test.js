import { expect } from 'chai';
import DrawingProperties  from '../js/drawingProperties/drawingProperties';
import TextProperties  from '../js/drawingProperties/textProperties';

describe('drawingProperties methods', function() {
  let baseProperties = new DrawingProperties();
  it('Check base class name', function() {
    expect(baseProperties.type()).to.eq('DrawingProperties');
  });
  let textProperties = new TextProperties({});
  it('Check child class name', function() {
    expect(textProperties.type()).to.eq('TextProperties');
  });
});
