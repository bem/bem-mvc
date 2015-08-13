var expect = require('chai').expect;

var universalBundle = require('fs').readFileSync('./desktop.bundles/universal/_universal.js').toString();
var createModels = new Function('BEM', universalBundle);

describe('i-model', function() {
    beforeEach(function() {
        GLOBAL.BEM = { MODEL: {} };

        createModels(GLOBAL.BEM);
    });

    describe('BEM.MODEL', function() {
        describe('.decl', function() {

            describe('@param decl', function() {
                it('by string', function() {
                    BEM.MODEL.decl('model', {});

                    expect(BEM.MODEL.create('model')).to.be.a('object');
                });

                it('by object with name', function() {
                    BEM.MODEL.decl({ name: 'model' }, {});

                    expect(BEM.MODEL.create('model')).to.be.a('object');
                });

                it('by object with model', function() {
                    BEM.MODEL.decl({ model: 'model' }, {});

                    expect(BEM.MODEL.create('model')).to.be.a('object');
                });

                it('by object with baseModel', function() {
                    BEM.MODEL.decl('baseModel', { baseField: '' });
                    BEM.MODEL.decl({ model: 'model', baseModel: 'baseModel' }, {});

                    var model = BEM.MODEL.create('model');

                    expect(model.hasField('baseField')).to.equal(true);
                });

                it('should throw if baseModel is undefined', function() {
                    expect(function() {
                        BEM.MODEL.decl({ model: 'model', baseModel: 'baseModel' });
                    }).to.Throw();
                });
            });

            describe('@param fields', function() {
                it('by string', function() {
                    BEM.MODEL.decl('model', {
                        field: 'string'
                    });

                    var model = BEM.MODEL.create('model', { field: 'str' });

                    expect(model.get('field')).to.be.a('string');
                });

                it('by object', function() {
                    BEM.MODEL.decl('model', {
                        field: {
                            type: 'string'
                        }
                    });

                    var model = BEM.MODEL.create('model', { field: 'str' });

                    expect(model.get('field')).to.be.a('string');
                });
            });

        });

        describe('.create', function() {

        });

        describe('.get', function() {

        });

        describe('.getOrCreate', function() {

        });

        describe('.on', function() {

        });

        describe('.un', function() {

        });

        describe('.trigger', function() {

        });

        describe('.destruct', function() {

        });

        describe('.buildPath', function() {

        });

        describe('.forEachModel', function() {

        });
    });
});
