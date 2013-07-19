modules.define(
    'model',
    ['inherit', 'objects'],
    function(provide, inherit, objects, MODEL) {


MODEL.FIELD.types.number = inherit(MODEL.FIELD, {

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
        //Если было введено не число, то preprocess вернет NaN
        return value;
    },

    /**
     * Определяем дефолтные значения для поля
     * @returns {Object}
     * @private
     */
    _initDefaults: function() {
        //0 - это валидное значение для default
        this._default = this.params['default'] === undefined ? this._default : this.params['default'];

        this._precision = this.params.precision === undefined ? 2 : this.params.precision;

        this._validationRules = this._getValidationRules();

        return this;
    },


    /**
     * Форматированное значение содержит два десятичных знака
     * @param {Number} value
     * @returns {string}
     * @private
     */
    _format: function(value) {
        return (value || 0).toFixed(this._precision);
    },

    /**
     * Правила валидации для поля типа number
     * @private
     */
    _getValidationRules: function() {
        return objects.extend(this._commonRules(), {
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

provide(MODEL);

});
