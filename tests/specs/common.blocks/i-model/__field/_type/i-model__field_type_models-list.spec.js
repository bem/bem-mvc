'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),

    universalBundle = require('fs').readFileSync('./desktop.bundles/universal/_universal.js').toString(),
    createModels = new Function('BEM', universalBundle);

chai.use(sinonChai);

describe('i-model__field_type_models-list', function() {
    beforeEach(function() {
        GLOBAL.BEM = { MODEL: {} };

        createModels(GLOBAL.BEM);
    });

    it('should trigger change if set is done with equal model', function() {
        BEM.MODEL.decl('item', { f: 'string' });

        BEM.MODEL.decl('model', {
            list: {
                type: 'models-list',
                modelName: 'item'
            }
        });

        var model = BEM.MODEL.create('model', {
                list: [{ f: 1 }]
            }),
            onChangeSpy = sinon.spy(),
            newItem = BEM.MODEL.create('item', { f: 1 });

        model.on('list', 'change', onChangeSpy);

        model.set('list', [newItem]);

        expect(onChangeSpy.called).to.equal(true);
    });

    describe('model with two models lists with same modelName', function() {
        beforeEach(function() {
            BEM.MODEL.decl('item-model', { field: 'string' });

            BEM.MODEL.decl('model', {
                list1: {
                    type: 'models-list',
                    modelName: 'item-model'
                },
                list2: {
                    type: 'models-list',
                    modelName: 'item-model'
                }
            });
        });

        it('.add should change only one field', function() {
            var model = BEM.MODEL.create('model');

            model.get('list1').add({ field: 1 });

            expect(model.get('list2').length()).to.equal(0);
        });

        it('.addByIndex should change only one field', function() {
            var model = BEM.MODEL.create('model');

            model.get('list1').addByIndex(0, { field: 1 });

            expect(model.get('list2').length()).to.equal(0);
        });

    });
});
