/*
BEM.TEST.decl('i-glue-field_type_checkbox', function() {
    if (!BEM.blocks['checkbox']) return;

    BEM.MODEL.decl('glue-field-checkbox-model', {
        num: 'number',
        str: 'string',
        bool: 'boolean'
    });


    describe('glue field type checkbox', function() {

        BEM.DOM.decl('b-glued-field', {
            onSetMod: {
                js: function() {
                }
            }
        });

        var model;
        afterEach(function() {
            $('.b-glued-field').remove();
            model.destruct();
        });

        it('should glue field', function() {
            model = BEM.MODEL.create('glue-field-checkbox-model', {
                num: 1,
                str: 's',
                bool: false
            });

            BEM.DOM.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'i-glue',
                    js: {
                        modelName: 'glue-field-checkbox-model',
                        modelId: model.id
                    }
                }],
                js: true,
                content: [
                    {
                        block: 'checkbox',
                        mix: [{
                            block: 'i-glue',
                            elem: 'model-field',
                            js: {
                                name: 'bool',
                                type: 'checkbox'
                            }
                        }],
                        name: 'title',
                        mods: { size: 's' },
                        content: { elem: 'label', content: 'checkbox' }
                    }
                ]
            }));

            var block = $('.b-glued-field').bem('b-glued-field'),
                checkbox = block.findBlockInside('checkbox');

            expect(checkbox.isChecked()).toEqual(false);

            model.set('bool', true);
            expect(checkbox.isChecked()).toEqual(true);

            setTimeout(function() {
                checkbox.delMod('checked');
                expect(model.get('bool')).toEqual(false);
            }, 100);
        });


    });

});
*/
