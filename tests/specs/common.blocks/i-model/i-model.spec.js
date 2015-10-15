var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),

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

                it('should throw error if baseModel is undefined', function() {
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

                    expect(model.get('field')).to.equal('str');
                });

                it('by object', function() {
                    BEM.MODEL.decl('model', {
                        field: {
                            type: 'string'
                        }
                    });

                    var model = BEM.MODEL.create('model', { field: 'str' });

                    expect(model.get('field')).to.equal('str');
                });
            });

            describe('@param protoProps', function() {
                it('should declare prototype methods', function() {
                    BEM.MODEL.decl('model', {
                        field: 'string'
                    }, {
                        getVal: function() {
                            return this.get('field');
                        }
                    });

                    var model = BEM.MODEL.create('model', { field: 'str' });

                    expect(model.getVal()).to.equal('str');
                });
            });

            describe('@param staticProps', function() {
                it('should declare static methods', function() {
                    BEM.MODEL.decl('model', {}, {}, {
                        getStatVal: function() {
                            return 'val';
                        }
                    });

                    expect(BEM.MODEL.models['model'].getStatVal()).to.equal('val');
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

                    expect(createSpy.called).to.equal(true);
                });
            });

            describe('@param data', function() {
                it('should init model with data object', function() {
                    BEM.MODEL.decl('model', {
                        field: ''
                    });

                    var model = BEM.MODEL.create('model', { field: 'val' });

                    expect(model.get('field')).to.equal('val');
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

        describe('.models', function() {
            it('should store model constructor', function() {
                BEM.MODEL.decl('model', {});

                expect(typeof BEM.MODEL.models['model']).to.equal('function');
            });
        });

        describe('.getOrCreate', function() {
            it('should return existing model', function() {
                //todo
            });

            it('should return created model', function() {
                //todo
            });

            it('should return created model with data from storage', function() {
                //todo
            });
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

    describe('model', function() {
        describe('.path', function() {
            it('should return model\'s path', function() {
                BEM.MODEL.decl('model', {});

                expect(BEM.MODEL.create({ name: 'model', id: '1' }).path()).to.equal('model:1');
            });
        });

        describe('.get', function() {
            it('should return field\'s value', function() {
                BEM.MODEL.decl('model', { field: '' });

                expect(BEM.MODEL.create('model', { field: 'val' }).get('field')).to.equal('val');
            });

            // todo cases
        });

        describe('.set', function() {
            it('should set field\'s value', function() {
                BEM.MODEL.decl('model', { field: '' });

                var model = BEM.MODEL.create('model');

                model.set('field', 'val');

                expect(model.get('field')).to.equal('val');
            });

            // todo cases
        });

        describe('.clear', function() {
            it('should clear all fields', function() {
                BEM.MODEL.decl('model', { field1: '', field2: '' });

                var model = BEM.MODEL.create('model', { field1: 'val1', field2: 'val2' });

                model.clear();

                expect(model.toJSON()).to.eql({ field1: undefined, field2: undefined });
            });

            // todo cases
        });

        describe('.update', function() {
            it('should update model\'s fields', function() {
                BEM.MODEL.decl('model', { field1: '', field2: '' });

                var model = BEM.MODEL.create('model');

                model.update({ field1: 'val1', field2: 'val2' });

                expect(model.toJSON()).to.eql({ field1: 'val1', field2: 'val2' });
            });

            // todo cases
        });

        describe('.hasField', function() {
            it('should return true if filed is declared', function() {
                BEM.MODEL.decl('model', { field: '' });

                expect(BEM.MODEL.create('model').hasField('field')).to.equal(true);
            });

            it('should return false if filed is not declared', function() {
                BEM.MODEL.decl('model', { field: '' });

                expect(BEM.MODEL.create('model').hasField('wrongField')).to.equal(false);
            });
        });

        describe('.isEmpty', function() {
            it('should return true if model is empty', function() {
                BEM.MODEL.decl('model', { field: '' });

                expect(BEM.MODEL.create('model').isEmpty()).to.equal(true);
            });

            it('should return false if model is not empty', function() {
                BEM.MODEL.decl('model', { field: '' });

                expect(BEM.MODEL.create('model', { field: 0 }).isEmpty()).to.equal(false);
            });

            it('should return true if field is empty', function() {
                BEM.MODEL.decl('model', { field: '' });

                expect(BEM.MODEL.create('model').isEmpty('field')).to.equal(true);
            });

            it('should return false if field is not empty', function() {
                BEM.MODEL.decl('model', { field: '' });

                expect(BEM.MODEL.create('model', { field: 0 }).isEmpty('field')).to.equal(false);
            });
        });

        describe('.isChanged', function() {
            it('should return true if model is changed', function() {
                BEM.MODEL.decl('model', { field: '' });

                var model = BEM.MODEL.create('model');

                model.set('field', 'val');

                expect(model.isChanged()).to.equal(true);
            });

            it('should return false if model is not changed', function() {
                BEM.MODEL.decl('model', { field: '' });

                var model = BEM.MODEL.create('model');

                expect(model.isChanged()).to.equal(false);
            });

            it('should return true if field is changed', function() {
                BEM.MODEL.decl('model', { field: '' });

                var model = BEM.MODEL.create('model');

                model.set('field', 'val');

                expect(model.isChanged('field')).to.equal(true);
            });

            it('should return false if field is not changed', function() {
                BEM.MODEL.decl('model', { field: '' });

                var model = BEM.MODEL.create('model');

                expect(model.isChanged('field')).to.equal(false);
            });
        });

        describe('.getType', function() {
            it('should return field\'s type', function() {
                BEM.MODEL.decl('model', { field: 'field_type' });

                expect(BEM.MODEL.create('model').getType('field')).to.equal('field_type');
            });
        });

        describe('.fix', function() {
            it('should fix model\'s fields', function() {
                BEM.MODEL.decl('model', { field: 'field_type' });

                var model = BEM.MODEL.create('model');

                model.set('field', 'val');
                model.fix();

                expect(model.isChanged()).to.equal(false);
            });

            it('should trigger fix event', function() {
                BEM.MODEL.decl('model', { field: 'field_type' });

                var fixSpy = sinon.spy(),
                    model = BEM.MODEL.create('model');

                model.on('fix', fixSpy);

                model.set('field', 'val');
                model.fix();

                expect(fixSpy.called).to.equal(true);
            });
        });

        describe('.rollback', function() {
            it('should rollback model\'s fields to fixed state', function() {
                BEM.MODEL.decl('model', { field: 'field_type' });

                var model = BEM.MODEL.create('model', { field: 'init val' });

                model.fix();

                model.set('field', 'new val');
                model.rollback();

                expect(model.get('field')).to.equal('init val');
            });

            it('should trigger rollback event', function() {
                BEM.MODEL.decl('model', { field: 'field_type' });

                var rollbackSpy = sinon.spy(),
                    model = BEM.MODEL.create('model', { field: 'init val' });

                model.on('rollback', rollbackSpy);

                model.fix();

                model.set('field', 'new val');
                model.rollback();

                expect(rollbackSpy.called).to.equal(true);
            });

            it('should rollback one field', function() {
                BEM.MODEL.decl('model', { field: 'field_type' });

                var model = BEM.MODEL.create('model', { field: 'init val' });

                model.fix();

                model.set('field', 'new val');
                model.rollback('field');

                expect(model.get('field')).to.equal('init val');
            });
        });

        describe('.toJSON', function() {
            it('should return object width model data', function() {
                BEM.MODEL.decl('model', { field: '' });

                expect(BEM.MODEL.create('model', { field: 'val' }).toJSON()).to.eql({ field: 'val' });
            });
        });

        describe('.getFixedValue', function() {
            it('should return fixed state', function() {
                BEM.MODEL.decl('model', { field: '' });

                var model = BEM.MODEL.create('model');

                model
                    .set('field', 'fix val')
                    .fix();

                expect(model.getFixedValue()).to.eql({ field: 'fix val' });
            });
        });

        describe('.on', function() {
            it('should exec callback on event on model', function() {
                BEM.MODEL.decl('model', { field: '' });

                var onEventSpy = sinon.spy(),
                    model = BEM.MODEL.create('model');

                model.on('event', onEventSpy);

                model.trigger('event');

                expect(onEventSpy.called).to.equal(true);
            });

            it('should exec callback on event on field', function() {
                BEM.MODEL.decl('model', { field: '' });

                var onEventSpy = sinon.spy(),
                    model = BEM.MODEL.create('model');

                model.on('field', 'event', onEventSpy);

                model.trigger('field', 'event');

                expect(onEventSpy.called).to.equal(true);
            });

            // todo cases
        });

        describe('.un', function() {
            it('should unsubscribe callback from event', function() {
                BEM.MODEL.decl('model', { field: '' });

                var onEventSpy = sinon.spy(),
                    model = BEM.MODEL.create('model');

                model.on('event', onEventSpy);
                model.un('event', onEventSpy);

                model.trigger('event');

                expect(onEventSpy.called).not.to.equal(true);
            });

            it('should unsubscribe from events on all fileds', function() {
                BEM.MODEL.decl('model', { field: '' });

                var onEventSpy = sinon.spy(),
                    model = BEM.MODEL.create('model');

                model.on('field', 'change', onEventSpy);
                model.un();

                model.set('field', 'val');

                expect(onEventSpy.called).not.to.equal(true);
            });

            // todo cases
        });

        describe('.trigger', function() {
            it('should trigger event on model', function() {
                BEM.MODEL.decl('model', { field: '' });

                var onEventSpy = sinon.spy(),
                    model = BEM.MODEL.create('model');

                model.on('event', onEventSpy);

                model.trigger('event');

                expect(onEventSpy.called).to.equal(true);
            });

            // todo cases
        });

        describe('.destruct', function() {
            it('should remove model from storage', function() {
                BEM.MODEL.decl('model', { field: '' });

                var model = BEM.MODEL.create('model');

                model.destruct();

                expect(BEM.MODEL.getOne('model')).to.equal(undefined);
            });

            it('should unsubscribe from model events', function() {
                BEM.MODEL.decl('model', { field: '' });

                var onEventSpy = sinon.spy(),
                    model = BEM.MODEL.create('model');

                model.on('event', onEventSpy);
                model.destruct();

                model.trigger('event');

                expect(onEventSpy.called).to.equal(false);
            });

            it('should unsubscribe from field events', function() {
                BEM.MODEL.decl('model', { field: '' });

                var onEventSpy = sinon.spy(),
                    model = BEM.MODEL.create('model');

                model.on('field', 'change', onEventSpy);
                model.destruct();

                model.set('field', 'val');

                expect(onEventSpy.called).to.equal(false);
            });
        });

        describe('.isValid', function() {
            it('should return true if model is valid', function() {
                BEM.MODEL.decl('model', { field: '' });

                var model = BEM.MODEL.create('model');

                expect(model.isValid()).to.equal(true);
            });

            it('should return false if model is invalid', function() {
                BEM.MODEL.decl('model', {
                    field: {
                        type: '',
                        validation: {
                            validate: function() {
                                return false;
                            }
                        }
                    }
                });

                var model = BEM.MODEL.create('model');

                expect(model.isValid()).to.equal(false);
            });
        });

        describe('.validate', function() {
            it('should return information about invalid field', function() {
                BEM.MODEL.decl('model', {
                    field: {
                        type: '',
                        validation: {
                            validate: function() {
                                return false;
                            }
                        }
                    }
                });

                var model = BEM.MODEL.create('model');

                expect(model.validate().errorFields).to.eql(['field']);
            });

            // todo cases
        });

        describe('.isEqual', function() {
            it('should return true if data is equal to model', function() {
                BEM.MODEL.decl('model', { field: '' });

                var model = BEM.MODEL.create('model', { field: 'val' });

                expect(model.isEqual({ field: 'val' })).to.equal(true);
            });

            it('should return false if data is not equal to model', function() {
                BEM.MODEL.decl('model', { field: '' });

                var model = BEM.MODEL.create('model', { field: 'val' });

                expect(model.isEqual({ field: 'wrong val' })).to.equal(false);
            });

            // todo cases
        });
    });
});
