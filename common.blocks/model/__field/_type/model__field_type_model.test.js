BEM.TEST.decl('i-model__field_type_model', function() {

    describe('Field with type "model"', function() {
        BEM.MODEL.decl('model-type-field', {
            f: {
                type: 'model',
                modelName: 'inner-model'
            }
        });
        BEM.MODEL.decl('inner-model', {
            innerF: 'string'
        });

        it('should change values', function() {
            var model = BEM.MODEL.create('model-type-field', {
                    f: {
                        innerF: 'str'
                    }
                }),

                onFieldChange = jasmine.createSpy('onFieldChange'),
                onModelChange = jasmine.createSpy('onModelChange');

            model.on('f', 'change', onFieldChange);
            model.on('change', onModelChange);

            model.set('f', { innerF: 'new str' });

            expect(model.get('f').get('innerF')).toEqual('new str');
            expect(onFieldChange).toHaveBeenCalled();
            expect(onModelChange).toHaveBeenCalled();
        });

        it('should change inner value', function() {
            var model = BEM.MODEL.create('model-type-field', {
                    f: {
                        innerF: 'str'
                    }
                }),

                onFieldChange = jasmine.createSpy('onFieldChange'),
                onModelChange = jasmine.createSpy('onModelChange');

            model.on('f', 'change', onFieldChange);
            model.on('change', onModelChange);

            model.get('f').set('innerF', 'new str');

            expect(model.get('f').get('innerF')).toEqual('new str');
            expect(onFieldChange).toHaveBeenCalled();
            expect(onModelChange).toHaveBeenCalled();
        });

        it('should serialize data', function() {
            var model = BEM.MODEL.create('model-type-field', {
                f: {
                    innerF: 'str'
                }
            });

            expect(model.toJSON()).toEqual({
                f: {
                    innerF: 'str'
                }
            });
        });

        it('should clear data', function() {
            var model = BEM.MODEL.create('model-type-field', {
                f: {
                    innerF: 'str'
                }
            });

            model.clear();

            expect(model.isEmpty()).toEqual(true);
        });

        it('should fix and rollback data', function() {
            var model = BEM.MODEL.create('model-type-field', {
                f: {
                    innerF: 'str'
                }
            });

            model.get('f').set('innerF', 'correct str');
            model.fix();

            model.get('f').set('innerF', 'wrong str');
            expect(model.get('f').get('innerF')).toEqual('wrong str');

            model.rollback();
            expect(model.get('f').get('innerF')).toEqual('correct str');
        });

    });

});
