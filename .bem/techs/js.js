exports.techMixin = {

    getBuildResultChunk: function(relPath, path, suffix) {

        return '/* borschik:include:' + relPath + ' */\n';

    },

    // Add in compliance with js and js-techs of bem-tools
    getSuffixes: function() {
        return ['js'];
    }

};
