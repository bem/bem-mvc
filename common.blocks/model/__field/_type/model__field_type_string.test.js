/*BEM.TEST.decl('i-model__field_type_string', function() {

    describe('Field with type "string"', function() {
        BEM.MODEL.decl('string-type-field', {
            f: {
                type: 'string',
                validation: {
                    rules: {
                        required: true,
                        maxlength: 10
                    }
                }
            },
            f1: {
                type: 'string',
                default: 'str1'
            },
            f2: {
                type: 'string',
                value: 'str2'
            },
            f3: {
                type: 'string',
                value: 'str3',
                format: function(value) {
                    return ('' + value).charAt(0)
                }
            },
            f4: {
                type: 'string',
                preprocess: function(value) {
                    return value && value + '4'
                }
            },
            f5: {
                type: 'string',
                calculate: function(value) {
                    return value && value + '5'
                },
                dependsFrom: 'f'
            }
        });

        it('should have fields', function() {
            var model = BEM.MODEL.create('string-type-field');

            expect(model.hasField('f')).toBe(true);
            expect(model.hasField('f1')).toBe(true);
            expect(model.hasField('f2')).toBe(true);
            expect(model.hasField('f3')).toBe(true);
            expect(model.hasField('f4')).toBe(true);
            expect(model.hasField('f5')).toBe(true);
        });

        it('should have default value', function() {
            expect(BEM.MODEL.create('string-type-field').get('f1')).toEqual('str1');
        });

        it('should have init value from decl', function() {
            expect(BEM.MODEL.create('string-type-field').get('f2')).toEqual('str2');
        });

        it('should have init value from create', function() {
            expect(
                BEM.MODEL
                    .create('string-type-field', { f: 3.14 })
                    .get('f'))
                .toEqual(3.14);
        });

        it('should have format value', function() {
            expect(
                BEM.MODEL
                    .create('string-type-field', { f3: 'AAA'})
                    .get('f3', 'format'))
                .toEqual('A');
        });

        it('should set value', function() {
            expect(
                BEM.MODEL
                    .create('string-type-field')
                    .set('f', 3.14)
                    .get('f'))
                .toEqual(3.14);
        });

        it('should clear value', function() {
            expect(
                BEM.MODEL
                    .create('string-type-field')
                    .set('f', 1)
                    .clear('f')
                    .get('f'))
                .toBe('');
        });

        it('should be empty', function() {
            var model = BEM.MODEL
                .create('string-type-field')
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
                .create('string-type-field', {
                    f: 1,
                    f4: 3
                })
                .fix()
                .update({
                    f: '11',
                    f4: '33'
                });

            expect(model.isChanged('f')).toBe(true);
            expect(model.isChanged()).toBe(true);
        });

        it('should update models', function() {
            var model = BEM.MODEL
                .create('string-type-field')
                .update({
                    f: 'qwe',
                    f1: 'qwe1',
                    f2: 'qwe2',
                    f3: 'qwe3',
                    f4: 'qwe'
                });

            expect(model.get('f')).toEqual('qwe');

            expect(model.toJSON()).toEqual({
                f: 'qwe',
                f1: 'qwe1',
                f2: 'qwe2',
                f3: 'qwe3',
                f4: 'qwe4',
                f5: 'qwe5'
            });
        });

        it('should fix and rollback values', function() {
            expect(
                BEM.MODEL
                    .create('string-type-field')
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
                    .create('string-type-field', {
                        f: 'up',
                        f1: 'up1',
                        f2: 'up2',
                        f3: 'up3',
                        f4: 'up'
                    })
                    .toJSON())
                .toEqual({
                    f: 'up',
                    f1: 'up1',
                    f2: 'up2',
                    f3: 'up3',
                    f4: 'up4',
                    f5: 'up5'
                });
        });

        it('should check validation', function() {
            var model = BEM.MODEL.create('string-type-field');

            expect(model
                .set('f', 'string')
                .isValid())
                .toBe(true);

            expect(model
                .set('f', 'loooooooooong string')
                .isValid())
                .toBe(false);
        });

        it('should fire changes', function() {
            var onChange = jasmine.createSpy('onModelChange'),
                onFieldChange = jasmine.createSpy('onFieldChange'),
                disabledHandler = jasmine.createSpy('disabledHandler');

            BEM.MODEL
                .create('string-type-field')
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
                .create({ name: 'string-type-field', id: 'uniqModelId' })
                .destruct();

            expect(BEM.MODEL.get({ name: 'string-type-field', id: 'uniqModelId' }).length).toEqual(0);
        });

    });

});
*/
