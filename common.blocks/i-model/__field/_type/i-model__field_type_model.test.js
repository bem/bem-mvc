BEM.TEST.decl('i-model__field_type_model', function() {

    describe('Field with type "model"', function() {
        BEM.MODEL.decl('model-type-field', {
            f: {
                type: 'model',
                modelName: 'inner-model',
                destruct: true,
                validation: {
                    rules: {
                        deep: true,
                        required: true
                    }
                }
            }
        });
        BEM.MODEL.decl('inner-model', {
            innerF: {
                type: 'string',
                validation: {
                    rules: {
                        required: true,
                        maxlength: 10
                    }
                }
            }
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

            model.destruct();
            expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
            expect(BEM.MODEL.get('inner-model').length).toEqual(0);
        });

        it('submodel with id shoud not create twice', function() {
            BEM.MODEL.create({ name: 'inner-model', id: 'innerId', parentName: 'model-type-field', parentId: 'id' },
                { innerF: 'inner1' });

            var model = BEM.MODEL.create({ name: 'model-type-field', id: 'id' }, {
                    f: 'innerId'
                });

            expect(model.get('f').get('innerF')).toEqual('inner1');
            model.destruct();
        });

        it('should set model as value', function() {
            var model = BEM.MODEL.create('model-type-field', {
                    f: {
                        innerF: 'str'
                    }
                }),
                modelToSet = BEM.MODEL.create({ name: 'inner-model', parentModel: model }, { innerF: 'inner2' }),

                onFieldChange = jasmine.createSpy('onFieldChange'),
                onInnerFieldChange = jasmine.createSpy('onInnerFieldChange'),
                onModelChange = jasmine.createSpy('onModelChange');

            model.on('f', 'change', onFieldChange);
            model.on('change', onModelChange);

            model.set('f', modelToSet);

            expect(model.get('f').get('innerF')).toEqual('inner2');
            expect(onFieldChange).toHaveBeenCalled();
            expect(onModelChange).toHaveBeenCalled();

            model.on('f', 'change', onInnerFieldChange);
            modelToSet.set('innerF', 'bla');
            expect(onInnerFieldChange).toHaveBeenCalled();

            model.destruct();
            expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
            expect(BEM.MODEL.get('inner-model').length).toEqual(0);
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

            model.destruct();
            expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
            expect(BEM.MODEL.get('inner-model').length).toEqual(0);
        });

        it('isChanged() should return true if inner model was changed', function () {
            var model = BEM.MODEL.create('model-type-field', {
                    f: {
                        innerF: 'str'
                    }
                });

            expect(model.isChanged()).toEqual(false);

            model.get('f').set('innerF', 'new value');

            expect(model.isChanged()).toEqual(true);
            model.destruct();
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

            model.destruct();
            expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
            expect(BEM.MODEL.get('inner-model').length).toEqual(0);
        });

        it('should clear data', function() {
            var model = BEM.MODEL.create('model-type-field', {
                f: {
                    innerF: 'str'
                }
            });

            model.clear();

            expect(model.isEmpty()).toEqual(true);

            model.destruct();
            expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
            expect(BEM.MODEL.get('inner-model').length).toEqual(0);
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

            model.destruct();
            expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
            expect(BEM.MODEL.get('inner-model').length).toEqual(0);
        });

        it('should not destruct inner model', function() {
            var model = BEM.MODEL.create('model-type-field', {
                f: {
                    innerF: 'str'
                }
            }),
            innerModel = model.get('f'),
            modelToSet = BEM.MODEL.create({ name: 'inner-model', parentModel: model }, { innerF: 'inner2' });

            model.set('f', modelToSet, { destruct: false });
            expect(BEM.MODEL.getOne({ name: 'inner-model', id: innerModel.id })).toBeDefined();

            model.destruct();
            innerModel.destruct();
            expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
            expect(BEM.MODEL.get('inner-model').length).toEqual(0);
        });

        it('should check validation', function() {
            var model = BEM.MODEL.create('model-type-field');

            expect(model
                .set('f', { innerF: 'string' })
                .isValid())
                .toBe(true);

            expect(model
                .set('f', { innerF: 'loooooooooong string' })
                .isValid())
                .toBe(false);

            expect(model
                .clear('f')
                .isValid())
                .toBe(false);

            model.destruct();
            expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
            expect(BEM.MODEL.get('inner-model').length).toEqual(0);
        });

        it('should bubble events from inner model', function() {
            var model = BEM.MODEL.create('model-type-field', {
                    f: {
                        innerF: 'str'
                    }
                }),

                onCustom = jasmine.createSpy('onCustom'),
                onNewCustom = jasmine.createSpy('onNewCustom');

            model.on('f', 'custom-event', onCustom);
            model.get('f').trigger('custom-event');

            var newInner = BEM.MODEL.create('inner-model', { innerF: 'str1' });

            model.on('f', 'new-custom-event', onNewCustom);
            model.set('f', newInner);
            newInner.trigger('new-custom-event');

            var model2 = BEM.MODEL.create('model-type-field', {
                f: {
                    innerF: 'str'
                }
            });

            model2.get('f').trigger('custom-event');

            model.destruct();
            model2.destruct();

            expect(onCustom.calls.length).toEqual(1);
            expect(onNewCustom).toHaveBeenCalled();
        });

        describe('.isEqual method', function() {
            it('should call .isEqual method of self value and return its result', function() {
                var model = BEM.MODEL.create('model-type-field', { f: { innerF: 'str' } }),
                    innerField = model.get('f');

                spyOn(innerField, 'isEqual');

                model.fields.f.isEqual();
                expect(innerField.isEqual).toHaveBeenCalled();

                expect(model.fields.f.isEqual({ innerF: 'str' })).toEqual(innerField.isEqual('str'));
                expect(model.fields.f.isEqual({ innerF: 'str1' })).toEqual(innerField.isEqual('str1'));

                model.destruct();
            });
        });

        describe('.getFixedValue', function() {
            it('should be equal to fixed data of self model', function() {
                var model = BEM.MODEL.create('model-type-field', { f: { innerF: 'str' } }),
                    fieldModel = model.get('f');

                expect(model.fields.f.getFixedValue()).toEqual(fieldModel.getFixedValue());

                model.destruct();
            });
        });
    });
});
