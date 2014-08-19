var fs = require('fs'),
    path = require('path'),
    DEFAULT_LANGS = ['ru', 'en'],
    naming = require('bem-naming'),
    levels = require('enb/techs/levels'),
    provide = require('enb/techs/file-provider'),
    bemdeclFromDepsByTech = require('enb/techs/bemdecl-from-deps-by-tech'),
    bemdecl = require('enb/techs/bemdecl-from-bemjson'),
    deps = require('enb/techs/deps-old'),
    files = require('enb/techs/files'),
    mergeBemdecl = require('enb/techs/bemdecl-merge'),
    css = require('enb-stylus/techs/css-stylus'),
    autoprefixer = require('enb-autoprefixer/techs/css-autoprefixer'),
    js = require('enb-diverse-js/techs/browser-js'),
    ym = require('enb-modules/techs/prepend-modules'),
    bemhtml = require('enb-bemxjst/techs/bemhtml-old'),
    html = require('enb-bemxjst/techs/html-from-bemjson'),
    bh = require('enb-bh/techs/bh-server'),
    bhHtml = require('enb-bh/techs/html-from-bemjson'),
    copyFile = require('enb/techs/file-copy'),
    mergeFiles = require('enb/techs/file-merge'),
    borschik = require('enb-borschik/techs/borschik'),
    PLATFORMS = {
        'desktop' : ['common']
    };

module.exports = function(config) {
    config.includeConfig('enb-bem-examples');
    config.includeConfig('enb-bem-docs');
    config.includeConfig('enb-bem-specs');
    config.includeConfig('enb-bem-tmpl-specs');

    var sets = {
            tests : config.module('enb-bem-examples').createConfigurator('tests'),
            examples : config.module('enb-bem-examples').createConfigurator('examples'),
            docs : config.module('enb-bem-docs').createConfigurator('docs', 'examples'),
            specs : config.module('enb-bem-specs').createConfigurator('specs'),
            tmplSpecs : config.module('enb-bem-tmpl-specs').createConfigurator('tmpl-specs')
        },
        langs = process.env.BEM_I18N_LANGS;

    config.setLanguages(langs? langs.split(' ') : [].concat(DEFAULT_LANGS));

    configureSets('desktop', config, sets);

    configureLevels('desktop', config, sets);

    configureAutoprefixer('desktop', config, sets);

    config.nodes(['*.pages/*', '*.bundles/*'], function(nodeConfig) {
        nodeConfig.addTech([provide, { target : '?.bemjson.js' }]);
    });

    config.nodes(['*.bundles/all-tests', '*.bundles/todos'], function(nodeConfig) {
        var langs = config.getLanguages();

        // Base techs
        nodeConfig.addTechs([
            [bemdecl],
            [deps],
            [files]
        ]);

        // Client techs
        nodeConfig.addTechs([
            [css, { target : '?.noprefix.css' }],
            [js],
            [mergeFiles, {
                target : '?.pre.js',
                sources : ['?.browser.bemhtml.js', '?.browser.js']
            }],
            [ym, {
                source : '?.pre.js',
                target : '?.js'
            }]
        ]);

        // Client BEMHTML
        nodeConfig.addTechs([
            [bemdeclFromDepsByTech, {
                target : '?.js.bemhtml.bemdecl.js',
                sourceTech : 'js',
                destTech : 'bemhtml'
            }],
            [mergeBemdecl, {
                bemdeclSources : ['?.js.bemhtml.bemdecl.js', '?.bemdecl.js'],
                bemdeclTarget : '?.bemhtml.bemdecl.js'
            }],

            [deps, {
                depsTarget : '?.bemhtml.deps.js',
                bemdeclTarget : '?.bemhtml.bemdecl.js'
            }],
            [files, {
                depsTarget : '?.bemhtml.deps.js',
                filesTarget : '?.bemhtml.files',
                dirsTarget : '?.bemhtml.dirs'
            }],

            [bemhtml, {
                target : '?.browser.bemhtml.js',
                filesTarget : '?.bemhtml.files',
                devMode : false
            }]
        ]);

        // Template techs
        nodeConfig.addTechs([
            [bemhtml],
            [bh, { jsAttrName : 'data-bem', jsAttrScheme : 'json' }]
        ]);

        // Build htmls
        nodeConfig.addTechs([
            [html],
            [bhHtml, { target : '?.bh.html' }]
        ]);

        langs.forEach(function(lang) {
            var destTarget = '?.' + lang + '.html';

            nodeConfig.addTech([copyFile, { source : '?.html', target : destTarget }]);
            nodeConfig.addTarget(destTarget);
        });

        nodeConfig.addTargets([
            '_?.css', '_?.js', '?.html'
        ]);
    });

    config.mode('development', function() {
        config.nodes(['*.bundles/all-tests', '*.bundles/todos'], function(nodeConfig) {
            nodeConfig.addTechs([
                [copyFile, { source : '?.css', target : '_?.css' }],
                [copyFile, { source : '?.js', target : '_?.js' }]
            ]);
        });
    });

    config.mode('production', function() {
        config.nodes(['*.bundles/all-tests', '*.bundles/todos'], function(nodeConfig) {
            nodeConfig.addTechs([
                [borschik, { source : '?.css', target : '_?.css', freeze : true }],
                [borschik, { source : '?.js', target : '_?.js', freeze : true }]
            ]);
        });
    });
};

function configureAutoprefixer(platform, config) {
    config.nodes([platform + '.pages/*', platform + '.tests/*/*', platform + '.examples/*/*'], function(nodeConfig) {
        nodeConfig.addTechs([
            [autoprefixer, {
                sourceTarget : '?.noprefix.css',
                destTarget : '?.css',
                browserSupport : getBrowsers(platform)
            }]
        ]);
    });
}

function configureLevels(platform, config) {
    config.nodes([platform + '.bundles/all-tests/*/*', platform + '.bundles/todos*', platform + '.tests/*/*'], function(nodeConfig) {
        var nodeDir = nodeConfig.getNodePath(),
            blockSublevelDir = path.join(nodeDir, '..', '.blocks'),
            sublevelDir = path.join(nodeDir, 'blocks'),
            extendedLevels = [].concat(getTestLevels(platform, config));

        if(fs.existsSync(blockSublevelDir)) {
            extendedLevels.push(blockSublevelDir);
        }

        if(fs.existsSync(sublevelDir)) {
            extendedLevels.push(sublevelDir);
        }

        nodeConfig.addTech([levels, { levels : extendedLevels }]);
    });
}

function configureSets(platform, config, sets) {
    sets.examples.configure({
        destPath : platform + '.examples',
        levels : getLibLevels(platform, config),
        techSuffixes : ['examples'],
        fileSuffixes : ['bemjson.js', 'title.txt'],
        inlineBemjson : true
    });

    sets.tests.configure({
        destPath : platform + '.tests',
        levels : getLibLevels(platform, config),
        suffixes : ['tests'],
        techSuffixes : ['tests'],
        fileSuffixes : ['bemjson.js', 'title.txt']
    });

    sets.docs.configure({
        destPath : platform + '.docs',
        levels : getLibLevels(platform, config),
        exampleSets : [platform + '.examples']
    });

    sets.specs.configure({
        destPath : platform + '.specs',
        levels : getLibLevels(platform, config),
        sourceLevels : getSpecLevels(platform, config)
    });
}

function getLibLevels(platform, config) {
    return PLATFORMS[platform].map(function(level) {
        return config.resolvePath(level + '.blocks');
    });
}

function getSourceLevels(platform, config) {
    var platformNames = PLATFORMS[platform];
    var levels = [];

    platformNames.forEach(function(name) {
        levels.push({ path : path.join('libs', 'bem-core', name + '.blocks'), check : false });
    });

    platformNames.forEach(function(name) {
        levels.push({ path : name + '.blocks', check : false });
    });

    return levels.map(function(level) {
        return config.resolvePath(level);
    });
}

function getTestLevels(platform, config) {
    return [].concat(
        getSourceLevels(platform, config),
        config.resolvePath('test.blocks')
    );
}

function getSpecLevels(platform, config) {
    return [].concat(
        config.resolvePath({ path : path.join('libs', 'bem-pr'), check : false }),
        getSourceLevels(platform, config)
    );
}

function wrapInPage(bemjson, meta) {
    var basename = path.basename(meta.filename, '.bemjson.js');
    var res = {
        block : 'page',
        title : naming.stringify(meta.notation),
        head : [
            { elem : 'css', url : '_' + basename + '.css' },
            { elem : 'js', url : '_' + basename + '.js' }
        ],
        content : bemjson
    };
    var theme = getThemeFromBemjson(bemjson);

    if(theme) {
        res.mods = { theme : theme };
    }

    return res;
}

function getThemeFromBemjson(bemjson) {
    var theme;

    if(Array.isArray(bemjson)) {
        for(var i = 0; i < bemjson.length; ++i) {
            theme = getThemeFromBemjson(bemjson[i]);

            if(theme) {
                return theme;
            }
        }
    } else {
        for(var key in bemjson) {
            if(bemjson.hasOwnProperty(key)) {
                var value = bemjson[key];

                if(key === 'mods') {
                    var mods = bemjson[key];

                    theme = mods && mods.theme;

                    if(theme) {
                        return theme;
                    }
                }

                if(key === 'content' && Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                    return getThemeFromBemjson(bemjson[key]);
                }
            }
        }
    }
}

function getBrowsers(platform) {
    switch(platform) {
        case 'desktop':
            return [
                'last 2 versions',
                'ie 10',
                'ff 24',
                'opera 12.16'
            ];
    }
}
