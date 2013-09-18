;(function(MODEL, $) {
    MODEL.FIELD.types.array = $.inherit(MODEL.FIELD, {

        _default: [],

        /**
         * Поверяет равно ли текущее значение поля значению переменной value
         * @param {*} value значение для сравнения с текущим значением
         * @returns {boolean}
         */
        isEqual: function(value) {
            return value === this.get() || this.isEmpty() && this.checkEmpty(value);
        },

        /**
         * Возвращает копию исходного массива, чтобы исключить возможность
         * изменения внутреннего свойства
         * @returns {Array}
         */
        raw: function() {
            return this._raw.slice();
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
         * Проверяет что значение не пустое
         * @param value
         * @returns {Boolean}
         */
        checkEmpty: function(value) {
            return $.isEmptyObject(value) || value.length == 0;
        }

    });
})(BEM.MODEL, jQuery);
