'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),

    universalBundle = require('fs').readFileSync('./desktop.bundles/universal/_universal.js').toString(),
    createModels = new Function('BEM', universalBundle);

chai.use(sinonChai);

describe('i-model__field_type_string', function() {
    beforeEach(function() {
        GLOBAL.BEM = { MODEL: {} };

        createModels(GLOBAL.BEM);
    });

    it('should set empty string as default value', function() {
        BEM.MODEL.decl('model', { field: 'string' });

        var model = BEM.MODEL.create('model');

        expect(model.get('field')).to.equal('');
    });
});
