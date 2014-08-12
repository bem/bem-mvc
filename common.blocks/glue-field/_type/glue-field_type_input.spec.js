/*
BEM.TEST.decl('i-glue-field_type_input', function() {
    if (!BEM.blocks['input']) return;

    BEM.MODEL.decl('glue-field-input-model', {
        num: 'number',
        str: 'string'
    });

    describe('glue field type input', function() {

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
            model = BEM.MODEL.create('glue-field-input-model', {
                num: 1,
                str: 's'
            });

            BEM.DOM.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'i-glue',
                    js: {
                        modelName: 'glue-field-input-model',
                        modelId: model.id
                    }
                }],
                js: true,
                content: [
                    {
                        block: 'input',
                        mix: [{
                            block: 'i-glue',
                            elem: 'model-field',
                            js: {
                                name: 'num',
                                type: 'input'
                            }
                        }],
                        name: 'title',
                        value: '',
                        mods: { size: 's' },
                        content: { elem: 'control' }
                    }
                ]
            }));

            var block = $('.b-glued-field').bem('b-glued-field'),
                input = block.findBlockInside('input');

            model.set('num', 42);
            expect(input.val()).toEqual(42);

            input.val('13');
            expect(model.get('num')).toEqual(13);
        });


    });

});
*/
