GLOBAL.BEM = {};
GLOBAL.BEM.MODEL = {};

require('../desktop.bundles/universal/_universal.js');


BEM.MODEL.decl('bla', {
    f1: 'string',
    f2: {
        type: 'model',
        modelName: 'bla-inner'
    }
});

BEM.MODEL.decl('bla-inner', {
    ff: 'boolean'
});

var model = BEM.MODEL.create('bla', { f1: 1, f2: { ff: 0 } });
model.set('f1', 'qwe');
console.log(typeof model.get('f1'));
