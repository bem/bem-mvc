;(function(BEM) {
    var MODEL = BEM.MODEL,
        objects = MODEL._utils.objects;

    MODEL.FIELD.decl('array', {

        /**
         * Определяем дефолтные значения для поля
         * @returns {Object}
         * @private
         */
        _initDefaults: function() {
            this.__base();

            this._default || (this._default = []);

            return this;
        },

        /**
         * Возвращает копию исходного массива, чтобы исключить возможность
         * изменения внутреннего свойства
         * @returns {Array}
         */
        raw: function() {
            return this._raw && this._raw.slice();
        },

        /**
         * Кеширует текущее состояние поля
         * @returns {MODEL.FIELD}
         */
        fixData: function() {
            this._fixedValue = this.raw();

            return this;
        },

        /**
         * Доопределяем нативные методы, чтобы иметь возможность контролировать изменение массива
         * @param {Array} value
         * @returns {Array}
         * @private
         */
        _preprocess: function(value) {
            var _this = this;

            value = value.slice();

            // изменяющие методы
            ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'].forEach(function(name) {
                var nativeFn = value[name];

                value[name] = function() {
                    var args = Array.prototype.slice.call(arguments),
                        res = nativeFn.apply(_this._raw, args);

                    _this._set(_this._raw);

                    if (name == 'push' || name == 'unshift') {
                        _this.trigger('add', { data: args[0] });
                    }

                    if (name == 'pop' || name == 'shift') {
                        _this.trigger('remove', { data: res });
                    }

                    if (name == 'splice') {
                        _this
                            .trigger('add', { data: args.slice(2) })
                            .trigger('remove', { data: res });
                    }

                    _this._trigger('change');

                    return res;
                }
            });

            // неизменяющие методы
            ['map', 'forEach', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'indexOf'].forEach(function(name) {
                var nativeFn = value[name];

                value[name] = function() {
                    return nativeFn.apply(_this._raw, arguments);
                };
            });

            return value;
        },

        /**
         * Внутренний метод выставления значения
         * @param {*} value значение
         * @param {Object} opts доп. параметры
         * @returns {BEM.MODEL.FIELD}
         * @private
         */
        _set: function(value, opts) {
            var defaultValue = this.getDefault();
            this._raw = this.checkEmpty(value) ? defaultValue && defaultValue.slice() : value;
            this._value = (this.params.preprocess || this._preprocess).call(this, this._raw && this._raw.slice());
            this._formatted = (this.params.format || this._format).call(
                this,
                this._value && this._value.slice(),
                this.params.formatOptions || {});

            opts && (opts.value = this._value);
            this._trigger(opts && opts.isInit ? 'init' : 'change', opts);

            return this;
        },

        /**
         * Проверяет что значение не пустое
         * @param value
         * @returns {Boolean}
         */
        checkEmpty: function(value) {
            return objects.isEmpty(value) || value.length == 0;
        },

        /**
         * Проверяет текущее значение поля на пустоту
         * @returns {boolean}
         */
        isEmpty: function() {
            return this.checkEmpty(this._raw) || this.isEqual(this.getDefault());
        },

        /**
         * Форматирует значение поля
         * @param {*} value
         * @param {Object} [options]
         * @returns {String}
         * @private
         */
        _format: function(value, options) {
            return value;
        },

        /**
         * Проверяет, что занчение поля равно переданному значению по содержимому
         * @param value
         */
        isEqual: function(value) {
            var val = this._raw;

            var res = val &&
                Array.isArray(value) &&
                value.length === val.length &&
                Array.prototype.every.call(value, function(item, i) {
                    return val[i] === item;
                });

            return res;
        }

    });
})(BEM);
