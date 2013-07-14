var PATH = require('path'),
    join = PATH.join,
    environ = require('bem-environ'),

    PRJ_ROOT = environ.PRJ_ROOT,
    PRJ_TECHS = join(PRJ_ROOT, '.bem/techs'),
    BEMBL_TECHS = environ.getLibPath('bem-bl', 'blocks-common/i-bem/bem/techs');

exports.getTechs = function() {

    return {
        'bemjson.js'    : join(PRJ_TECHS, 'bemjson.js'),
        'bemdecl.js'    : 'v2/bemdecl.js',
        'deps.js'       : 'v2/deps.js',
        'test.js'       : join(PRJ_TECHS, 'test.js.js'),
        'js'            : join(PRJ_TECHS, 'js.js'),
        'css'           : 'v2/css',
        'ie.css'        : 'v2/ie.css',
        'ie6.css'       : 'v2/ie6.css',
        'ie7.css'       : 'v2/ie7.css',
        'ie8.css'       : 'v2/ie8.css',
        'ie9.css'       : 'v2/ie9.css',

        'bemhtml'       : join(BEMBL_TECHS, 'v2/bemhtml.js'),
        'html'          : join(BEMBL_TECHS, 'html.js')
    };

};

// Create bundles in bemjson.js tech
exports.defaultTechs = ['bemjson.js'];

