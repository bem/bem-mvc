modules.define('test', ['model', 'sinon', 'jquery', 'chai'], function(provide, MODEL, sinon, $, chai) {
    var _spy = sinon.spy;
    sinon.spy = function() {
        return _spy.call(sinon)
    };

    var expect = chai.expect;

describe('MODEL', function() {

    describe('create model', function() {
        MODEL.decl('model-to-create', {
            f1: 'string',
            f2: 'string'
        });

        it('should create model without params', function() {
            MODEL
                .create('model-to-create')
                .toJSON().should.be.eql({
                    f1: '',
                    f2: ''
                });
        });

        it('should create model with params', function() {
            MODEL
                .create('model-to-create', {
                    f1: 'F1',
                    f2: 'F2'
                })
                .toJSON().should.be.eql({
                    f1: 'F1',
                    f2: 'F2'
                });
        });
    });

    describe('model methods', function() {
        MODEL.decl('model-with-methods', {
            f1: 'number',
            f2: 'number'
        }, {
            modelMethod: function() {},
            getSum: function() { return this.get('f1') + this.get('f2'); }
        });

        it('should create model with methods', function() {
            (typeof MODEL.create('model-with-methods', {}).modelMethod).should.be.equal('function');
        });

        it('should return sum of fields', function() {
            MODEL.create('model-with-methods', { f1: 1, f2: 2 }).getSum().should.be.eql(3);
        });

        it('should not override protected methods', function() {
            (function() {
                MODEL.decl('model-with-protected-method', {
                }, {
                    set: function() {}
                });
            }).should.to.throw('method "set" is protected');
        });
    });

    // BASE MODEL
    describe('base model', function() {
        MODEL.decl('base-model', {
            baseField1: 'string',
            baseField2: 'string'
        });

        MODEL.decl({ model: 'model-with-base', baseModel: 'base-model' }, {
            myField: 'string'
        });

        it('should have base fields', function() {
            MODEL
                .create('model-with-base', {
                    baseField1: 'str',
                    myField: 'mystr'
                })
                .set('baseField2', 'str2')
                .toJSON()
            .should.be.eql({
                baseField1: 'str',
                baseField2: 'str2',
                myField: 'mystr'
            });
        });
    });

    // BASE MODEL WITH METHODS
    describe('base model with methods', function() {
        MODEL.decl('base-model-with-methods', {
            f1: 'number'
        }, {
            getF1: function() { return this.get('f1') }
        });

        MODEL.decl({ model: 'model-with-base-and-methods', baseModel: 'base-model-with-methods'}, {
            f1: 'number',
            f2: 'number'
        }, {
            getSum: function() { return this.get('f2') + this.getF1() }
        });

        it('should not have "getSum" method', function() {
            expect(MODEL.create('base-model-with-methods', { f1: 1 }).getSum).to.be.undefined;
        });

        it('should have "getF1" method', function() {
            expect(MODEL.create('model-with-base-and-methods', { f1: 1, f2: 2 }).getF1).to.be.defined;
        });

        it('should return sum of f1 and f2', function() {
            expect(MODEL.create('model-with-base-and-methods', { f1: 1, f2: 2 }).getSum()).to.be.equal(3);
        });
    });

    describe('internal fields', function() {
        MODEL.decl('model-with-internal-fields', {
            publicField: {
                type: 'string'
            },
            internalField: {
                type: 'string',
                internal: true
            },
            notInternalField: {
                type: 'string',
                internal: false
            }
        });

        var model = MODEL.create('model-with-internal-fields',{
            publicField: 'public',
            internalField: 'i\'m internal',
            notInternalField: 'i\'m not internal'
        });

        it('should show internal fields in toJSON', function() {
            expect(
                MODEL
                    .create('model-with-internal-fields', {
                        publicField: 'public',
                        internalField: 'i\'m internal',
                        notInternalField: 'i\'m not internal'
                    })
                    .toJSON())
                .to.be.eql({
                    publicField: 'public',
                    notInternalField: 'i\'m not internal'
                });
        });

    });

    describe('get', function() {
        MODEL.decl('model-for-get', {
            f1: { type: 'string' }
        });

        MODEL.decl('sub-model-for-get', {
            s1: { type: 'string' }
        });

        var model = MODEL.create({ name: 'model-for-get', id: 1 }, { f1: 1 }),
            model10 = MODEL.create({ name: 'model-for-get', id: 10 }, { f1: 1 }),
            subModel = MODEL.create({ name: 'sub-model-for-get', id: 1, parentName: 'model-for-get', parentId: 1 }, { f1: 1 }),
            subModel2 = MODEL.create({ name: 'sub-model-for-get', id: 2, parentModel: model }, { f1: 1 });

        it('should find model', function() {
            MODEL.get('model-for-get').length.should.be.eql(2);
            MODEL.get({ name: 'model-for-get', id: '*' }).length.should.be.eql(2);
            MODEL.get({ name: 'model-for-get', id: 1 }).length.should.be.eql(1);
            MODEL.get({ name: 'model-for-get', id: 1 })[0].should.be.eql(model);
            MODEL.get({ name: 'model-for-get', id: 10 })[0].should.be.eql(model10);
        });

        it('should find sub model', function() {
            MODEL.get('sub-model-for-get').length.should.be.eql(2);
            MODEL.get({ name: 'sub-model-for-get', id: '*' }).length.should.be.eql(2);

            MODEL.get({ name: 'sub-model-for-get', id: '1' })[0].should.be.eql(subModel);
            MODEL.get({ name: 'sub-model-for-get', id: '1', parentModel: model }, true)[0].should.be.eql(subModel);
            MODEL.get({ name: 'sub-model-for-get', id: '1', parentName: 'model-for-get', parentId: 1 }, true)[0].should.be.eql(subModel);
            MODEL.get({ name: 'sub-model-for-get', id: '1', parentPath: model.path() }, true)[0].should.be.eql(subModel);

            MODEL.get({ name: 'sub-model-for-get', id: '2', parentPath: model.path() }, true)[0].should.be.eql(subModel2);
        });
    });

    describe('global events', function() {
        MODEL.decl('event-model', {
            field: { type: 'string' }
        });

        MODEL.decl('event-sub-model', {
            field: { type: 'string' }
        });

        MODEL.decl('to-destruct', {
            f1: { type: 'string' }
        });


        var createCallback = sinon.spy('spyCallback');

        MODEL.on('to-destruct', 'create', createCallback);

        it('createCallback should be called', function() {
            createCallback.should.have.been.called;
        });

        var changeCallback = sinon.spy('changeCallback'),
            fieldChangeCallback = sinon.spy('fieldChangeCallback'),
            unCallback = sinon.spy('unCallback'),
            subModelCallback = sinon.spy('subModelCallback'),
            customCallback = sinon.spy('customCallback'),
            destructCallback = sinon.spy('destructCallback'),

            ctx = { ctx: 1 },

            model1 = MODEL.create('event-model', { field: 1 }),
            model2 = MODEL.create('event-model', { field: 2 }),

            subModel = MODEL.create({ name: 'event-sub-model', parentModel: model1 }, { field: 2 }),

            toDestruct = MODEL.create('to-destruct', { f1: 'val1' });


        MODEL.on({ name: 'event-model' }, 'change', changeCallback);
        MODEL.on({ name: 'event-model' }, 'change', unCallback, ctx);
        MODEL.on({ name: 'event-model' }, 'field', 'change', fieldChangeCallback);

        MODEL.on({ name: 'event-sub-model', parentName: 'event-model', parentId: model1.id }, 'change', subModelCallback);

        MODEL.on('event-model', 'custom-event', customCallback);

        var model3 = MODEL.create('event-model', { field: 3 });


        it('changeCallback should be called', function() {
            changeCallback.should.have.been.called;
        });

        it('changeCallback should be called 3 times', function() {
            changeCallback.should.have.been.calledThrise;
        });

        it('fieldChangeCallback should be called', function() {
            fieldChangeCallback.should.have.been.called;
        });

        it('fieldChangeCallback should be called 3 times', function() {
            fieldChangeCallback.should.have.been.calledThrise;
        });

        it('unCallback should not be called', function() {
            unCallback.should.have.not.been.called;
        });

        it('subModelCallback should be called 1 time', function() {
            subModelCallback.should.have.been.calledOnce;
        });

        it('customCallback should be called 1 time', function() {
            customCallback.should.have.been.calledOnce;
        });

        MODEL.un({ name: 'event-model' }, 'change', unCallback, ctx);

        toDestruct.on('destruct', destructCallback);
        MODEL.on({ name: 'to-destruct' }, 'destruct', destructCallback, {});
        //MODEL.destruct('to-destruct');
        toDestruct.destruct();

        it('toDestruct should be destroyed', function() {
            MODEL.get('to-destruct', true).length.should.be.eql(0);
        });
        it('destructCallback should be called 2 times', function() {
            destructCallback.should.have.been.calledTwice;
        });

        model1.set('field', 111);
        model2.set('field', 222);
        model3.set('field', 333);

        subModel.set('field', 123);

        model1.trigger('custom-event');
    });

    describe('trigger', function() {
        MODEL.decl('model-for-trigger', { f1: 'number', f2: 'string' });

        it('should trigger event (model name)', function() {
            var onModelChange = sinon.spy('onModelChange'),
                onFieldChange = sinon.spy('onFieldChange'),
                disabledHandler = sinon.spy('disabledHandler');

            MODEL
                .create('model-for-trigger', { f1: 1, f2: 'bla' })
                .on('change', onModelChange)
                .on('f1', 'change', onFieldChange)
                .on('change', disabledHandler)
                .un('change', disabledHandler);

            MODEL.trigger('model-for-trigger', 'f1', 'change');

            // событие на поле не всплывёт после .trigger только после set
            onModelChange.should.not.have.been.calledOnce;

            onFieldChange.should.have.been.calledOnce;
            disabledHandler.should.not.have.been.calledOnce;

            MODEL.getOne('model-for-trigger').set('f1', 2);
            onModelChange.should.have.been.calledOnce; // событие на поле всплывёт после set
        });


        it('should trigger event (model path object)', function() {
            var onModelChange = sinon.spy('onModelChange'),
                onFieldChange = sinon.spy('onFieldChange'),
                disabledHandler = sinon.spy('disabledHandler'),
                modelParams = { name: 'model-for-trigger', id: 1 };

            MODEL
                .create(modelParams, { f1: 1, f2: 'bla' })
                .on('change', onModelChange)
                .on('f1', 'change', onFieldChange)
                .on('change', disabledHandler)
                .un('change', disabledHandler);


            MODEL.trigger(modelParams, 'f1', 'change');

            onModelChange.should.not.have.been.calledOnce; // событие на поле не всплывёт после .trigger только после set

            onFieldChange.should.have.been.calledOnce;
            disabledHandler.should.not.have.been.calledOnce

            MODEL.getOne(modelParams).set('f1', 2);
            onModelChange.should.have.been.calledOnce; // событие на поле всплывёт после set
        });


    });

    describe('destruct', function() {
        MODEL.decl('model-for-destruct1', { f1: 'number', f2: 'string' });
        MODEL.decl('model-for-destruct2-parent', { f1: 'number', f2: 'string' });
        MODEL.decl('model-for-destruct2', { f1: 'number', f2: 'string' });
        MODEL.decl('model-for-destruct3', { f1: 'number', f2: 'string' });

        var modelForDestruct1 = MODEL.create('model-for-destruct1', { f1: 1, f2: 'bla' }),
            modelForDestruct2Params = {
                name: 'model-for-destruct2',
                parentName: 'model-for-destruct2-parent'
            },
            modelForDestruct2 = MODEL.create(modelForDestruct2Params, { f1: 1, f2: 'bla' }),
            modelForDestruct3 = MODEL.create('model-for-destruct3', { f1: 1, f2: 'bla' });

        it('destruct(MODEL)', function() {
            MODEL.destruct(modelForDestruct1);
            expect(MODEL.get(modelForDestruct1.name, 1).length).to.be.equal(0);
        });

        it('destruct(name)', function() {
            MODEL.destruct(modelForDestruct3.name);
            expect(MODEL.get(modelForDestruct3.name, 1).length).to.be.equal(0);
        });

        it('destruct(modelPath)', function() {
            MODEL.destruct(modelForDestruct2Params);
            expect(MODEL.get(modelForDestruct2.name, 1).length).to.be.equal(0);
        });

    });
/*
    //todo: написать тест на валидацию по максимально развернутой схеме
    describe('validate', function() {
        MODEL.decl('valid-model', {
            f1: {
                type: 'string',
                validation: {
                    rules: {
                        required: true,
                        maxlength: 10
                    }
                }
            },
            f2: {
                type: 'string',
                validation: {
                    rules: {
                        required: true
                    }
                }
            },
            f3: {
                type: 'number',
                validation: {
                    rules: {
                        required: true,
                        max: 10,
                        ruleF3: {
                            needToValidate: function() {
                                return false;
                            },
                            validate: function() {
                                return false;
                            }
                        }
                    }
                }
            },
            f4: {
                validation: {
                    needToValidate: function() {
                        return false;
                    },
                    validate: function() {
                        return true;
                    }
                }
            }
        });

        var model = MODEL.create('valid-model', {
            f1: '11234',
            f2: '222'
        });

        it('model should be valid', function() {
            model.set('f3', 1);
            expect(model.isValid()).toEqual(true);
        });

        it('model should be invalid', function() {
            model.clear('f1');
            expect(model.isValid()).toEqual(false);
        });
    });


    describe('buildPath', function() {

        describe('buildPath pathParts.name', function() {
            it('for model', function() {
                expect(MODEL.buildPath({ name: 'model' })).toEqual('model:*');
            });

            it('for models', function() {
                expect(MODEL.buildPath([{ name: 'model1' }, { name: 'model2' }])).toEqual('model1:*,model2:*');
            });
        });

        describe('buildPath pathParts.name [pathParts.id]', function() {
            it('for model', function() {
                expect(MODEL.buildPath({ name: 'model', id: 1 })).toEqual('model:1');

                expect(MODEL.buildPath({ name: 'model', id: '2' })).toEqual('model:2');
            });

            it('for models', function() {
                expect(MODEL.buildPath([{ name: 'model', id: 1 }, { name: 'model', id: '2' }]))
                    .toEqual('model:1,model:2');
            });
        });

        // parent
        describe('buildPath pathParts.name [pathParts.parentName]', function() {
            it('for model', function() {
                expect(MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    parentName: 'parent-model'
                })).toEqual('parent-model.model:1');
            });

            it('for models', function() {
                expect(MODEL.buildPath([
                    {
                        name: 'model',
                        id: 1,
                        parentName: 'parent-model'
                    },
                    {
                        name: 'model',
                        id: '2',
                        parentName: 'parent-model'
                    }
                ])).toEqual('parent-model.model:1,parent-model.model:2');
            });
        });

        describe('buildPath pathParts.name [pathParts.parentId]', function() {
            it('for model', function() {
                expect(MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    parentName: 'parent-model',
                    parentId: 42
                })).toEqual('parent-model:42.model:1');
            });

            it('for models', function() {
                expect(MODEL.buildPath([
                    {
                        name: 'model',
                        id: 1,
                        parentName: 'parent-model',
                        parentId: 42
                    },
                    {
                        name: 'model',
                        id: '2',
                        parentName: 'parent-model',
                        parentId: '2'
                    }
                ])).toEqual('parent-model:42.model:1,parent-model:2.model:2');
            });
        });

        describe('buildPath pathParts.name [pathParts.parentPath]', function() {
            it('for model', function() {
                expect(MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    parentPath: {
                        name: 'parent-model',
                        id: 1
                    }
                })).toEqual('parent-model:1.model:1');
            });

            it('for models', function() {
                expect(MODEL.buildPath([
                    {
                        name: 'model',
                        id: 1,
                        parentPath: {
                            name: 'parent-model',
                            id: 1
                        }
                    },
                    {
                        name: 'model',
                        id: '2',
                        parentPath: {
                            name: 'parent-model',
                            id: 1
                        }
                    }
                ])).toEqual('parent-model:1.model:1,parent-model:1.model:2');
            });
        });

        MODEL.decl('parent-model', {
            f1: 'string',
            f2: 'string',
            f3: 'string'
        });

        var parentModel1 = MODEL.create({ name: 'parent-model', id: 1 }, {
            f1: '11234',
            f2: '222'
        });

        describe('buildPath pathParts.name [pathParts.parentModel]', function() {
            it('for model', function() {
                expect(MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    parentModel: parentModel1
                })).toEqual('parent-model:1.model:1');
            });

            it('for models', function() {
                expect(MODEL.buildPath([
                    {
                        name: 'model',
                        id: 1,
                        parentModel: parentModel1
                    },
                    {
                        name: 'model',
                        id: '2',
                        parentModel: parentModel1
                    }
                ])).toEqual('parent-model:1.model:1,parent-model:1.model:2');
            });
        });


        //child
        describe('buildPath pathParts.name [pathParts.childName]', function() {
            it('for model', function() {
                expect(MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    childName: 'child-model'
                })).toEqual('model:1.child-model');
            });

            it('for models', function() {
                expect(MODEL.buildPath([
                    {
                        name: 'model',
                        id: 1,
                        childName: 'child-model'
                    },
                    {
                        name: 'model',
                        id: '2',
                        childName: 'child-model'
                    }
                ])).toEqual('model:1.child-model,model:2.child-model');
            });
        });

        describe('buildPath pathParts.name [pathParts.childId]', function() {
            it('for model', function() {
                expect(MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    childName: 'child-model',
                    childId: 42
                })).toEqual('model:1.child-model:42');
            });

            it('for models', function() {
                expect(MODEL.buildPath([
                    {
                        name: 'model',
                        id: 1,
                        childName: 'child-model',
                        childId: 42
                    },
                    {
                        name: 'model',
                        id: '2',
                        childName: 'child-model',
                        childId: '2'
                    }
                ])).toEqual('model:1.child-model:42,model:2.child-model:2');
            });
        });

        describe('buildPath pathParts.name [pathParts.childPath]', function() {
            it('for model', function() {
                expect(MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    childPath: {
                        name: 'child-model',
                        id: 1
                    }
                })).toEqual('model:1.child-model:1');
            });

            it('for models', function() {
                expect(MODEL.buildPath([
                    {
                        name: 'model',
                        id: 1,
                        childPath: {
                            name: 'child-model',
                            id: 1
                        }
                    },
                    {
                        name: 'model',
                        id: '2',
                        childPath: {
                            name: 'child-model',
                            id: 1
                        }
                    }
                ])).toEqual('model:1.child-model:1,model:2.child-model:1');
            });
        });

        MODEL.decl('child-model', {
            f1: 'string',
            f2: 'string',
            f3: 'string'
        });

        var childModel1 = MODEL.create({ name: 'child-model', id: 1 }, {
            f1: '11234',
            f2: '222'
        });

        describe('buildPath pathParts.name [pathParts.childModel]', function() {
            it('for model', function() {
                expect(MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    childModel: childModel1
                })).toEqual('model:1.child-model:1');
            });

            it('for models', function() {
                expect(MODEL.buildPath([
                    {
                        name: 'model',
                        id: 1,
                        childModel: childModel1
                    },
                    {
                        name: 'model',
                        id: '2',
                        childModel: childModel1
                    }
                ])).toEqual('model:1.child-model:1,model:2.child-model:1');
            });
        });


        MODEL.decl('grand-parent-model', {
            f1: 'string',
            f2: 'string',
            f3: 'string'
        });

        MODEL.decl('child-child-model', {
            f1: 'string',
            f2: 'string',
            f3: 'string'
        });

        var grandParentModel = MODEL.create({ name: 'grand-parent-model', id: 'granny' }, {
                f1: '11'
            }),
            childChildModel = MODEL.create({ name: 'child-child-model', id: 'some' }, {
                f1: '11234',
                f2: '222'
            });

        describe('buildPath for long long pathParts', function() {
            it('for model', function() {
                expect(MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    parentPath: {
                        name: 'parent',
                        id: 1,
                        parentModel: grandParentModel
                    },
                    childPath: {
                        name: 'child-model',
                        id: 2,
                        childModel: childChildModel
                    }
                })).toEqual('grand-parent-model:granny.parent:1.model:1.child-model:2.child-child-model:some');
            });
        });

    });
*/

});

provide();

});
