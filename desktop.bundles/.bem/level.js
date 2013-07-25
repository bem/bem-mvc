var extend = require('bem/lib/util').extend,
    PATH = require('path'),
    BEM = require('bem'),
    environ = require('bem-environ');

exports.baseLevelPath = require.resolve('../../.bem/levels/bundles.js');

exports.getConfig = function() {

    return extend(this.__base() || {}, {

        bundleBuildLevels: [
            'bem-core/common.blocks',
            'bem-core/desktop.blocks',
            'bem-pr/test.blocks',
            'bem-controls/common.blocks',
            'bem-controls/desktop.blocks'
        ]
        .map(function(path) { return PATH.resolve(environ.LIB_ROOT, path); })
        .concat([
            'common.blocks',
            'desktop.blocks'
        ]
        .map(function(path) { return PATH.resolve(environ.PRJ_ROOT, path); }))

    });

};
