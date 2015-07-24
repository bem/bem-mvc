;(function(BEM) {
    var MODEL = BEM.MODEL;

    MODEL.FIELD.decl('boolean', {

        /**
         * Перед записью приводит значение к boolean
         * @param {*} value
         * @returns {boolean}
         * @private
         */
        _preprocess: function(value) {
            if (this.checkEmpty(value)) return;

            return !!(typeof value == 'string' ? +value : value);
        },

        /**
         * Приводит к 1 или 0
         * @param {Boolean} value
         * @returns {string}
         * @private
         */
        _format: function(value) {
            return (0 + value).toString();
        }
    });
})(BEM);
