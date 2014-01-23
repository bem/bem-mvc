BEM.MODEL.decl('simple-model', {
    field1: { type: 'string' },
    field2: { type: 'number' },
    field3: { type: 'boolean' }
});

BEM.MODEL.decl('outer-model', {
    inner: {
        type: 'model',
        modelName: 'inner-model'
    }
});
BEM.MODEL.decl('inner-model', {
    field: 'string'
});

BEM.MODEL.decl('outer-model-with-list', {
    list: {
        type: 'models-list',
        modelName: 'inner-model-in-list'
    }
});
BEM.MODEL.decl('inner-model-in-list', {
    field: 'string'
});


BEM.DOM.decl('i-model-benchmark', {
    onSetMod: {
        js: function() {
            var suite = new Benchmark.Suite,
                modelToSet = BEM.MODEL.create({ name: 'simple-model' }, {
                    field1: 'a',
                    field2: 1,
                    field3: true
                }),
                fieldsHash = {},
                fieldsValueHash = {},
                outerModel = BEM.MODEL.create('outer-model', {
                    inner: {
                        field: 'blah'
                    }
                }),
                modelWithList = BEM.MODEL.create('outer-model-with-list', {
                    list: []
                }),
                listItem,
                bigModelToSet,
                bigModelFieldsCount = 100,
                createdModel;

            for (var i = 0; i < bigModelFieldsCount; i++) {
                fieldsHash['field' + i] = { type: 'string' };
                fieldsValueHash['field' + i] = 'value' + i;
            }

            BEM.MODEL.decl('big-model', fieldsHash);

            bigModelToSet = BEM.MODEL.create({ name: 'big-model' }, fieldsValueHash);
            bigModelToSet.on('change', new Function())

            suite
                .add('decl', function() {
                    BEM.MODEL.decl('decl-model' + index++, {
                        field1: { type: 'string' },
                        field2: { type: 'number' },
                        field3: { type: 'boolean' }
                    });
                })
                .add('decl big', function() {
                    BEM.MODEL.decl('big-decl-model' + index++, fieldsHash);
                })
                .add('create', function() {
                    createdModel = BEM.MODEL.create('simple-model', {
                        field1: 'a',
                        field2: 1,
                        field3: true
                    });
                })
                .add('create big', function() {
                    createdModel = BEM.MODEL.create({ name: 'big-model' }, fieldsValueHash);
                })
                .add('set', function() {
                    modelToSet.set('field1', 'b');
                })
                .add('set with throttling', function() {
                    for (var i = 0; i < bigModelFieldsCount; i++) {
                        bigModelToSet.set('field' + i, 'value' + i);
                    }
                })
                .add('get', function() {
                    modelToSet.get('field1');
                })
                .add('inner set', function() {
                    outerModel.set('inner', { field: 'bla bla' });
                })
                .add('list add', function(data) {
                    modelWithList.get('list').add({ field: 'bla bla blaaa' });
                }, {
                    onStart: function() {
                        modelWithList.set('list', []);
                    }
                })
                .add('list add with subscribers', function(data) {
                    modelWithList.get('list').add({ field: 'bla bla blaaa' });
                }, {
                    onStart: function() {
                        for(var i = 0; i < 1000; i++)
                            modelWithList.on('list', 'change', new Function())
                    }
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
