var extend = require('bem/lib/util').extend,
    BEM = require('bem');

exports.baseLevelPath = require.resolve('../../.bem/levels/bundles.js');

exports.getConfig = function() {

    return extend({}, this.__base() || {}, {

        bundleBuildLevels: this.resolvePaths([
            '../../bem-bl/blocks-common',
            '../../bem-bl/blocks-test',
            '../../bem-bl/blocks-desktop',
            '../../bem-control/common.blocks',
            '../../bem-control/desktop.blocks',
            '../../islands-components/common.blocks',
            '../../islands-components/desktop.blocks',
            '../../common.blocks',
            '../../desktop.blocks'
        ])

    });

};
