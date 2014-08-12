/*
BEM.TEST.decl('i-glue-field_type_select', function() {
    if (!BEM.blocks['select']) return;

    BEM.MODEL.decl('glue-field-select-model', {
        num: 'number',
        str: 'string'
    });


    describe('glue field type select', function() {

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
            model = BEM.MODEL.create('glue-field-select-model', {
                num: 1,
                str: 's'
            });

            BEM.DOM.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'i-glue',
                    js: {
                        modelName: 'glue-field-select-model',
                        modelId: model.id
                    }
                }],
                js: true,
                content: [
                    {
                        block: 'select',
                        mix: [{
                            block: 'i-glue',
                            elem: 'model-field',
                            js: {
                                name: 'str',
                                type: 'select'
                            }
                        }],
                        name: 'title',
                        value: '',
                        mods: { size: 'm', theme: 'normal' },
                        content: [
                            {
                                block: 'button',
                                content: 'абаПбаАаВаЛаЕаНаНбаЕ'
                            },
                            {
                                elem: 'control',
                                content: [
                                    {
                                        elem: 'option',
                                        attrs: { value: 'a' },
                                        content: 'a'
                                    },
                                    {
                                        elem: 'option',
                                        attrs: { value: 'b' },
                                        content: 'b'
                                    },
                                    {
                                        elem: 'option',
                                        attrs: { value: 'c' },
                                        content: 'c'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }));

            var block = $('.b-glued-field').bem('b-glued-field'),
                select = block.findBlockInside('select');

            model.set('str', 'b');
            expect(select.val()).toEqual('b');

            select.val('c');
            expect(model.get('str')).toEqual('c');
        });


    });

});
*/
