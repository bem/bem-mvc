modules.define(
    'model__field',
    ['inherit', 'events', 'jquery'],
    function(provide, inherit, events, $, FIELD) {


FIELD.types.string = inherit(FIELD, {

    /**
     * Значение по умолчанию пустая строка
     */
    _default: '',

    /**
     * Правила валидации для поля типа string
     * @private
     */
    _getValidationRules: function() {
        var maxLength = {
            value: Infinity,
            validate: function(curValue, ruleValue, name) {
                return curValue.length <= ruleValue;
            }
        };

        return $.extend(this._commonRules(), {
            maxlength: maxLength,
            maxLength: maxLength
        })
    }

});

provide(FIELD);

});
