BEM.TEST.decl('i-model__field', function() {

    // COMMON FIELD
    describe('Field with no type', function() {
        BEM.MODEL.decl('no-type-field', {
            f: {
                validation: {
                    rules: {
                        required: true
                    }
                }
            },
            f1: {
                default: { val: 'str1' }
            },
            f2: {
                value: { val: 'str2' }
            },
            f3: {
                value: { val: 'str3' },
                format: function(value) {
                    return value && { val: ('' + value.val).charAt(0) };
                }
            },
            f4: {
                preprocess: function(value) {
                    return value && { val: value.val + '4' };
                }
            },
            f5: {
                calculate: function(value) {
                    return value && { val: value.val + '5' }
                },
                dependsFrom: 'f'
            }
        });

        it('should have fields', function() {
            var model = BEM.MODEL.create('no-type-field');

            expect(model.hasField('f')).toBe(true);
            expect(model.hasField('f1')).toBe(true);
            expect(model.hasField('f2')).toBe(true);
            expect(model.hasField('f3')).toBe(true);
            expect(model.hasField('f4')).toBe(true);
            expect(model.hasField('f5')).toBe(true);
        });

        it('should have default value', function() {
            expect(BEM.MODEL.create('no-type-field').get('f1')).toEqual({ val: 'str1' });
        });

        it('should have init value from decl', function() {
            expect(BEM.MODEL.create('no-type-field').get('f2')).toEqual({ val: 'str2' });
        });

        it('should have init value from create', function() {
            expect(
                BEM.MODEL
                    .create('no-type-field', { f: { val: 3.14 } })
                    .get('f'))
                .toEqual({ val: 3.14 });
        });

        it('should have format value', function() {
            expect(
                BEM.MODEL
                    .create('no-type-field', { f3: { val: 'AAA' } })
                    .get('f3', 'format'))
                .toEqual({ val: 'A' });
        });

        it('should set value', function() {
            expect(
                BEM.MODEL
                    .create('no-type-field')
                    .set('f', { val: 3.14 })
                    .get('f'))
                .toEqual({ val: 3.14 });
        });

        it('should clear value', function() {
            expect(
                BEM.MODEL
                    .create('no-type-field')
                    .set('f', { val: 1 })
                    .clear('f')
                    .get('f'))
                .toBe(undefined);
        });

        it('should be empty', function() {
            var model = BEM.MODEL
                .create('no-type-field')
                .update({
                    f: { val: 1 },
                    f3: { val: 3 }
                })
                .clear('f');

            expect(model.isEmpty('f')).toBe(true);

            model.clear();
            expect(model.isEmpty()).toBe(true);
        });

        it('should show changes', function() {
            var model = BEM.MODEL
                .create('no-type-field', {
                    f: { val: 1 },
                    f4: { val: 3 }
                })
                .fix()
                .update({
                    f: { val: 11 },
                    f4: { val: 33 }
                });

            expect(model.isChanged('f')).toBe(true);
            expect(model.isChanged()).toBe(true);
        });

        it('should update models', function() {
            var model = BEM.MODEL
                .create('no-type-field')
                .update({
                    f: { val: 'qwe' },
                    f1: { val: 'qwe1' },
                    f2: { val: 'qwe2' },
                    f3: { val: 'qwe3' },
                    f4: { val: 'qwe' }
                });

            expect(model.get('f')).toEqual({ val: 'qwe' });

            expect(model.toJSON()).toEqual({
                f: { val: 'qwe' },
                f1: { val: 'qwe1' },
                f2: { val: 'qwe2' },
                f3: { val: 'qwe3' },
                f4: { val: 'qwe4' },
                f5: { val: 'qwe5' }
            });
        });

        it('should fix and rollback values', function() {
            expect(
                BEM.MODEL
                    .create('no-type-field')
                    .set('f', { val: 0 })
                    .fix()
                    .set('f', { val: 1 })
                    .rollback()
                    .get('f'))
                .toEqual({ val: 0 });
        });

        it('should return data', function() {
            expect(
                BEM.MODEL
                    .create('no-type-field', {
                        f: { val: 'up' },
                        f1: { val: 'up1' },
                        f2: { val: 'up2' },
                        f3: { val: 'up3' },
                        f4: { val: 'up' }
                    })
                    .toJSON())
                .toEqual({
                    f: { val: 'up' },
                    f1: { val: 'up1' },
                    f2: { val: 'up2' },
                    f3: { val: 'up3' },
                    f4: { val: 'up4' },
                    f5: { val: 'up5' }
                });
        });

        it('should check validation', function() {
            var model = BEM.MODEL.create('no-type-field');

            expect(model
                    .set('f', 1.28)
                    .isValid())
                .toBe(true);

            expect(model
                    .clear()
                    .isValid())
                .toBe(false);
        });

        it('should fire changes', function() {
            var onChange = jasmine.createSpy('onModelChange'),
                onFieldChange = jasmine.createSpy('onFieldChange'),
                disabledHandler = jasmine.createSpy('disabledHandler');

            BEM.MODEL
                .create('no-type-field')
                .on('change', onChange)
                .on('change', disabledHandler)
                .on('f', 'change', onFieldChange)
                .un('change', disabledHandler)
                .set('f', { val: 666 });

            expect(onChange).toHaveBeenCalled();
            expect(onFieldChange).toHaveBeenCalled();
            expect(disabledHandler).not.toHaveBeenCalled();
        });

        it('should destruct', function() {
            BEM.MODEL
                .create({ name: 'no-type-field', id: 'uniqModelId' })
                .destruct();

            expect(BEM.MODEL.get({ name: 'no-type-field', id: 'uniqModelId' }).length).toEqual(0);
        });

    });

});
