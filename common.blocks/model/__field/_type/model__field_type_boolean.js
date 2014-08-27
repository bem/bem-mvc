/**
 * @module model
 */

modules.define(
    'model',
    ['inherit'],
    function(provide, inherit, MODEL) {

/**
 * @exports model:blocks.model__field_type_boolean
 * @class model__field_type_boolean
 * @augments MODEL:FIELD
 * @bem model__field_type_boolean
 */
MODEL.FIELD.types.boolean = inherit(MODEL.FIELD, /** @lends model__field_type_boolean.prototype */{

    /**
     * Перед записью приводит значение к boolean
     * @param {*} value
     * @returns {Boolean}
     * @private
     */
    _preprocess: function(value) {
        if (this.checkEmpty(value)) return;

        return !!(typeof value == 'string' ? +value : value);
    },

    /**
     * Приводит к 1 или 0
     * @param {Boolean} value
     * @returns {String}
     * @private
     */
    _format: function(value) {
        return (0 + value).toString();
    }

});

provide(MODEL);

});
