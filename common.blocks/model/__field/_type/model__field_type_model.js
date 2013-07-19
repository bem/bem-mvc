modules.define(
    'model',
    ['inherit'],
    function(provide, inherit, MODEL) {


    MODEL.FIELD.types.model = inherit(MODEL.FIELD, {

        /**
         * Инициализация поля
         * @param data
         * @returns {FIELD}
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
         * @returns {FIELD}
         */
        fixData: function() {
            this._value.fix();

            return this;
        },

        /**
         * Откатить значение на закешированное
         * @returns {FIELD}
         */
        rollback: function() {
            this._value.rollback();

            return this;
        },

        /**
         * Задать значение
         * @param {Object} value
         * @param {Object} opts
         * @returns {FIELD}
         */
        set: function(value, opts) {
            return this._set(value, opts);
        },

        /**
         * Проапдейтить модель данными
         * @param {Object} data
         * @param {Object} opts
         * @returns {FIELD}
         * @private
         */
        _set: function(data, opts) {
            this._value.update(data);

            this._trigger(opts && opts.isInit ? 'init': 'change', opts);

            return this;
        },

        /**
         * Очистить поля модели
         * @param {Object} opts
         * @returns {FIELD}
         */
        clear: function(opts) {
            this._value.clear(opts);

            return this;
        },

        /**
         * Получить модель
         * @returns {MODEL}
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
        }

    });

    provide(MODEL);

});
