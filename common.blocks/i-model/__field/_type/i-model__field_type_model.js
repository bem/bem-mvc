;(function(MODEL, $) {
    MODEL.FIELD.types.model = $.inherit(MODEL.FIELD, {

        /**
         * Инициализация поля
         * @param data
         * @returns {MODEL.FIELD.types.model}
         */
        initData: function(data) {
            this._value = MODEL.create({ name: this.params.modelName, patentMode: this.model }, data);

            this._value.on('change', function() {
                this._trigger('change', { fields: this._value.changed });
            }, this);

            return this;
        },

        /**
         * Закешировать состояние модели
         * @returns {MODEL.FIELD.types.model}
         */
        fixData: function() {
            this._value.fix();

            return this;
        },

        /**
         * Откатить значение на закешированное
         * @returns {MODEL.FIELD.types.model}
         */
        rollback: function() {
            this._value.rollback();

            return this;
        },

        /**
         * Задать значение
         * @param {Object} value
         * @param {Object} opts
         * @returns {BEM.MODEL.FIELD}
         */
        set: function(value, opts) {
            return this._set(value, opts);
        },

        /**
         * Проапдейтить модель данными
         * @param {Object|BEM.MODEL} data
         * @param {Object} opts
         * @returns {BEM.MODEL.FIELD}
         * @private
         */
        _set: function(data, opts) {
            if (data instanceof MODEL) {
                if (data.name === this.params.modelName)
                    this._value = data;
                else
                    throw new Error('incorrect model "' + data.name +  '", expected model "' + this.params.modelName +  '"');
            } else {
                this._value.update(data);
            }

            this._trigger(opts && opts.isInit ? 'init': 'change', opts);

            return this;
        },

        /**
         * Очистить поля модели
         * @param {Object} opts
         * @returns {MODEL.FIELD.types.model}
         */
        clear: function(opts) {
            this._value.clear(opts);

            return this;
        },

        /**
         * Получить модель
         * @returns {BEM.MODEL}
         */
        get: function() {
            return this._value;
        },

        /**
         * Получить данные модели
         * @returns {Object}
         */
        toJSON: function() {
            return this._value.toJSON();
        },

        /**
         * Правила валидиции для поля типа model
         * @returns {Object}
         * @private
         */
        _getValidationRules: function() {
            var field = this;

            return $.extend(this._commonRules(), {
                /**
                 * валидация вложенной модели
                 */
                deep: {
                    value: true,
                    validate: function(curValue, ruleValue, name) {
                        return field._value.isValid() == ruleValue
                    }
                }
            });
        }

    });
})(BEM.MODEL, jQuery);
