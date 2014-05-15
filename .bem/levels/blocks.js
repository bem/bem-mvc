var environ = require('bem-environ'),
    getTechResolver = environ.getTechResolver,

    BEMCORE_TECHS = environ.getLibPath('bem-core', '.bem/techs'),
    BEMPR_TECHS = environ.getLibPath('bem-pr', 'bem/techs');

exports.getTechs = function() {
    var techs = {
        'css'           : 'v2/css',
        'ie.css'        : 'v2/ie.css',
        'ie7.css'       : 'v2/ie7.css',
        'ie8.css'       : 'v2/ie8.css',
        'ie9.css'       : 'v2/ie9.css',
        'js'            : 'v2/js-i',
        'bemdecl.js'    : 'v2/bemdecl.js',
        'deps.js'       : 'v2/deps.js'
    };

    // use techs from project (.bem/techs)
    ['bemjson.js'].forEach(getTechResolver(techs, '.bem/techs'));

    // use techs from bem-pr library
    ['test.js+browser.js+bemhtml'].forEach(getTechResolver(techs, BEMPR_TECHS));

    // use techs from bem-core library
    ['bemhtml', 'bemtree', 'vanilla.js', 'browser.js', 'node.js'].forEach(getTechResolver(techs, BEMCORE_TECHS));

    return techs;
};

exports.defaultTechs = ['css', 'js', 'bemhtml'];
