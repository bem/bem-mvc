/*
BEM.TEST.decl('i-glue-field_type_inline', function() {
    BEM.MODEL.decl('glue-field-inline-model', {
        num: 'number',
        str: 'string'
    });

    describe('glue field type inline', function() {

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
            model = BEM.MODEL.create('glue-field-inline-model', {
                num: 1,
                str: 'a'
            })

            BEM.DOM.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'i-glue',
                    js: {
                        modelName: 'glue-field-inline-model',
                        modelId: model.id
                    }
                }],
                js: true,
                content: [
                    {
                        elem: 'bla',
                        mix: [{
                            block: 'i-glue',
                            elem: 'model-field',
                            js: {
                                name: 'num',
                                type: 'inline'
                            }
                        }],
                        content: 'num'
                    }
                ]
            }));

            model.set('num', 42);
            expect($('.b-glued-field').bem('b-glued-field').elem('bla').text()).toEqual('42.00');
        });


    });

});
*/
