/*BEM.TEST.decl('i-model__field_type_array', function() {

    describe('Field with type "array"', function() {
        BEM.MODEL.decl('array-type-field', {
            f: {
                type: 'array',
                validation: {
                    rules: {
                        required: true
                    }
                }
            },
            f1: {
                type: 'array',
                default: ['str1']
            },
            f2: {
                type: 'array',
                value: ['str2']
            },
            f3: {
                type: 'array',
                value: ['str3'],
                format: function(value) {
                    return ('' + value).charAt(0)
                }
            },
            f4: {
                type: 'array',
                preprocess: function(value) {
                    value.length && value.push('4');
                    return value;
                }
            },
            f5: {
                type: 'array',
                calculate: function(value) {
                    var val = [];

                    value.forEach(function(item) {
                        val.push(item);
                    });
                    val.length && val.push('5');

                    return val;
                },
                dependsFrom: 'f'
            }
        });

        it('should have fields', function() {
            var model = BEM.MODEL.create('array-type-field');

            expect(model.hasField('f')).toBe(true);
            expect(model.hasField('f1')).toBe(true);
            expect(model.hasField('f2')).toBe(true);
            expect(model.hasField('f3')).toBe(true);
            expect(model.hasField('f4')).toBe(true);
            expect(model.hasField('f5')).toBe(true);
        });

        it('should have default value', function() {
            expect(BEM.MODEL.create('array-type-field').get('f1')).toEqual(['str1']);
        });

        it('should have init value from decl', function() {
            expect(BEM.MODEL.create('array-type-field').get('f2')).toEqual(['str2']);
        });

        it('should have init value from create', function() {
            expect(
                BEM.MODEL
                    .create('array-type-field', { f: [3.14] })
                    .get('f'))
                .toEqual([3.14]);
        });

        it('should have format value', function() {
            expect(
                BEM.MODEL
                    .create('array-type-field', { f3: ['AAA']})
                    .get('f3', 'format'))
                .toEqual('A');
        });

        it('should set value', function() {
            expect(
                BEM.MODEL
                    .create('array-type-field')
                    .set('f', [3.14])
                    .get('f'))
                .toEqual([3.14]);
        });

        it('should not change default value', function() {
            var model = BEM.MODEL.create('array-type-field');

            model.set('f', []);
            model.get('f').push('str');
            model.set('f', []);

            expect(model.get('f')).toEqual([]);
        });

        it('should clear value', function() {
            expect(
                BEM.MODEL
                    .create('array-type-field')
                    .set('f', [1])
                    .clear('f')
                    .get('f', 'raw'))
                .toEqual([]);
        });

        it('should be empty', function() {
            var model = BEM.MODEL
                .create('array-type-field')
                .update({
                    f: [1],
                    f3: [3]
                })
                .clear('f');

            expect(model.isEmpty('f')).toBe(true);

            model.clear();
            expect(model.isEmpty()).toBe(true);
        });

        it('should show changes', function() {
            var model = BEM.MODEL
                .create('array-type-field', {
                    f: [1],
                    f4: [3]
                })
                .fix()
                .update({
                    f: ['11'],
                    f4: ['33']
                });

            expect(model.isChanged('f')).toBe(true);
            expect(model.isChanged()).toBe(true);
        });

        it('should update models', function() {
            var model = BEM.MODEL
                .create('array-type-field')
                .update({
                    f: ['qwe'],
                    f1: ['qwe1'],
                    f2: ['qwe2'],
                    f3: ['qwe3'],
                    f4: ['qwe4']
                });

            expect(model.get('f')).toEqual(['qwe']);

            expect(model.toJSON()).toEqual({
                f: ['qwe'],
                f1: ['qwe1'],
                f2: ['qwe2'],
                f3: ['qwe3'],
                f4: ['qwe4', '4'],
                f5: ['qwe', '5']
            });
        });

        it('should fix and rollback values', function() {
            expect(
                BEM.MODEL
                    .create('array-type-field')
                    .set('f', [0])
                    .fix()
                    .set('f', [1])
                    .rollback()
                    .get('f'))
                .toEqual([0]);
        });

        it('should return data', function() {
            expect(
                BEM.MODEL
                    .create('array-type-field', {
                        f: ['up'],
                        f1: ['up1'],
                        f2: ['up2'],
                        f3: ['up3'],
                        f4: ['up']
                    })
                    .toJSON())
                .toEqual({
                    f: ['up'],
                    f1: ['up1'],
                    f2: ['up2'],
                    f3: ['up3'],
                    f4: ['up', '4'],
                    f5: ['up', '5']
                });
        });

        it('should check validation', function() {
            var model = BEM.MODEL.create('array-type-field');

            expect(model
                .set('f', ['array'])
                .isValid())
                .toBe(true);

            expect(model
                .set('f', [])
                .isValid())
                .toBe(false);
        });

        it('should fire changes', function() {
            var onChange = jasmine.createSpy('onModelChange'),
                onFieldChange = jasmine.createSpy('onFieldChange'),
                disabledHandler = jasmine.createSpy('disabledHandler');

            BEM.MODEL
                .create('array-type-field')
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
                .create({ name: 'array-type-field', id: 'uniqModelId' })
                .destruct();

            expect(BEM.MODEL.get({ name: 'array-type-field', id: 'uniqModelId' }).length).toEqual(0);
        });

    });

    describe('Field with type "array" (array methods)', function() {
        BEM.MODEL.decl('array-type-field-special', {
            f: {
                type: 'array'
            }
        });

        it('should check isChanged', function() {
            var model = BEM.MODEL.create('array-type-field-special', { f: [1, 2, 3] });

            expect(model.isChanged('f')).toEqual(false);

            model.set('f', [1, 2, 3, 4]);
            expect(model.isChanged('f')).toEqual(true);
        });

        it('should unshift values', function() {
            var model = BEM.MODEL.create('array-type-field-special', { f: [1, 2, 3] }),

                onUnshiftChange = jasmine.createSpy('onUnshiftChange'),
                onUnshiftAdd = jasmine.createSpy('onUnshiftAdd');

            model.on('f', 'change', onUnshiftChange);
            model.on('f', 'add', onUnshiftAdd);

            model.get('f').unshift(0);

            expect(model.get('f')).toEqual([0, 1, 2, 3]);
            expect(onUnshiftChange).toHaveBeenCalled();
            expect(onUnshiftAdd).toHaveBeenCalled();
        });

        it('should pop values', function() {
            var model = BEM.MODEL.create('array-type-field-special', { f: [1, 2, 3] }),

                onPopChange = jasmine.createSpy('onPopChange'),
                onPopRemove = jasmine.createSpy('onPopAdd');

            model.on('f', 'change', onPopChange);
            model.on('f', 'remove', onPopRemove);

            model.get('f').pop();

            expect(model.get('f')).toEqual([1, 2]);
            expect(onPopChange).toHaveBeenCalled();
            expect(onPopRemove).toHaveBeenCalled();
        });

        it('should shift values', function() {
            var model = BEM.MODEL.create('array-type-field-special', { f: [1, 2, 3] }),

                onShiftChange = jasmine.createSpy('onShiftChange'),
                onShiftRemove = jasmine.createSpy('onShiftAdd');

            model.on('f', 'change', onShiftChange);
            model.on('f', 'remove', onShiftRemove);

            model.get('f').shift();

            expect(model.get('f')).toEqual([2, 3]);
            expect(onShiftChange).toHaveBeenCalled();
            expect(onShiftRemove).toHaveBeenCalled();
        });

        it('should splice values', function() {
            var model = BEM.MODEL.create('array-type-field-special', { f: [1, 2, 3] }),

                onSpliceChange = jasmine.createSpy('onSpliceChange'),
                onSpliceRemove = jasmine.createSpy('onSpliceAdd'),
                onSpliceAdd = jasmine.createSpy('onSpliceAdd');

            model.on('f', 'change', onSpliceChange);
            model.on('f', 'remove', onSpliceRemove);
            model.on('f', 'add', onSpliceAdd);

            model.get('f').splice(1, 2, 5, 6, 7);

            expect(model.get('f')).toEqual([1, 5, 6, 7]);
            expect(onSpliceChange).toHaveBeenCalled();
            expect(onSpliceRemove).toHaveBeenCalled();
            expect(onSpliceAdd).toHaveBeenCalled();
        });

        it('should sort values', function() {
            var model = BEM.MODEL.create('array-type-field-special', { f: [2, 1, 3] }),

                onSortChange = jasmine.createSpy('onSortChange');

            model.on('f', 'change', onSortChange);

            model.get('f').sort();

            expect(model.get('f')).toEqual([1, 2, 3]);
            expect(onSortChange).toHaveBeenCalled();
        });

        it('should reverse values', function() {
            var model = BEM.MODEL.create('array-type-field-special', { f: [1, 2, 3] }),

                onReverseChange = jasmine.createSpy('onReverseChange');

            model.on('f', 'change', onReverseChange);

            model.get('f').reverse();

            expect(model.get('f')).toEqual([3, 2, 1]);
            expect(onReverseChange).toHaveBeenCalled();
        });

        it('should iterate values', function() {
            var model = BEM.MODEL.create('array-type-field-special', { f: [1, 2, 3] }),

                onForEach = jasmine.createSpy('forEach'),
                onMap = jasmine.createSpy('map');

            model.get('f').forEach(onForEach);
            model.get('f').map(onMap);

            expect(onForEach).toHaveBeenCalled();
            expect(onMap).toHaveBeenCalled();
        });

        it('should be equal', function() {
            var model = BEM.MODEL.create('array-type-field-special', { f: [1, 2, 3] }),
                field = model.get('f');

            field[0] = '';
            model.set('f', field);	
        
            expect(model.get('f')).toEqual(model.get('f', 'format'));
        });

    });

});
*/
