BEM.TEST.decl('i-model-aggregator', function() {

    describe('model aggregation', function() {

        it('should aggregate i-model', function() {
            BEM.MODEL.decl('inner-aggregate-model', {
                a: 'number',
                b: 'number'
            });

            BEM.DOM.append('body', BEMHTML.apply({
                block: 'i-model-aggregator',
                content: [
                    {
                        block: 'i-model',
                        modelName: 'bla',
                        modelData: {
                            a: 1,
                            b: 2
                        }
                    },
                    {
                        block: 'b-inner-block',
                        content: [
                            {
                                block: 'i-model',
                                modelParams: {
                                    name: 'inner-aggregate-model',
                                    data: {
                                        a: 1,
                                        b: 2
                                    }
                                }
                            },
                            'bla',
                            {
                                block: 'i-model',
                                modelName: 'next-bla'
                            }
                        ]
                    }
                ]
            }));

            expect($('.i-model').length).toEqual(1);

            $('.b-inner-block').remove();
            $('.i-model').remove();
        });

    });

});
