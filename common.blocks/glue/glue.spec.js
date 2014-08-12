/*
BEM.TEST.decl('i-glue', function() {
    BEM.MODEL.decl('glue-model', {
        num: 'number',
        str: 'string'
    });

    BEM.DOM.decl('b-glued', {
        onSetMod: {
            js: function() {


            }
        }
    });

    describe('glue', function() {

        it('should create model', function() {
            BEM.DOM.append('body', BEMHTML.apply({
                block: 'b-glued',
                mix: [{
                    block: 'i-glue',
                    js: {
                        modelName: 'glue-model',
                        modelData: {
                            num: 1,
                            str: 'a'
                        }
                    }
                }],
                js: true,
                content: 'bla'
            }));

            expect($('.b-glued').bem('b-glued').findBlockOn('i-glue').model).toBe(BEM.MODEL.getOne('glue-model'));

            $('.b-glued').remove();
            BEM.MODEL.getOne('glue-model').destruct();
        });

        it('should create model 2', function() {

            BEM.DOM.append('body', BEMHTML.apply({
                block: 'b-glued',
                mix: [{
                    block: 'i-glue',
                    js: {
                        modelParams: {
                            name: 'glue-model',
                            data: {
                                num: 1,
                                str: 'a'
                            }
                        }
                    }
                }],
                js: true,
                content: 'bla'
            }));

            expect($('.b-glued').bem('b-glued').findBlockOn('i-glue').model).toBe(BEM.MODEL.getOne('glue-model'));

            $('.b-glued').remove();
            BEM.MODEL.getOne('glue-model').destruct();
        });

        it('should get model', function() {
            var model = BEM.MODEL.create({ name: 'glue-model', id: 666 }, {
                num: 1,
                str: 'a'
            });

            BEM.DOM.append('body', BEMHTML.apply({
                block: 'b-glued',
                mix: [{
                    block: 'i-glue',
                    js: {
                        modelName: 'glue-model',
                        modelId: 666
                    }
                }],
                js: true,
                content: 'bla'
            }));

            expect($('.b-glued').bem('b-glued').findBlockOn('i-glue').model).toBe(model);

            $('.b-glued').remove();
            model.destruct();
        });

    });

    describe('glue baseBlock', function() {
        BEM.DOM.decl({ block: 'b-base-glued', baseBlock: 'i-glue' }, {
            onSetMod: {
                js: function() {
                    this.__base();
                }
            }
        });

        BEM.DOM.append('body', BEMHTML.apply({
            block: 'b-base-glued',
            js: {
                modelName: 'glue-model',
                modelData: {
                    num: 1,
                    str: 'a'
                }
            },
            content: 'bla'
        }));

        expect($('.b-base-glued').bem('b-base-glued').model).toBe(BEM.MODEL.getOne('glue-model'));

        $('.b-base-glued').remove();
        BEM.MODEL.getOne('glue-model').destruct();
    });

    describe('glue with i-model', function() {
        BEM.MODEL.decl('glue-without-model', {
            f1: 'number',
            f2: 'number'
        });

        BEM.DOM.append('body', BEMHTML.apply({
            block: 'i-model-aggregator',
            content: [
                {
                    block: 'b-glued-block',
                    mix: [{
                        block: 'i-glue',
                        js: {
                            modelName: 'glue-without-model'
                        }
                    }],
                    content: [

                    ]
                },
                {
                    block: 'i-model',
                    modelParams: {
                        name: 'glue-without-model',
                        data: {
                            f1: 1,
                            f2: 2
                        }
                    }
                }
            ]
        }));

        expect($('.i-glue').bem('i-glue').model.toJSON()).toEqual({
            f1: 1,
            f2: 2
        });

        $('.b-glued-block').remove();
        $('.i-model').remove();
    });

});
*/
