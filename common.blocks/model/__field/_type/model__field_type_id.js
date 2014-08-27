/**
 * @module model
 */

modules.define(
    'model',
    ['inherit'],
    function(provide, inherit, MODEL) {

/**
 * @exports model:blocks.model__field_type_id
 * @class model__field_type_id
 * @augments MODEL:FIELD
 * @bem model__field_type_id
 */
MODEL.FIELD.types.id = inherit(MODEL.FIELD, /** @lends model__field_type_id.prototype */{

    /**
     * Проверка на пустоту
     * @returns {Boolean}
     */
    isEmpty: function() {
        return true;
    }

});

provide(MODEL);

});
