'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),

    universalBundle = require('fs').readFileSync('./desktop.bundles/universal/_universal.js').toString(),
    createModels = new Function('BEM', universalBundle);

chai.use(sinonChai);

describe('i-model__field_type_model', function() {
    beforeEach(function() {
        GLOBAL.BEM = { MODEL: {} };

        createModels(GLOBAL.BEM);
    });

    it('should set model with correct id', function() {
        BEM.MODEL.decl('inner-model', { f: 'string', f_id: 'id' });

        BEM.MODEL.decl('model', {
            m: {
                type: 'model',
                modelName: 'inner-model'
            }
        });

        var model = BEM.MODEL.create('model');

        model.set('m', { f: 'string', f_id: 123 });

        expect(BEM.MODEL.get({ name: 'inner-model', id: 123 }).length).to.equal(1);
    });
});
