BEM.TEST.decl('i-model__field_type_model-list', function() {

    describe('Field with type "model-list"', function() {
        BEM.MODEL.decl('model-list-type-field', {
            list: {
                type: 'models-list',
                modelName: 'list-inner-model',
                validation: {
                    rules: {
                        'deep': true
                    }
                }
            }
        });
        BEM.MODEL.decl('list-inner-model', {
            id: 'id',
            f: {
                type: 'string',
                validation: {
                    rules: {
                        required: true
                    }
                }
            },
            n: 'number'
        });

        // для корректной работы тестов необходимо вызывать destruct у модели после каждого теста

        it('should create model and set data', function() {
            var model = BEM.MODEL.create('model-list-type-field');

            expect(model.toJSON()).toEqual({ list: [] });

            model.get('list').add({ id: 1, f: 'f', n: 3 });
            expect(model.toJSON()).toEqual({ list: [{ id: 1, f: 'f', n: 3 }] });

            model.set('list', [{ id: 111, f: 'fff', n: 333 }]);
            expect(model.toJSON()).toEqual({ list: [{ id: 111, f: 'fff', n: 333 }] });

            model.destruct();
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(0);
        });

        it('model should be validated with rule deep', function() {
            var model = BEM.MODEL.create('model-list-type-field', {
                list: [
                    { id: 'id', n: 4 }
                ]
            });

            expect(model.isValid()).not.toBe(true);

            model.get('list').getByIndex(0).set('f', 'not empty');

            expect(model.isValid()).toBe(true);

            model.destruct();
        });


        it('inner model with id should not create twice', function() {
            BEM.MODEL.create(
                {
                    name: 'list-inner-model',
                    id: 'innerId',
                    parentName: 'model-list-type-field',
                    parentId: 'id'
                },
                {
                    id: 'innerId',
                    f: 'innerString'
                });
            var model = BEM.MODEL.create({ name: 'model-list-type-field', id: 'id' }, {
                list: ['innerId']
            });

            expect(model.get('list').getByIndex(0).get('f')).toEqual('innerString');

            model.destruct();
        });

        it('should create models at index', function () {
            var model = BEM.MODEL.create('model-list-type-field', {
                list: [{ id: 1, f: 'f', n: 3 }]
            });

            model.get('list').addByIndex(0, { id: 11, f: 'ff', n: 33 });

            expect(model.toJSON()).toEqual({
                list: [
                    { id: 11, f: 'ff', n: 33 },
                    { id: 1, f: 'f', n: 3 }
                ]
            });

            model.destruct();
        });

        it('should create inner models', function() {
            var model = BEM.MODEL.create('model-list-type-field', {
                    list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }]
                }),

                onFieldChange = jasmine.createSpy('onFieldChange'),
                onModelChange = jasmine.createSpy('onModelListChange');

            model.on('list', 'change', onFieldChange);
            model.on('change', onModelChange);

            model.set('list', [{ id: 10, f: 'f10' }, { id: 20, f: 'f20' }]);

            expect(BEM.MODEL.get('list-inner-model').length).toEqual(2);
            expect(onFieldChange).toHaveBeenCalled();
            setTimeout(function() { // событие на модели триггериться позже
                expect(onModelChange).toHaveBeenCalled();
            }, 1000);

            model.destruct();
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(0);
        });

        it('should fire change event with correct opts', function () {
            var model,
                onModelInListChanged,
                data;

            runs(function() {
                model = BEM.MODEL.create('model-list-type-field', {
                    list: [{ id: 1, f: 'f1' }]
                });

                model.on('list', 'change', function(e, d) {
                    data = d;
                });
                model.get('list').getByIndex(0).set('f', 123, {option: 'value'});
            });

            waitsFor(function() {
                return data;
            });

            runs(function() {
                expect(data.option).toEqual('value');
                expect(data.innerField).toEqual('f');
                model.destruct();
            });
        });

        it('should fix and rollback data', function() {
            var model = BEM.MODEL.create('model-list-type-field', {
                list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }]
            });

            model.fix();

            model.clear('list');
            model.rollback();
            expect(model.toJSON()).toEqual({ list: [{ id:1, f: "f1" },{ id: 2, f: 'f2' }] });

            model.get('list').getByIndex(0).set('f', 123);
            model.rollback();
            expect(model.toJSON()).toEqual({ list: [{ id:1, f: "f1" },{ id: 2, f: 'f2' }] });

            model.destruct();
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(0);
        });

        it('isChanged() should return true if one of inner models was changed', function () {
            var model = BEM.MODEL.create('model-list-type-field', {
                list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }]
            });

            expect(model.isChanged()).toEqual(false);
            model.get('list').getByIndex(0).set('f', 'new-value');
            expect(model.isChanged()).toEqual(true);

            model.destruct();
        });

        it('should add models', function() {
            var model = BEM.MODEL.create('model-list-type-field', {
                    list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }]
                }),

                onAddModel = jasmine.createSpy('onAddModel');

            model.on('list', 'change', onAddModel);

            model.get('list').add({ id: 3, f: 'f3' });
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(3);
            expect(model.get('list').length()).toEqual(3);

            model.destruct();
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(0);
        });

        it('should remove by id models', function() {
            var model = BEM.MODEL.create('model-list-type-field', {
                    list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }, { id: 3, f: 'f3' }]
                });

            model.get('list').remove(2);
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(2);
            expect(model.get('list').length()).toEqual(2);

            model.get('list').remove(1);
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(1);
            expect(model.get('list').length()).toEqual(1);

            model.get('list').remove(3);
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(0);
            expect(model.get('list').length()).toEqual(0);

            model.destruct();
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(0);
        });

        it('should clear list', function() {
            var model = BEM.MODEL.create('model-list-type-field', {
                    list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }]
                });

            model.get('list').clear();
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(0);

            model.get('list').add({ f: 'f1' });
            model.clear('list');
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(0);

            model.destruct();
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(0);
        });

        it('should find by id', function() {
            var model = BEM.MODEL.create('model-list-type-field', {
                    list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }]
                });

            expect(model.get('list').getById(1)).toBe(BEM.MODEL.get({ name: 'list-inner-model', id: 1 })[0]);

            model.destruct();
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(0);
        });

        it('should iterate elements', function() {
            var model = BEM.MODEL.create('model-list-type-field', {
                    list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }]
                }),

                onForEach = jasmine.createSpy('forEach'),
                onMap = jasmine.createSpy('map');

            model.get('list').forEach(onForEach);
            model.get('list').map(onMap);

            expect(onForEach).toHaveBeenCalled();
            expect(onMap).toHaveBeenCalled();

            model.destruct();
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(0);
        });

        it('should search for elements by attributes', function() {
            var model = BEM.MODEL.create('model-list-type-field', {
                list: [
                    { id: 1, f: 'f1', n: 42 },
                    { id: 2, f: 'f2', n: 16 },
                    { id: 3, f: 'f4', n: 42 },
                    { id: 4, f: 'f2', n: 42 },
                    { id: 5, f: 'f4'        },
                    { id: 6, f: 'f4', n: 42 }
                ]
            });

            expect(model.get('list').where({ n: 42 }).length).toEqual(4);
            expect(model.get('list').where({ f: 'f4' }).length).toEqual(3);
            expect(model.get('list').where({ f: 'f2', n: 16 }).length).toEqual(1);
            expect(model.get('list').where({ f: 'f4', n: 42 }).length).toEqual(2);
            expect(model.get('list').where({ f: 'f1' }).length).toEqual(1);
            expect(model.get('list').where({ f: '42' }).length).toEqual(0);
            expect(model.get('list').where({}).length).toEqual(0);
            expect(model.get('list').where().length).toEqual(0);

            model.destruct();
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(0);
        });

        it('shouldn\'t destruct models with "keepModel" flag.', function () {
            var model = BEM.MODEL.create('list-inner-model', { id: 15, f: 'f3', n: 51 }),
                modelsList = BEM.MODEL.create('model-list-type-field'),
                destructHandler = jasmine.createSpy('destruct');

            model.on('destruct', destructHandler);

            modelsList.get('list').add(model);
            modelsList.clear({ keepModel: true });

            expect(destructHandler.calls.length).toBe(0);
        });

        it('should bubble events from inner models', function() {
            var model = BEM.MODEL.create('model-list-type-field', {
                    list: [
                        { id: 1, f: 'f1' },
                        { id: 2, f: 'f2' }
                    ]
                }),

                onCustom = jasmine.createSpy('onCustom'),
                onNewCustom = jasmine.createSpy('onNewCustom'),
                onCustomDeactive = jasmine.createSpy('onCustomDeactive');

            model.on('list', 'custom-event', onCustom);
            model.get('list').getByIndex(0).trigger('custom-event');

            model.on('list', 'new-custom-event', onNewCustom);
            model.get('list').add({ id: 3, f: 'f3' }).trigger('new-custom-event');

            model.on('list', 'deact-custom-event', onCustomDeactive);
            model.un('list', 'deact-custom-event', onCustomDeactive);
            model.get('list').getByIndex(0).trigger('deact-custom-event');
            model.get('list').add({ id: 4, f: 'f4' }).trigger('deact-custom-event');

            expect(onCustom.calls.length).toEqual(1);
            expect(onNewCustom.calls.length).toEqual(1);
            expect(onCustomDeactive).not.toHaveBeenCalled();

            model.destruct();
        });

    });

});
