BEM.TEST.decl('i-model__field_type_model-list', function() {

    describe('Field with type "model-list"', function() {
        BEM.MODEL.decl('model-list-type-field', {
            list: {
                type: 'models-list',
                modelName: 'list-inner-model'
            }
        });
        BEM.MODEL.decl('list-inner-model', {
            id: 'id',
            f: 'string'
        });

        // для корректной работы тестов необходимо вызывать destruct у модели после каждого теста

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
            }, 100);

            model.destruct();
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(0);
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
                    list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }]
                });

            model.get('list').remove(2);
            expect(BEM.MODEL.get('list-inner-model').length).toEqual(1);
            expect(model.get('list').length()).toEqual(1);

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

    });

});
