var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),

    sinonChai = require("sinon-chai"),

    universalBundle = require('fs').readFileSync('./desktop.bundles/universal/_universal.js').toString(),
    createModels = new Function('BEM', universalBundle);

chai.use(sinonChai);

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
            describe('@param model', function() {
                beforeEach(function() {
                    BEM.MODEL.decl('model', {});
                });

                it('by string', function() {
                    expect(BEM.MODEL.create('model')).to.be.a('object');
                });

                it('by object', function() {
                    expect(BEM.MODEL.create({ name: 'model' })).to.be.a('object');
                });

                it('should set model id from params', function() {
                    var model = BEM.MODEL.create({ name: 'model', id: 'myid' });

                    expect(model.id).to.equal('myid');
                });

                it('should generate id', function() {
                    var model = BEM.MODEL.create({ name: 'model' });

                    expect(model.id).to.be.a('string');
                });

                it('should throw if model is not declared', function() {
                    expect(function() {
                        BEM.MODEL.create('new-model');
                    }).to.Throw();
                });

                it('should trigger create event', function() {
                    var createSpy = sinon.spy();

                    BEM.MODEL.on('model', 'create', createSpy);

                    BEM.MODEL.create('model');

                    expect(createSpy).calledWith();
                });
            });

            describe('@param data', function() {
                it('should init model with data object', function() {
                    BEM.MODEL.decl('model', {
                        field: ''
                    });

                    var model = BEM.MODEL.create('model', { field: 1 });

                    expect(model.get('field')).to.equal(1);
                });
            });
        });

        describe('.get', function() {
            it('should return model if param is string', function() {
                BEM.MODEL.decl('model', {});

                var model = BEM.MODEL.create('model');

                expect(BEM.MODEL.get('model')[0]).to.equal(model);
            });

            it('should return model if param is object', function() {
                BEM.MODEL.decl('model', {});

                var model = BEM.MODEL.create({ name: 'model' });

                expect(BEM.MODEL.get('model')[0]).to.equal(model);
            });

            it('should return model by name and id', function() {
                BEM.MODEL.decl('model', {});

                var model = BEM.MODEL.create({ name: 'model', id: 'myid' });

                expect(BEM.MODEL.get({ name: 'model', id: 'myid' })[0]).to.equal(model);
            });

            it('should throw if model is not declared', function() {
                expect(function() {
                    BEM.MODEL.get('new-model');
                }).to.Throw();
            });

            it('should return model by parentModel', function() {
                //todo
            });

            it('should return model by path', function() {
                //todo
            });

            it('should drop cache', function() {
                //todo
            });
        });

        describe('.getOne', function() {
            it('should return one (last) model', function() {
                BEM.MODEL.decl('model', {});

                BEM.MODEL.create({ name: 'model' });

                var model = BEM.MODEL.create({ name: 'model' });

                expect(BEM.MODEL.getOne('model')).to.equal(model);
            });
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
