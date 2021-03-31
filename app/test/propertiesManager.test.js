import { expect } from 'chai';
import PropertiesManager  from '../js/propertiesManager';

describe('PropertiesManager methods', function() {
  it('Check type reduction', function() {
    expect(PropertiesManager.type('i-text')).to.eq('TextProperties');
  });
});
