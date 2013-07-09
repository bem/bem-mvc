"use strict";

//process.env.YENV = 'production';

MAKE.decl('Arch', {

    blocksLevelsRegexp: /^.+?\.blocks/,

    bundlesLevelsRegexp: /^.+?\.bundles$/,

    getLibraries: function() {

        return {
            'bem-bl': {
                type: 'git',
                url: 'git://github.com/bem/bem-bl.git',
                treeish: '0.3'
            },
            'bem-control': {
                type: 'git',
                url: 'git://github.com/bem/bem-controls.git',
                treeish: '362fec5d7499275a1b40fc582a68ebc8a3557a1a'
            },
            'islands-components': {
                type: 'git',
                url: 'git://github.yandex-team.ru/lego/islands-components.git',
                treeish: 'v1'
            },
            'bemhtml': {
                type: 'git',
                url: 'git://github.com/bem/bemhtml.git',
                treeish: 'master'
            }
        };

    }

});


MAKE.decl('BundleNode', {

    getTechs: function() {
        return [
            'bemjson.js',
            'bemdecl.js',
            'deps.js',
            'bemhtml',
            'test.js',
            'js',
            'css',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'html'
        ];
    },

    'create-test.js-optimizer-node': function(tech, sourceNode, bundleNode) {

        sourceNode.getFiles().forEach(function(f) {
            this['create-js-optimizer-node'](tech, this.ctx.arch.getNode(f), bundleNode);
        }, this);

    }

});
