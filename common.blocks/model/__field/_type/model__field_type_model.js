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
            this._value = MODEL.create({ name: this.params.modelName, parentModel: this.model }, data);

            this._initEvents();

            return this;
        },

        /**
         * Инициализирует события на модели
         * @private
         */
        _initEvents: function() {
            this._value.on('change', this._onInnerModelChange, this);
        },

        /**
         * Отписывается от событий на модели
         * @private
         */
        _unBindEvents: function() {
            this._value.un('change', this._onInnerModelChange, this);
        },

        /**
         * Обрабатывает изменения модели, генерирует событие на родительской модели
         * @private
         */
        _onInnerModelChange: function() {
            this._trigger('change', { fields: this._value.changed });
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
         * @param {Object|BEM.MODEL} data
         * @param {Object} opts
         * @returns {FIELD}
         * @private
         */
        _set: function(data, opts) {
            if (data instanceof MODEL) {
                if (data.name === this.params.modelName) {
                    this._unBindEvents();
                    this.params.destruct && opts.destruct !== false && this._value.destruct();

                    this._value = data;
                    this._initEvents();
                } else {
                    throw new Error('incorrect model "' + data.name +  '", expected model "' +
                        this.params.modelName +  '"');
                }
            } else {
                this._value.update(data);
            }

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
        },

        /**
         * Уничтожает поле и модель этого поля
         */
        destruct: function() {
            this._unBindEvents();

            this.params.destruct && this._value.destruct();
        }

    });

    provide(MODEL);

});
