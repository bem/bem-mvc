;(function(MODEL, $) {
    MODEL.FIELD.types.model = $.inherit(MODEL.FIELD.types['inner-events-storage'], {

        /**
         * Инициализация поля
         * @param data
         * @returns {MODEL.FIELD.types.model}
         */
        initData: function(data) {
            //если в data пришла строка - то это id дочерней модели
            if (typeof data === 'string') {
                this._value = MODEL.getOrCreate({ name: this.params.modelName, id: data, parentModel: this.model });
            } else {
                this._value = MODEL.create({ name: this.params.modelName, parentModel: this.model }, data);
            }

            this._initEvents();

            return this;
        },

        /**
         * Инициализирует события на модели
         * @private
         */
        _initEvents: function() {
            this._value.on('change', this._onInnerModelChange, this);
            this._bindFieldEventHandlers(this._value);
        },

        /**
         * Отписывается от событий на модели
         * @private
         */
        _unBindEvents: function() {
            this._value.un('change', this._onInnerModelChange, this);
            this._unBindFieldEventHandlers(this._value);
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
         * Returns if field was changed
         *
         * @return {Boolean}
         */
        isChanged: function() {
            return this._value.isChanged();
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
        },

        /**
         * Повесить обработчик события на поле и на внутреннюю модель
         * @param {String} e
         * @param {Function} fn
         * @param {Object} [ctx]
         */
        on: function(e, fn, ctx) {
            if (e !== 'change') {
                this._pushEventHandler(e, fn, ctx);

                this._value.on(e, fn, ctx);
            }

            return this.__base.apply(this, arguments);
        },

        /**
         * Снять обработчик события с поля и с внутренней модели
         * @param {String} e
         * @param {Function} fn
         * @param {Object} [ctx]
         */
        un: function(e, fn, ctx) {
            this._value.un(e, fn, ctx);

            this._popEventHandler(e, fn, ctx);

            return this.__base.apply(this, arguments);
        },

        /**
         * Уничтожает поле и модель этого поля
         */
        destruct: function() {
            this._unBindEvents();

            this.params.destruct && this._value.destruct();
        }

    });
})(BEM.MODEL, jQuery);
