"use strict";

//process.env.YENV = 'production';
process.env.XJST_ASYNCIFY = 'yes';

require('bem-environ/lib/nodes');

MAKE.decl('Arch', {

    blocksLevelsRegexp: /^.+?\.blocks/,

    bundlesLevelsRegexp: /^.+?\.bundles$/,

    libraries: [
        'bem-bl @ 0.3',
        'bem-controls @ 362fec5d7499275a1b40fc582a68ebc8a3557a1a'
    ]

});


MAKE.decl('BundleNode', {

    getTechs: function() {
        return [
            'bemjson.js',
            'bemdecl.js',
            'deps.js',
            'bemhtml',
            'js+bemhtml',
            'test.js',
            'css',
            'ie.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'html'
        ];
    },

    'create-js+bemhtml-optimizer-node': function(tech, sourceNode, bundleNode) {

        sourceNode.getFiles().forEach(function(f) {
            this['create-js-optimizer-node'](tech, this.ctx.arch.getNode(f), bundleNode);
        }, this);

    },

    'create-test.js-optimizer-node': function(tech, sourceNode, bundleNode) {

        sourceNode.getFiles().forEach(function(f) {
            this['create-js-optimizer-node'](tech, this.ctx.arch.getNode(f), bundleNode);
        }, this);

    }

});
