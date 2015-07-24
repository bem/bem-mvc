;(function(BEM) {
    var MODEL = BEM.MODEL,
        utils =  BEM.MODEL._utils,
        inherit = utils.inherit,
        observable = utils.observable,
        objects = utils.objects,
        functions = utils.functions;

    /**
     * @namespace
     * @name BEM.MODEL.FIELD
     */
    MODEL.FIELD = inherit(observable, {

        /**
         * @class Конструктор поля модели
         * @constructs
         * @param {Object} params
         * @param {BEM.MODEL} model
         * @private
         */
        __constructor: function(params, model) {
            this.params = params || {};
            this.model = model;
            this.name = params.name;
            this._type = params.type;

            this._init();
        },

        /**
         * Вспомогательная функция для генерации события на поле и на модели
         * На модели генерируется событие с приставкой field-[имя события]
         * @param {String} event имя события
         * @param {Object} opts доп. параметры
         * @returns {BEM.MODEL.FIELD}
         * @private
         */
        _trigger: function(event, opts) {
            opts = objects.extend({}, opts, { field: this.name });

            this.model.trigger('field-' + event, opts);
            this.trigger(event, opts);

            return this;
        },

        /**
         * Инициализация поля
         * @returns {BEM.MODEL.FIELD}
         * @private
         */
        _init: function() {
            this._initDefaults();

            return this;
        },

        /**
         * Определяем дефолтные значения для поля
         * @returns {Object}
         * @private
         */
        _initDefaults: function() {
            this._default = this.params['default'] !== undefined ? this.params['default'] : this._default;
            this._validationRules = this._getValidationRules();

            return this;
        },

        /**
         * Инициализирует поле занчением
         * @param {*} value инициализационное значение
         * @returns {Object}
         */
        initData: function(value) {
            this
                .set(value, { isInit: true })
                .fixData();

            return this;
        },

        /**
         * Кешериуем текущее состояние
         * @returns {BEM.MODEL.FIELD}
         */
        fixData: function() {
            this._fixedValue = this.get();

            return this;
        },

        /**
         * Восстанавливает закешированое значение поля
         * @returns {BEM.MODEL.FIELD}
         */
        rollback: function() {
            this.set(this._fixedValue, { rollback: true });

            return this;
        },

        /**
         * Устанавливает значение поля
         * @param {*} value значение для установки
         * @param {Object} [opts] доп. параметры доступные в обработчике события change
         * @returns {BEM.MODEL.FIELD}
         */
        set: function(value, opts) {
            if (!(opts && opts.isInit) && this.isEqual(value)) return this;

            return this._set(value, opts);
        },

        /**
         * Внутренний метод выставления значения
         * @param {*} value значение
         * @param {Object} opts доп. параметры
         * @returns {BEM.MODEL.FIELD}
         * @private
         */
        _set: function(value, opts) {
            this._raw = this.checkEmpty(value) ? this.getDefault() : value;
            this._value = (this.params.preprocess || this._preprocess).call(this, this._raw);
            this._formatted = (this.params.format || this._format).call(this, this._value, this.params.formatOptions || {});

            if (opts)
                opts.value = this._value;
            else
                opts = { value: this._value };

            this._trigger(opts && opts.isInit ? 'init' : 'change', opts);
            
            return this;
        },

        /**
         * Выставляет пустое или дефолтное (если указано) значение поля
         * @param {Object} [opts] доп. параметры
         * @returns {BEM.MODEL.FIELD}
         */
        clear: function(opts) {
            this.set(undefined, opts);

            return this;
        },

        /**
         * Возвращает текущее значение поля
         * @returns {*}
         */
        get: function() {
            return this._value;
        },

        /**
         * Проверяет, что значение является NaN, не используя приведение типов.
         * @param {*} v Значение.
         * @returns {boolean}
         */
        isNaN: function(v) {
            // Такой способ позволяет точно выявить NaN константу
            // в то время как глобальный isNaN использует приведение и вернет
            // true при вычислении window.isNaN('hello')
            return v != v;
        },

        /**
         * Поверяет равно ли текущее значение поля значению переменной value
         * @param {*} value значение для сравнения с текущим значением
         * @returns {boolean}
         */
        isEqual: function(value) {
            value = (this.params.preprocess || this._preprocess).call(this, value); // fixme: preprocess выполняется 2 разе при вызове _set
            return value === this.get() ||
                this.isEmpty() && this.checkEmpty(value) ||
                this.isNaN(value) && this.isNaN(this.get());
        },

        /**
         * Проверка значения value на пустоту
         * @param {*} value значение
         * @returns {boolean}
         */
        checkEmpty: function(value) {
            return value == undefined || !!(value + '').match(/^\s*$/);
        },

        /**
         * Менялось ли значение поля с момента последней фиксации начального состояния
         * @returns {boolean}
         */
        isChanged: function() {
            return !this.isEqual(this.getFixedValue());
        },

        /**
         * Возвращает начальное значение поля
         * @returns {*}
         */
        getFixedValue: function() {
            return typeof this._fixedValue !== 'undefined' ? this._fixedValue : this.getDefault();
        },

        /**
         * Возвращает дефолтное значение поля
         * @returns {*}
         */
        getDefault: function() {
            return typeof this._default === 'function' ? this._default.call(this.model) : this._default;
        },

        /**
         * Возвращает тип данного поля
         * @returns {String}
         */
        getType: function() {
            return this._type;
        },

        /**
         * Проверяет текущее значение поля на пустоту
         * @returns {boolean}
         */
        isEmpty: function() {
            return this.checkEmpty(this._raw) || this._raw === this.getDefault();
        },

        /**
         * Возвращает текущее значение поля без применённых к нему обработок
         * @returns {*}
         */
        raw: function() {
            return this._raw;
        },

        /**
         * Возвращает значение поля, отформатированное для вывода на печать
         * @returns {String}
         */
        format: function() {
            return this._formatted;
        },

        /**
         * Форматирует значение поля
         * @param {*} value
         * @param {Object} [options]
         * @returns {String}
         * @private
         */
        _format: function(value, options) {
            return '' + value;
        },

        /**
         * Возвращает значение пригодное для сериализации
         * @returns {Object}
         */
        toJSON: function() {
            var fieldDecl = this.model.fieldsDecl[this.name];

            if (fieldDecl.calculate && !fieldDecl.dependsFrom) {
                return fieldDecl.calculate.call(this.model);
            }

            return this.get();
        },

        /**
         * Предобрабатывает значение поля перед записью
         * @param {*} value
         * @returns {*}
         * @private
         */
        _preprocess: function(value) {
            return value;
        },

        /**
         * Возвращает результат проверки поля на валидность
         * @returns {boolean}
         */
        isValid: function() {
            return this.validate() === true;
        },

        /**
         * Общие правила валидации
         * @private
         */
        _commonRules: function() {
            var field = this;

            return {
                required: {
                    value: true,
                    /**
                     * Функция валидации, вызывается в контексте модели
                     * @param {*} curValue текущее значение
                     * @param {*} ruleValue заданное значение в правиле валидации
                     * @param {String} [name] имя поля
                     * @returns {Boolean}
                     */
                    validate: function(curValue, ruleValue, name) {
                        return field.checkEmpty(curValue) !== ruleValue;
                    }
                }
            }
        },

        /**
         * Возвращает стандартные правила валидации
         * @returns {*}
         * @private
         */
        _getValidationRules: function() {
            return this._commonRules();
        },

        /**
         * Проверяет поле на валидность
         * @returns {*}
         */
        validate: function() {
            if (!this.params.validation) return true;

            var _this = this,
                getOrExec = function(obj, ruleValue) {
                    return functions.isFunction(obj) ? obj.call(_this.model, _this.get(), ruleValue, _this.name) : obj;
                },
                validation = getOrExec(this.params.validation),
                invalidRules = [];

            if (getOrExec(validation.needToValidate) === false) return true;

            if (validation.validate) {
                if (getOrExec(validation.validate)) {
                    return true;
                } else {
                    var invalidRule = {
                        text: getOrExec(validation.text)
                    };

                    this._trigger('error', invalidRule);
                    return { valid: false, invalidRules: [invalidRule] };
                }
            }

            if (validation.rules) {
                objects.each(validation.rules, function(ruleParams, ruleName) {
                    ruleParams = getOrExec(ruleParams);
                    ruleParams = typeof ruleParams === 'object' ? ruleParams : { value: ruleParams };

                    var rule = objects.extend({}, _this._validationRules[ruleName], ruleParams),
                        invalidRule;

                    if (getOrExec(rule.needToValidate) === false) return true;

                    if (!getOrExec(rule.validate, getOrExec(rule.value))) {
                        invalidRule = {
                            rule: ruleName,
                            text: getOrExec(rule.text)
                        };
                        invalidRules.push(invalidRule);

                        _this._trigger('error', invalidRule);
                    }
                });
            }

            return invalidRules.length ?
                { valid: false, invalidRules: invalidRules } :
                true;
        },

        destruct: function() {}

    }, {

        /**
         * Хранилище модификаций класса
         */
        types: {},

        /**
         * Декларирует новый тип поля
         * @param type
         * @param fieldDecl
         * @returns {*}
         */
        decl: function(type, fieldDecl) {
            if (typeof type === 'string') {
                type = { field: type };
            }

            return MODEL.FIELD.types[type.field] = inherit(MODEL.FIELD.types[type.baseField] || MODEL.FIELD, fieldDecl);
        },

        /**
         * Создает поле модели
         * @param {String} name имя поля
         * @param {Object} params параметры
         * @param {BEM.MODEL} model экземпляр модели в которой создается поле
         * @returns {*}
         */
        create: function(name, params, model) {
            if (typeof params == 'string') params = { type: params };
            params.name = name;

            return new (MODEL.FIELD.types[params.type] || MODEL.FIELD)(params, model);
        }

    });

})(BEM);
