/*BEM.TEST.decl('i-model__field_type_number', function() {

    describe('Field with type "number"', function() {
        BEM.MODEL.decl('number-type-field', {
            f: {
                type: 'number',
                validation: {
                    rules: {
                        required: true,
                        max: 10
                    }
                }
            },
            f1: {
                type: 'number',
                default: 1
            },
            f2: {
                type: 'number',
                value: 2
            },
            f3: {
                type: 'number',
                value: 3,
                format: function(value) {
                    return ('' + value).charAt(0)
                }
            },
            f4: {
                type: 'number',
                preprocess: function(value) {
                    return !value ? value : value + 4
                }
            },
            f5: {
                type: 'number',
                calculate: function(value) {
                    return value === undefined ? value : value + 5
                },
                dependsFrom: 'f'
            }
        });

        it('should have fields', function() {
            var model = BEM.MODEL.create('number-type-field');

            expect(model.hasField('f')).toBe(true);
            expect(model.hasField('f1')).toBe(true);
            expect(model.hasField('f2')).toBe(true);
            expect(model.hasField('f3')).toBe(true);
            expect(model.hasField('f4')).toBe(true);
            expect(model.hasField('f5')).toBe(true);
        });

        it('should have default value', function() {
            expect(BEM.MODEL.create('number-type-field').get('f1')).toEqual(1);
        });

        it('should have init value from decl', function() {
            expect(BEM.MODEL.create('number-type-field').get('f2')).toEqual(2);
        });

        it('should have init value from create', function() {
            expect(
                BEM.MODEL
                    .create('number-type-field', { f: 3.14 })
                    .get('f'))
                .toEqual(3.14);
        });

        it('should have format value', function() {
            expect(
                BEM.MODEL
                    .create('number-type-field', { f3: 666 })
                    .get('f3', 'format'))
                .toEqual('6');
        });

        it('should set value', function() {
            expect(
                BEM.MODEL
                    .create('number-type-field')
                    .set('f', 3.14)
                    .get('f'))
                .toEqual(3.14);
        });

        it('should clear value', function() {
            expect(
                BEM.MODEL
                    .create('number-type-field')
                    .set('f', 1)
                    .clear('f')
                    .get('f'))
                .toBe(undefined);
        });

        it('should be empty', function() {
            var model = BEM.MODEL
                .create('number-type-field')
                .update({
                    f: 1,
                    f3: 3
                })
                .clear('f');

            expect(model.isEmpty('f')).toBe(true);

            model.clear();
            expect(model.isEmpty()).toBe(true);
        });

        it('should show changes', function() {
            var model = BEM.MODEL
                .create('number-type-field', {
                    f: 1,
                    f4: 3
                })
                .fix()
                .update({
                    f: 11,
                    f4: 33
                });

            expect(model.isChanged('f')).toBe(true);
            expect(model.isChanged()).toBe(true);
        });

        it('should update models', function() {
            var model = BEM.MODEL
                .create('number-type-field')
                .update({
                    f: 0,
                    f1: 1,
                    f2: 2,
                    f3: 3,
                    f4: 4
                });

            expect(model.get('f')).toEqual(0);

            expect(model.toJSON()).toEqual({
                f: 0,
                f1: 1,
                f2: 2,
                f3: 3,
                f4: 8,
                f5: 5
            });
        });

        it('should fix and rollback values', function() {
            expect(
                BEM.MODEL
                    .create('number-type-field')
                    .set('f', 0)
                    .fix()
                    .set('f', 1)
                    .rollback()
                    .get('f'))
                .toEqual(0);
        });

        it('should return data', function() {
            expect(
                BEM.MODEL
                    .create('number-type-field', {
                        f: 0,
                        f1: 1,
                        f2: 2,
                        f3: 3,
                        f4: 4
                    })
                    .toJSON())
                .toEqual({
                    f: 0,
                    f1: 1,
                    f2: 2,
                    f3: 3,
                    f4: 8,
                    f5: 5
                });
        });

        it('should check validation', function() {
            var model = BEM.MODEL.create('number-type-field');

            expect(model
                .set('f', 1.28)
                .isValid())
                .toBe(true);

            expect(model
                .set('f', 15)
                .isValid())
                .toBe(false);
        });

        it('should fire changes', function() {
            var onChange = jasmine.createSpy('onModelChange'),
                onFieldChange = jasmine.createSpy('onFieldChange'),
                disabledHandler = jasmine.createSpy('disabledHandler');

            BEM.MODEL
                .create('number-type-field')
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
                .create({ name: 'number-type-field', id: 'uniqModelId' })
                .destruct();

            expect(BEM.MODEL.get({ name: 'number-type-field', id: 'uniqModelId' }).length).toEqual(0);
        });

    });

});
*/
