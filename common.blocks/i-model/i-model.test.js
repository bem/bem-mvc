BEM.TEST.decl('i-model', function() {

    // BASE MODEL
    describe('base model', function() {
        BEM.MODEL.decl('base-model', {
            baseField1: 'string',
            baseField2: 'string'
        });

        BEM.MODEL.decl({ model: 'model-with-base', baseModel: 'base-model' }, {
            myField: 'string'
        });

        it('should have base fields', function() {
            expect(
                BEM.MODEL
                    .create('model-with-base', {
                        baseField1: 'str',
                        myField: 'mystr'
                    })
                    .set('baseField2', 'str2')
                    .toJSON())
                .toEqual({
                    baseField1: 'str',
                    baseField2: 'str2',
                    myField: 'mystr'
                });
        });
    });

    describe('type models-list', function() {
        var onAdd = jasmine.createSpy('onAdd'),
            onRemove = jasmine.createSpy('onRemove');

        BEM.MODEL.decl('outer-model-with-list', {
            list: {
                type: 'models-list',
                modelName: 'inner-model-in-list'
            }
        });
        BEM.MODEL.decl('inner-model-in-list', {
            field: 'string'
        });

        var model = BEM.MODEL.create('outer-model-with-list', {
            list: [
                {
                    field: 'blah'
                },
                {
                    field: 'bla bla'
                }
            ]
        });

        model.on('list', 'add', onAdd);

        model.on('list', 'remove', onRemove);

        var newModel = model.get('list').add({ field: 'bla bla blaaa' });

        model.get('list').remove(newModel.id);

        expect(onAdd).toHaveBeenCalled();
        expect(onRemove).toHaveBeenCalled();
    });

    //todo: Переформатировать тесты. Статические методы выделить в отдельный кусок
    describe('global get', function() {
        BEM.MODEL.decl('model', {
            f1: { type: 'string' }
        });

        BEM.MODEL.decl('sub-model', {
            s1: { type: 'string' }
        });

        var model = BEM.MODEL.create({ name: 'model', id: 1 }, { f1: 1 }),
            model10 = BEM.MODEL.create({ name: 'model', id: 10 }, { f1: 1 }),
            subModel = BEM.MODEL.create({ name: 'sub-model', id: 1, parentName: 'model', parentId: 1 }, { f1: 1 }),
            subModel2 = BEM.MODEL.create({ name: 'sub-model', id: 2, parentModel: model }, { f1: 1 });

        it('should find model', function() {
            expect(BEM.MODEL.get('model').length).toEqual(2);
            expect(BEM.MODEL.get({ name: 'model', id: '*' }).length).toEqual(2);
            expect(BEM.MODEL.get({ name: 'model', id: 1 }).length).toEqual(1);
            expect(BEM.MODEL.get({ name: 'model', id: 1 })[0]).toEqual(model);
            expect(BEM.MODEL.get({ name: 'model', id: 10 })[0]).toEqual(model10);
        });

        it('should find sub model', function() {
            expect(BEM.MODEL.get('sub-model').length).toEqual(2);
            expect(BEM.MODEL.get({ name: 'sub-model', id: '*' }).length).toEqual(2);

            expect(BEM.MODEL.get({ name: 'sub-model', id: '1' })[0]).toEqual(subModel);
            expect(BEM.MODEL.get({ name: 'sub-model', id: '1', parentModel: model }, true)[0]).toEqual(subModel);
            expect(BEM.MODEL.get({ name: 'sub-model', id: '1', parentName: 'model', parentId: 1 }, true)[0]).toEqual(subModel);
            expect(BEM.MODEL.get({ name: 'sub-model', id: '1', parentPath: model.path() }, true)[0]).toEqual(subModel);

            expect(BEM.MODEL.get({ name: 'sub-model', id: '2', parentPath: model.path() }, true)[0]).toEqual(subModel2);
        });
    });

    //todo: Переформатировать тесты. Статические методы выделить в отдельный кусок
    describe('global events', function() {
        BEM.MODEL.decl('event-model', {
            field: { type: 'string' }
        });

        BEM.MODEL.decl('event-sub-model', {
            field: { type: 'string' }
        });

        BEM.MODEL.decl('to-destruct', {
            f1: { type: 'string' }
        });


        var createCallback = jasmine.createSpy('spyCallback');
        BEM.MODEL.on('to-destruct', 'create', createCallback);

        it('createCallback should be called', function() {
            expect(createCallback).toHaveBeenCalled();
        });

        var changeCallback = jasmine.createSpy('spyCallback'),
            fieldChangeCallback = jasmine.createSpy('spyCallback'),
            unCallback = jasmine.createSpy('spyCallback'),
            subModelCallback = jasmine.createSpy('spyCallback'),
            customCallback = jasmine.createSpy('spyCallback'),
            destructCallback = jasmine.createSpy('spyCallback'),

            ctx = { ctx: 1 },

            model1 = BEM.MODEL.create('event-model', { field: 1 }),
            model2 = BEM.MODEL.create('event-model', { field: 2 }),

            subModel = BEM.MODEL.create({ name: 'event-sub-model', parentModel: model1 }, { field: 2 }),

            toDestruct = BEM.MODEL.create('to-destruct', { f1: 'val1' });


        BEM.MODEL.on({ name: 'event-model' }, 'change', changeCallback);
        BEM.MODEL.on({ name: 'event-model' }, 'change', unCallback, ctx);
        BEM.MODEL.on({ name: 'event-model' }, 'field', 'change', fieldChangeCallback);

        BEM.MODEL.on({ name: 'event-sub-model', parentName: 'event-model', parentId: model1.id }, 'change', subModelCallback);

        BEM.MODEL.on('event-model', 'custom-event', customCallback);

        var model3 = BEM.MODEL.create('event-model', { field: 3 });


        it('changeCallback should be called', function() {
            expect(changeCallback).toHaveBeenCalled();
        });

        it('changeCallback should be called 3 times', function() {
            expect(changeCallback.calls.length).toEqual(3);
        });

        it('fieldChangeCallback should be called', function() {
            expect(fieldChangeCallback).toHaveBeenCalled();
        });

        it('fieldChangeCallback should be called 3 times', function() {
            expect(fieldChangeCallback.calls.length).toEqual(3);
        });

        it('unCallback should not be called', function() {
            expect(unCallback.calls.length).toEqual(0);
        });

        it('subModelCallback should be called 1 time', function() {
            expect(subModelCallback.calls.length).toEqual(1);
        });

        it('customCallback should be called 1 time', function() {
            expect(customCallback.calls.length).toEqual(1);
        });

        BEM.MODEL.un({ name: 'event-model' }, 'change', unCallback, ctx);

        toDestruct.on('destruct', destructCallback);
        BEM.MODEL.on('to-destruct', 'destruct', destructCallback, {});
        //BEM.MODEL.destruct('to-destruct');
        toDestruct.destruct();

        it('toDestruct should be destroyed', function() {
            expect(BEM.MODEL.get('to-destruct', true).length).toEqual(0);
        });
        it('destructCallback should be called 2 times', function() {
            expect(destructCallback.calls.length).toEqual(2);
        });

        model1.set('field', 111);
        model2.set('field', 222);
        model3.set('field', 333);

        subModel.set('field', 123);

        model1.trigger('custom-event');
    });

    //todo: написать тест на валидацию по максимально развернутой схеме
    describe('validate', function() {
        BEM.MODEL.decl('valid-model', {
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

        var model = BEM.MODEL.create('valid-model', {
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


    describe('trigger', function() {
        BEM.MODEL.decl('model-for-trigger', { f1: 'number', f2: 'string' });

        it('should trigger event (model name)', function() {
            var onModelChange = jasmine.createSpy('onModelChange'),
                onFieldChange = jasmine.createSpy('onFieldChange'),
                disabledHandler = jasmine.createSpy('disabledHandler');

            BEM.MODEL
                .create('model-for-trigger', { f1: 1, f2: 'bla' })
                .on('change', onModelChange)
                .on('f1', 'change', onFieldChange)
                .on('change', disabledHandler)
                .un('change', disabledHandler);


            BEM.MODEL.trigger('model-for-trigger', 'f1', 'change');

            expect(onModelChange).not.toHaveBeenCalled(); // событие на поле не всплывёт после .trigger только после set

            expect(onFieldChange).toHaveBeenCalled();
            expect(disabledHandler).not.toHaveBeenCalled();

            BEM.MODEL.getOne('model-for-trigger').set('f1', 2);
            expect(onModelChange).toHaveBeenCalled(); // событие на поле всплывёт после set
        });


        it('should trigger event (model path object)', function() {
            var onModelChange = jasmine.createSpy('onModelChange'),
                onFieldChange = jasmine.createSpy('onFieldChange'),
                disabledHandler = jasmine.createSpy('disabledHandler'),
                modelParams = { name: 'model-for-trigger', id: 1 };

            BEM.MODEL
                .create(modelParams, { f1: 1, f2: 'bla' })
                .on('change', onModelChange)
                .on('f1', 'change', onFieldChange)
                .on('change', disabledHandler)
                .un('change', disabledHandler);


            BEM.MODEL.trigger(modelParams, 'f1', 'change');

            expect(onModelChange).not.toHaveBeenCalled(); // событие на поле не всплывёт после .trigger только после set

            expect(onFieldChange).toHaveBeenCalled();
            expect(disabledHandler).not.toHaveBeenCalled();

            BEM.MODEL.getOne(modelParams).set('f1', 2);
            expect(onModelChange).toHaveBeenCalled(); // событие на поле всплывёт после set
        });


    });

    describe('destruct', function() {
        BEM.MODEL.decl('model-for-destruct1', { f1: 'number', f2: 'string' });
        BEM.MODEL.decl('model-for-destruct2-parent', { f1: 'number', f2: 'string' });
        BEM.MODEL.decl('model-for-destruct2', { f1: 'number', f2: 'string' });
        BEM.MODEL.decl('model-for-destruct3', { f1: 'number', f2: 'string' });

        var modelForDestruct1 = BEM.MODEL.create('model-for-destruct1', { f1: 1, f2: 'bla' }),
            modelForDestruct2Params = {
                name: 'model-for-destruct2',
                parentName: 'model-for-destruct2-parent'
            },
            modelForDestruct2 = BEM.MODEL.create(modelForDestruct2Params, { f1: 1, f2: 'bla' }),
            modelForDestruct3 = BEM.MODEL.create('model-for-destruct3', { f1: 1, f2: 'bla' });

        it('destruct(BEM.MODEL)', function() {
            BEM.MODEL.destruct(modelForDestruct1);
            expect(BEM.MODEL.get(modelForDestruct1.name, 1).length).toEqual(0);
        });

        it('destruct(name)', function() {
            BEM.MODEL.destruct(modelForDestruct3.name);
            expect(BEM.MODEL.get(modelForDestruct3.name, 1).length).toEqual(0);
        });

        it('destruct(modelPath)', function() {
            BEM.MODEL.destruct(modelForDestruct2Params);
            expect(BEM.MODEL.get(modelForDestruct2.name, 1).length).toEqual(0);
        });

    });

    describe('buildPath', function() {

        describe('buildPath pathParts.name', function() {
            it('for model', function() {
                expect(BEM.MODEL.buildPath({ name: 'model' })).toEqual('model:*');
            });

            it('for models', function() {
                expect(BEM.MODEL.buildPath([{ name: 'model1' }, { name: 'model2' }])).toEqual('model1:*,model2:*');
            });
        });

        describe('buildPath pathParts.name [pathParts.id]', function() {
            it('for model', function() {
                expect(BEM.MODEL.buildPath({ name: 'model', id: 1 })).toEqual('model:1');

                expect(BEM.MODEL.buildPath({ name: 'model', id: '2' })).toEqual('model:2');
            });

            it('for models', function() {
                expect(BEM.MODEL.buildPath([{ name: 'model', id: 1 }, { name: 'model', id: '2' }]))
                    .toEqual('model:1,model:2');
            });
        });

        // parent
        describe('buildPath pathParts.name [pathParts.parentName]', function() {
            it('for model', function() {
                expect(BEM.MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    parentName: 'parent-model'
                })).toEqual('parent-model.model:1');
            });

            it('for models', function() {
                expect(BEM.MODEL.buildPath([
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
                expect(BEM.MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    parentName: 'parent-model',
                    parentId: 42
                })).toEqual('parent-model:42.model:1');
            });

            it('for models', function() {
                expect(BEM.MODEL.buildPath([
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
                expect(BEM.MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    parentPath: {
                        name: 'parent-model',
                        id: 1
                    }
                })).toEqual('parent-model:1.model:1');
            });

            it('for models', function() {
                expect(BEM.MODEL.buildPath([
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

        BEM.MODEL.decl('parent-model', {
            f1: 'string',
            f2: 'string',
            f3: 'string'
        });

        var parentModel1 = BEM.MODEL.create({ name: 'parent-model', id: 1 }, {
            f1: '11234',
            f2: '222'
        });

        describe('buildPath pathParts.name [pathParts.parentModel]', function() {
            it('for model', function() {
                expect(BEM.MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    parentModel: parentModel1
                })).toEqual('parent-model:1.model:1');
            });

            it('for models', function() {
                expect(BEM.MODEL.buildPath([
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
                expect(BEM.MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    childName: 'child-model'
                })).toEqual('model:1.child-model');
            });

            it('for models', function() {
                expect(BEM.MODEL.buildPath([
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
                expect(BEM.MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    childName: 'child-model',
                    childId: 42
                })).toEqual('model:1.child-model:42');
            });

            it('for models', function() {
                expect(BEM.MODEL.buildPath([
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
                expect(BEM.MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    childPath: {
                        name: 'child-model',
                        id: 1
                    }
                })).toEqual('model:1.child-model:1');
            });

            it('for models', function() {
                expect(BEM.MODEL.buildPath([
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

        BEM.MODEL.decl('child-model', {
            f1: 'string',
            f2: 'string',
            f3: 'string'
        });

        var childModel1 = BEM.MODEL.create({ name: 'child-model', id: 1 }, {
            f1: '11234',
            f2: '222'
        });

        describe('buildPath pathParts.name [pathParts.childModel]', function() {
            it('for model', function() {
                expect(BEM.MODEL.buildPath({
                    name: 'model',
                    id: 1,
                    childModel: childModel1
                })).toEqual('model:1.child-model:1');
            });

            it('for models', function() {
                expect(BEM.MODEL.buildPath([
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


        BEM.MODEL.decl('grand-parent-model', {
            f1: 'string',
            f2: 'string',
            f3: 'string'
        });

        BEM.MODEL.decl('child-child-model', {
            f1: 'string',
            f2: 'string',
            f3: 'string'
        });

        var grandParentModel = BEM.MODEL.create({ name: 'grand-parent-model', id: 'granny' }, {
                f1: '11'
            }),
            childChildModel = BEM.MODEL.create({ name: 'child-child-model', id: 'some' }, {
                f1: '11234',
                f2: '222'
            });

        describe('buildPath for long long pathParts', function() {
            it('for model', function() {
                expect(BEM.MODEL.buildPath({
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


});
