/**
 * @module model
 */

modules.define(
    'model',
    ['inherit', 'objects'],
    function(provide, inherit, objects, MODEL) {

/**
 * @exports model:blocks.model__field_type_string
 * @class model__field_type_string
 * @augments MODEL:FIELD
 * @bem model__field_type_string
 */
MODEL.FIELD.types.string = inherit(MODEL.FIELD, /** @lends model__field_type_string.prototype */{

    /**
     * Значение по умолчанию пустая строка
     */
    _default: '',

    /**
     * Правила валидации для поля типа String
     * @returns {Object}
     * @private
     */
    _getValidationRules: function() {
        var maxLength = {
            value: Infinity,
            validate: function(curValue, ruleValue, name) {
                return curValue.length <= ruleValue;
            }
        };

        return objects.extend(this._commonRules(), {
            maxlength: maxLength,
            maxLength: maxLength
        })
    }

});

provide(MODEL);

});
