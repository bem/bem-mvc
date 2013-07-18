var PATH = require('path'),
    join = PATH.join,
    environ = require('bem-environ'),

    PRJ_ROOT = environ.PRJ_ROOT,
    PRJ_TECHS = join(PRJ_ROOT, '.bem/techs'),
    BEMCORE_TECHS = environ.getLibPath('bem-core', '.bem/techs'),
    BEMPR_TECHS = environ.getLibPath('bem-pr', 'bem/techs');

exports.getTechs = function() {

    return {
        'bemjson.js'         : join(PRJ_TECHS, 'bemjson.js'),
        'bemdecl.js'         : 'v2/bemdecl.js',
        'deps.js'            : 'v2/deps.js',
        'js'                 : 'v2/js-i',
        'test.js'            : join(PRJ_TECHS, 'test.js.js'),
        'test.js+browser.js+bemhtml.js' : join(BEMPR_TECHS, 'test.js+browser.js+bemhtml.js'),
        'vanilla.js'         : join(BEMCORE_TECHS, 'vanilla.js.js'),
        'browser.js'         : join(BEMCORE_TECHS, 'browser.js.js'),
        'browser.js+bemhtml' : join(BEMCORE_TECHS, 'browser.js+bemhtml.js'),
        'css'                : 'v2/css',
        'ie.css'             : 'v2/ie.css',
        'ie6.css'            : 'v2/ie6.css',
        'ie7.css'            : 'v2/ie7.css',
        'ie8.css'            : 'v2/ie8.css',
        'ie9.css'            : 'v2/ie9.css',

        'bemhtml'            : join(BEMCORE_TECHS, 'bemhtml.js'),
        'html'               : join(BEMCORE_TECHS, 'html.js')
    };

};

// Create bundles in bemjson.js tech
exports.defaultTechs = ['bemjson.js'];

