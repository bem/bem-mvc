var fs = require('fs'),
    path = require('path'),
    DEFAULT_LANGS = ['ru', 'en'];

module.exports = function(config) {
    var tools = require('enb-bem-docs')(config),
        langs = process.env.BEM_I18N_LANGS;

    config.setLanguages(langs? langs.split(' ') : [].concat(DEFAULT_LANGS));

    config.nodes(['*.bundles/all-tests', '*.bundles/todos'], function(nodeConfig) {
        nodeConfig.addTechs([
            [require('enb/techs/file-provider'), { target : '?.bemjson.js' }],
            [require('enb/techs/bemdecl-from-bemjson')],
            [require('enb/techs/bemdecl-from-deps-by-tech'), {
                sourceTech : 'js',
                destTech : 'bemhtml',
                target : '?.bemhtml.bemdecl.js'
            }],
            [require('enb/techs/deps')],
            [require('enb/techs/files')],
            [require('enb/techs/deps'), {
                bemdeclTarget : '?.bemhtml.bemdecl.js',
                depsTarget : '?.bemhtml.deps.js'
            }],
            [require('enb/techs/files'), {
                depsTarget : '?.bemhtml.deps.js',
                filesTarget : '?.bemhtml.files',
                dirsTarget : '?.bemhtml.dirs'
            }],
            [require('enb-roole/techs/css-roole'), { target : '?.noprefix.css' }],
            [require('enb-diverse-js/techs/browser-js')],
            [require('enb-bemxjst/techs/bemhtml-old'), { devMode : false }],
            [require('enb-bemxjst/techs/bemhtml-old'), {
                target : '?.browser.bemhtml.js',
                filesTraget : '?.bemhtml.files',
                devMode : false
            }],
            [require('enb/techs/file-merge'), {
                sources : ['?.browser.bemhtml.js', '?.browser.js'],
                target : '?.pre.js'
            }],
            [require('enb-modules/techs/prepend-modules'), {
                source : '?.pre.js',
                target : '?.js'
            }],
            [require('enb/techs/html-from-bemjson')]
        ]);

        nodeConfig.addTargets([
            '_?.css', '_?.js', '?.html'
        ]);
    });

    config.nodes(['desktop.bundles/all-tests', 'desktop.bundles/todos'], function(nodeConfig) {
        var levels = getDesktopLevels(config),
            absPath = path.join(nodeConfig._root, nodeConfig._path, 'blocks');

        if(fs.existsSync(absPath)) {
            levels = levels.concat(absPath);
        }

        nodeConfig.addTechs([
            [require('enb/techs/levels'), { levels : levels }],
            [require('enb-autoprefixer/techs/css-autoprefixer'), {
                sourceTarget : '?.noprefix.css',
                destTarget : '?.css',
                browserSupport : getDesktopBrowsers()
            }]
        ]);
    });

    config.mode('development', function() {
        config.nodes(['*.bundles/all-tests', '*.bundles/todos'], function(nodeConfig) {
            nodeConfig.addTechs([
                [require('enb/techs/file-copy'), { sourceTarget : '?.css', destTarget : '_?.css' }],
                [require('enb/techs/file-copy'), { sourceTarget : '?.js', destTarget : '_?.js' }]
            ]);
        });
    });

    config.mode('production', function() {
        config.nodes(['*.bundles/all-tests', '*.bundles/todos'], function(nodeConfig) {
            nodeConfig.addTechs([
                [require('enb/techs/borschik'), { sourceTarget : '?.css', destTarget : '_?.css' }],
                [require('enb/techs/borschik'), { sourceTarget : '?.js', destTarget : '_?.js' }]
            ]);
        });
    });

    tools.configureSets({
        sets : {
            destPath : 'desktop.sets',
            levels : getDesktopLibLevels(config)
        },
        jsdocs : {
            _suffixes : ['vanilla.js', 'node.js', 'browser.js', 'js']
        },
        examples : {
            levels : getDesktopLibLevels(config),
            _techs : [
                [require('enb/techs/file-copy'), {
                    sourceTarget : '?.bemjson.js',
                    destTarget : '_?.bemjson.js'
                }],
                [require('enb/techs/file-copy'), {
                    sourceTarget : '?.html',
                    destTarget : '_?.html'
                }],
                [require('enb-modules/techs/prepend-modules'), {
                    target : '?.js',
                    source : '?.pre.js'
                }],
                [require('enb-diverse-js/techs/browser-js'), {
                    target : '?.pre.js'
                }],
                [require('enb-bemxjst/techs/bemhtml'), { devMode : false }],
                require('enb/techs/html-from-bemjson')
            ],
            _targets : [
                '?.js', '_?.bemjson.js',
                '?.bemhtml.js', '_?.html'
            ],
            _optimizeTargets : [
                '?.js'
            ]
        }
    });
};

/**
 * Получение уровней для сборки примеров
 * @param {Object} config
 * @returns {*|Array}
 */
function getDesktopLibLevels(config) {
    return [
        'common.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}

function getDesktopLevels(config) {
    return [
        { path : 'libs/bem-core/common.blocks', check : false },
        { path : 'libs/bem-core/desktop.blocks', check : false },
        { path : 'libs/bem-components/common.blocks', check : false },
        { path : 'libs/bem-components/desktop.blocks', check : false },
        { path : 'libs/bem-components/design/common.blocks', check : false },
        { path : 'libs/bem-components/design/desktop.blocks', check : false },
        'common.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}

function getDesktopBrowsers() {
    return [
        'last 2 versions',
        'ie 10',
        'ff 24',
        'opera 12.16'
    ];
}
