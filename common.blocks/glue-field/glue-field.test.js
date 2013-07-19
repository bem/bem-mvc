/*
BEM.TEST.decl('i-glue-field', function() {
    BEM.MODEL.decl('glue-field-model', {
        num: 'number',
        str: 'string'
    });


    describe('glue field', function() {

        BEM.DOM.decl('b-glued-field', {
            onSetMod: {
                js: function() {

                }
            }
        });

        it('should glue field', function() {

            BEM.DOM.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'i-glue',
                    js: {
                        modelName: 'glue-field-model',
                        modelData: {
                            num: 123,
                            str: 'abc'
                        }
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
                                name: 'num'
                            }
                        }],
                        content: 'num'
                    }
                ]
            }));

            expect($('.b-glued-field').bem('b-glued-field').findBlockInside('i-glue').getFieldBlock('num').get()).toEqual(123);

            $('.b-glued-field').remove();
            BEM.MODEL.getOne('glue-field-model').destruct();
        });

        it('should glue field with mod', function() {

            BEM.DOM.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'i-glue',
                    js: {
                        modelName: 'glue-field-model',
                        modelData: {
                            num: 123,
                            str: 'abc'
                        }
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
                                name: 'num'
                            }
                        }],
                        content: 'num'
                    }
                ]
            }));

            expect($('.b-glued-field').bem('b-glued-field').findBlockInside('i-glue').getFieldBlock('num').get()).toEqual(123);

            $('.b-glued-field').remove();
            BEM.MODEL.getOne('glue-field-model').destruct();
        });

        it('should unbuind from model when destructed', function() {
            var model = BEM.MODEL.create('glue-field-model', {
                num: 123,
                str: 'abc'
            });

            BEM.DOM.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'i-glue',
                    js: {
                        modelName: 'glue-field-model',
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
                                name: 'num'
                            }
                        }],
                        content: 'num'
                    }
                ]
            }));

            var block = $('.b-glued-field').bem('b-glued-field');
            block.destruct();

            expect(function() {
                model.set('num', 1);
            }).not.toThrow();
        });

    });

    describe('glue field baseBlock', function() {

        BEM.DOM.decl({ block: 'b-base-glued-field', baseBlock: 'i-glue' }, {
            onSetMod: {
                js: function() {
                    this.__base();
                }
            }
        });

        BEM.DOM.append('body', BEMHTML.apply({
            block: 'b-base-glued-field',
            js: {
                modelName: 'glue-field-model',
                modelData: {
                    num: 123,
                    str: 'abc'
                }
            },
            content: [
                {
                    elem: 'bla',
                    mix: [{
                        block: 'b-base-glued-field',
                        elem: 'model-field',
                        js: {
                            name: 'str'
                        }
                    }],
                    content: 'str'
                }
            ]
        }));

        expect($('.b-base-glued-field').bem('b-base-glued-field').getFieldBlock('str').get()).toEqual('abc');

        $('.b-base-glued-field').remove();
        BEM.MODEL.getOne('glue-field-model').destruct();
    });


});
*/
