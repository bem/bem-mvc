BEM.DOM.decl('i-glue-benchmark', {
    onSetMod: {
        js: function() {


            var suite = new Benchmark.Suite(),
                smallModelsHolder = [],
                smallModelsHtml,
                hugeModelData = {},
                hugeModelHtml,
                hugeModelDataVariants = ['some string', 42, false],
                hugeModelFieldsCount = 1000;

            BEM.MODEL.decl('small-model', {
                field1: { type: 'string' },
                field2: { type: 'number' },
                field3: { type: 'boolean' }
            });

            BEM.MODEL.decl('huge-model', (function() {
                var result = {},
                    types = ['string', 'number', 'boolean'];

                for (var i = 0; i < hugeModelFieldsCount; i++) {
                    result['field' + i] = { type: types[i % 3] }
                }

                return result;
            }()));


            for(var i = 0; i < 100; i++) {
                smallModelsHolder.push({
                    block: 'i-glue-benchmark',
                    elem: 'small-model',
                    data: {
                        field1: 'blahblah',
                        field2: 123,
                        field1: true
                    }
                })
            }

            for(var i = 0; i < hugeModelFieldsCount; i++) {
                hugeModelData['field' + i] = hugeModelDataVariants[i % 3];
            }

            smallModelsHtml = BEMHTML.apply(smallModelsHolder);

            hugeModelHtml = BEMHTML.apply({
                block: 'i-glue-benchmark',
                elem: 'huge-model',
                fieldsCount: hugeModelFieldsCount,
                data: hugeModelData
            });

            suite
                .add('lots of small', function() {
                    var dom = $(smallModelsHtml);
                    BEM.DOM.init(dom);
                    dom.remove()
                })
                .add('one huge', function() {
                    var dom = $(hugeModelHtml);
                    BEM.DOM.init(dom);
                    dom.remove()
                })
                .on('complete', function () {
                    this.forEach(function(bench) {
                        console.log({
                            name: bench.name,
                            eps: 1 / bench.times.period
                        });
                    });
                })
                .on('start', function() {
                    console.log('benchmark started');
                })
                .on('cycle', function(e) {
                    console.log('completed ' + e.target.name);
                })
                .run();
        }
    }
})
