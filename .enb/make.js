module.exports = function(config) {
    var tools = require('enb-bem-docs')(config);

    tools.configureSets({
        sets : {
            destPath : 'desktop.sets',
            levels : getDesktopLevels(config)
        },
        jsdocs : {
            _suffixes : ['vanilla.js', 'node.js', 'browser.js', 'js']
        },
        examples : {
            levels : getDesktopLevels(config),
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
function getDesktopLevels(config) {
    return [
        'common.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
