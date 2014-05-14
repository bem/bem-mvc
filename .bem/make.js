"use strict";

//process.env.YENV = 'production';
process.env.XJST_ASYNCIFY = 'yes';

// make.js

// Initialize environ with global root path (see API section for more examples)
var environ = require('bem-environ')(__dirname);

function extendMake(registry) {

    // Extend common `bem make` build process with `bem-environ`'s nodes (optional)
    environ.extendMake(registry);

    registry.decl('Arch', {

        blocksLevelsRegexp: /^.+?\.blocks/,

        bundlesLevelsRegexp: /^.+?\.bundles$/,

        libraries: [
            'bem-core @ v2.2.1',
            'bem-components @ v2',
            'bem-pr @ v0.2'
        ]

    });

}

// For compatibility with bem-tools << 1.0.0
if (MAKE) extendMake(MAKE);

// For compatibility with bem-tools >= 1.0.0
if (module && module.exports) module.exports = extendMake;

MAKE.decl('BundleNode', {

    getTechs: function() {
        return [
            'bemjson.js',
            'bemdecl.js',
            'deps.js',
            'bemhtml',
            'test.js',
            'test.js+browser.js+bemhtml',
            'browser.js+bemhtml',
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

    },

    'create-browser.js+bemhtml-optimizer-node': function(tech, sourceNode, bundleNode) {

        sourceNode.getFiles().forEach(function(f) {
            this['create-js-optimizer-node'](tech, this.ctx.arch.getNode(f), bundleNode);
        }, this);

    }

});
