;(function(MODEL, $) {
    MODEL.FIELD.types.string = $.inherit(MODEL.FIELD, {

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
})(BEM.MODEL, jQuery);
