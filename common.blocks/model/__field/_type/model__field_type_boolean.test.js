/*BEM.TEST.decl('i-model__field_type_boolean', function() {

    describe('Field with type "boolean"', function() {
        BEM.MODEL.decl('boolean-type-field', {
            f: {
                type: 'boolean',
                validation: {
                    rules: {
                        required: true
                    }
                }
            },
            f1: {
                type: 'boolean',
                default: true
            },
            f2: {
                type: 'boolean',
                value: false
            },
            f3: {
                type: 'boolean',
                value: true,
                format: function(value) {
                    return 0 + value
                }
            },
            f4: {
                type: 'boolean',
                preprocess: function(value) {
                    return value && !value
                }
            },
            f5: {
                type: 'boolean',
                calculate: function(value) {
                    return value && !value
                },
                dependsFrom: 'f'
            }
        });

        it('should have fields', function() {
            var model = BEM.MODEL.create('boolean-type-field');

            expect(model.hasField('f')).toBe(true);
            expect(model.hasField('f1')).toBe(true);
            expect(model.hasField('f2')).toBe(true);
            expect(model.hasField('f3')).toBe(true);
            expect(model.hasField('f4')).toBe(true);
            expect(model.hasField('f5')).toBe(true);
        });

        it('should have default value', function() {
            expect(BEM.MODEL.create('boolean-type-field').get('f1')).toEqual(true);
        });

        it('should have init value from decl', function() {
            expect(BEM.MODEL.create('boolean-type-field').get('f2')).toEqual(false);
        });

        it('should have init value from create', function() {
            expect(
                BEM.MODEL
                    .create('boolean-type-field', { f: false })
                    .get('f'))
                .toEqual(false);
        });

        it('should have format value', function() {
            expect(
                BEM.MODEL
                    .create('boolean-type-field', { f3: false })
                    .get('f3', 'format'))
                .toEqual(0);
        });

        it('should set value', function() {
            expect(
                BEM.MODEL
                    .create('boolean-type-field')
                    .set('f', false)
                    .set('f', true)
                    .get('f'))
                .toEqual(true);
        });

        it('should clear value', function() {
            expect(
                BEM.MODEL
                    .create('boolean-type-field')
                    .set('f', false)
                    .clear('f')
                    .get('f'))
                .toBe(undefined);
        });

        it('should be empty', function() {
            var model = BEM.MODEL
                .create('boolean-type-field')
                .update({
                    f: true,
                    f3: false
                })
                .clear('f');

            expect(model.isEmpty('f')).toBe(true);

            model.clear();
            expect(model.isEmpty()).toBe(true);
        });

        it('should show changes', function() {
            var model = BEM.MODEL
                .create('boolean-type-field', {
                    f: true,
                    f4: false
                })
                .fix()
                .update({
                    f: false,
                    f4: true
                });

            expect(model.isChanged('f')).toBe(true);
            expect(model.isChanged()).toBe(true);
        });

        it('should update models', function() {
            var model = BEM.MODEL
                .create('boolean-type-field')
            model.update({
                f: true,
                f1: false,
                f2: false,
                f3: false,
                f4: true
            });

            expect(model.get('f')).toEqual(true);

            expect(model.toJSON()).toEqual({
                f: true,
                f1: false,
                f2: false,
                f3: false,
                f4: false,
                f5: false
            });
        });

        it('should fix and rollback values', function() {
            expect(
                BEM.MODEL
                    .create('boolean-type-field')
                    .set('f', 0)
                    .fix()
                    .set('f', true)
                    .rollback()
                    .get('f'))
                .toEqual(false);
        });

        it('should return data', function() {
            expect(
                BEM.MODEL
                    .create('boolean-type-field', {
                        f: true,
                        f1: false,
                        f2: false,
                        f3: false,
                        f4: true
                    })
                    .toJSON())
                .toEqual({
                    f: true,
                    f1: false,
                    f2: false,
                    f3: false,
                    f4: false,
                    f5: false
                });
        });

        it('should check validation', function() {
            var model = BEM.MODEL.create('boolean-type-field');

            expect(model
                .set('f', true)
                .isValid())
                .toBe(true);

            expect(model
                .clear('f')
                .isValid())
                .toBe(false);
        });

        it('should fire changes', function() {
            var onChange = jasmine.createSpy('onModelChange'),
                onFieldChange = jasmine.createSpy('onFieldChange'),
                disabledHandler = jasmine.createSpy('disabledHandler');

            BEM.MODEL
                .create('boolean-type-field')
                .on('change', onChange)
                .on('change', disabledHandler)
                .on('f', 'change', onFieldChange)
                .un('change', disabledHandler)
                .set('f', 666);

            expect(onChange).toHaveBeenCalled();
            expect(onFieldChange).toHaveBeenCalled();
            expect(disabledHandler).not.toHaveBeenCalled();
        });

        it('should destruct', function() {
            BEM.MODEL
                .create({ name: 'boolean-type-field', id: 'uniqModelId' })
                .destruct();

            expect(BEM.MODEL.get({ name: 'boolean-type-field', id: 'uniqModelId' }).length).toEqual(0);
        });

    });

});
*/
