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
            return $.extend(this._commonRules(), {
                maxlength: {
                    value: Infinity,
                    validate: function(curValue, ruleValue, name) {
                        return curValue.length < ruleValue;
                    }
                }
            })
        }

    });
})(BEM.MODEL, jQuery);
