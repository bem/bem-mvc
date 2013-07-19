/*
BEM.TEST.decl('i-glue-field_type_mod', function() {
    BEM.MODEL.decl('glue-field-mod-model', {
        num: 'number',
        str: 'string',
        bool: 'boolean'
    });


    describe('glue field type mod', function() {

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
            model = BEM.MODEL.create('glue-field-mod-model', {
                num: 1,
                str: 'a'
            });

            BEM.DOM.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'i-glue',
                    js: {
                        modelName: 'glue-field-mod-model',
                        modelId: model.id
                    }
                }],
                js: true,
                content: [
                    {
                        elem: 'bla-str',
                        mix: [{
                            block: 'i-glue',
                            elem: 'model-field',
                            js: {
                                name: 'str',
                                type: 'mod',
                                modName: 'test',
                                block: 'b-glued-field',
                                elem: 'bla-str'
                            }
                        }],
                        content: 'str'
                    },
                    {
                        elem: 'bla-bool',
                        mix: [{
                            block: 'i-glue',
                            elem: 'model-field',
                            js: {
                                name: 'bool',
                                type: 'mod',
                                modName: 'test',
                                block: 'b-glued-field',
                                elem: 'bla-bool'
                            }
                        }],
                        content: 'bool'
                    }
                ]
            }));

            var block = $('.b-glued-field').bem('b-glued-field');

            model.set('str', 'bla-bla');
            expect(block.getMod(block.elem('bla-str'), 'test')).toEqual('bla-bla');

            model.set('bool', true);
            expect(block.getMod(block.elem('bla-bool'), 'test')).toEqual('yes');
        });


    });

});
*/
