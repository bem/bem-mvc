;(function(BEM) {
    var MODEL = BEM.MODEL,
        objects = MODEL._utils.objects;

    MODEL.FIELD.decl('string', {

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
                    return curValue && curValue.length <= ruleValue;
                }
            };

            return objects.extend(this._commonRules(), {
                maxlength: maxLength,
                maxLength: maxLength
            })
        }

    });
})(BEM);
