;(function(MODEL, $) {
    MODEL.FIELD.types.number = $.inherit(MODEL.FIELD, {

        /**
         * Перед записью приводит значение к числу
         * @param value
         * @returns {Number}
         * @private
         */
        _preprocess: function(value) {
            if (this.checkEmpty(value)) return;

            // перед преобразованием, необходимо часто вводимые символы на точку
            value = (new Number(value.toString().replace(/[//,.юЮбБ<>]/gi, '.'))).valueOf();

            return isNaN(value) ? NaN : value;
        },

        /**
         * Поверяет равно ли текущее значение поля значению переменной value
         * @param {*} value
         * @returns {Boolean}
         */
        isEqual: function(value) {
            return value === this.raw() || this.isEmpty() && this.checkEmpty(value);
        },

        /**
         * Форматированное значение содержит два десятичных знака
         * @param {Number} value
         * @returns {string}
         * @private
         */
        _format: function(value) {
            return (value || 0).toFixed(2);
        },

        /**
         * Правила валидации для поля типа number
         * @private
         */
        _getValidationRules: function() {
            return $.extend(this._commonRules(), {
                max: {
                    value: Infinity,
                    validate: function(curValue, ruleValue, name) {
                        return curValue < ruleValue;
                    }
                },
                min: {
                    value: -Infinity,
                    validate: function(curValue, ruleValue, name) {
                        return curValue > ruleValue;
                    }
                },
                gte: {
                    value: Infinity,
                    validate: function(curValue, ruleValue, name) {
                        return curValue <= ruleValue;
                    }
                },
                lte: {
                    value: -Infinity,
                    validate: function(curValue, ruleValue, name) {
                        return curValue >= ruleValue;
                    }
                },
                type: {
                    value: true,
                    validate: function(curValue) {
                        return !isNaN(curValue);
                    }
                }

            })
        }

    });

})(BEM.MODEL, jQuery);
