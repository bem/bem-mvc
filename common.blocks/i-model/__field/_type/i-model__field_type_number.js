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

            this._isNumber = !isNaN(value);

            return this._isNumber ? value : this._default;
        },

        /**
         * Является ли текущее значение поля числом
         * @returns {Boolean}
         */
        isNumber: function() {
            return this._isNumber;
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
         * Поверяет равно ли текущее значение поля значению переменной value
         * @param {*} value значение для сравнения с текущим значением
         * @returns {boolean}
         */
        isEqual: function(value) {
            return value === this.raw() || this.isEmpty() && this.checkEmpty(value);
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
                isNumber: {
                    value: true,
                    validate: function(curValue, ruleValue, name) {
                        return this.fields[name].isNumber() == ruleValue;
                    }
                },
                required: {
                    value: true,
                    validate: function(curValue, ruleValue, name) {
                        var field = this.fields[name];

                        //проверяем на пустоту значение raw потому что могла быть попытка установить не число (тогда value пустое, но raw не пусто)
                        return field.checkEmpty(field.raw()) !== ruleValue;
                    }
                }

            })
        }

    });

})(BEM.MODEL, jQuery);
