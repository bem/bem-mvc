;(function(MODEL, $) {
    MODEL.FIELD.types['models-list'] = $.inherit(MODEL.FIELD.types['inner-events-storage'], {

        /**
         * Инициализация поля
         * @param {Object} data
         * @returns {BEM.MODEL.FIELD}
         */
        initData: function(data) {
            this.params['default'] || (this.params['default'] = []);
            this._raw = [];

            this._value = this._createValueObject(this);

            this.__base(data || this.params['default']);

            return this;
        },

        /**
         *
         * @param {String} event
         * @param {Object} opts
         * @returns {BEM.MODEL.FIELD}
         * @private
         */
        _trigger: function (event, opts) {
            var innerField = opts && opts.field;

            return this.__base(event, $.extend({ innerField: innerField }, opts));
        },

        /**
         * Создает значение поля типа models-list, которое предоставляет методы для работы со списком
         * @param field контекст текущего поля
         * @returns {{
         *   _createModel: Function,
         *   add: Function,
         *   remove: Function,
         *   getById: Function,
         *   _getIndex: Function,
         *   getByIndex: Function
         * }}
         * @private
         */
        _createValueObject: function(field) {
            var currentField = this,
                list = {

                /**
                 * Создает модель и инициализирует ее переданными данными
                 * @param data
                 * @returns {*}
                 * @private
                 */
                _createModel: function(data) {
                    var model = data instanceof MODEL ?
                        data :
                        MODEL.create({ name: field.params.modelName, parentModel: field.model }, data);

                    model
                        .on('change', function(e, data) {
                            field._trigger(
                                'change',
                                $.extend({
                                    // @deprecated use model instead
                                    data: model,
                                    model: model
                                }, data));
                        })
                        .on('destruct', function(e, data) {
                            list.remove(data.model.id);
                        });

                    return model;
                },

                /**
                 * Добавляет модель в список
                 * @param itemData
                 * @param opts
                 * @returns {*}
                 */
                add: function(itemData, opts) {
                    var model = list._createModel(itemData);

                    field._raw.push(model);

                    currentField._bindFieldEventHandlers(model);

                    field
                        .trigger('add', $.extend({}, opts, { model: model }))
                        ._trigger('change', opts);

                    return model;
                },

                /**
                 * Добавляет модель в список по индексу
                 *
                 * @param  index
                 * @param  itemData
                 * @param  opts
                 * @return {*}
                 */
                addByIndex: function(index, itemData, opts) {
                    var model = list._createModel(itemData);

                    field._raw.splice(index, 0, model);

                    field
                        .trigger('add', $.extend({}, opts, { model: model, index: index }))
                        ._trigger('change', opts);

                    return model;
                },

                /**
                 * Удаляет модель из списка по id
                 * @param {String} id
                 * @param {Object} opts
                 * @param {Boolean} [opts.keepModel] В значении true не будет вызван метод destruct модели
                 */
                remove: function(id, opts) {
                    var index = list._getIndex(id);
                    opts || (opts = {});

                    if (typeof index !== 'undefined') {
                        var model = list.getByIndex(index);

                        field._raw.splice(index, 1);

                        currentField._unBindFieldEventHandlers(model);

                        field.trigger('remove', $.extend({}, opts, { model: model }));

                        opts.keepModel !== true && model.destruct();

                        field._trigger('change', opts);
                    }
                },

                /**
                 * Очищает список
                 * @param opts
                 */
                clear: function(opts) {
                    var tmp = field._raw.slice();

                    tmp.forEach(function(model) {
                        list.remove(model.id, opts);
                    });

                    if (!opts || !opts.silent)
                        field._trigger('change', opts);
                },

                /**
                 * Возвращает модель из списка по id
                 * @param id
                 * @returns {BEM.MODEL}
                 */
                getById: function(id) {
                    return list.getByIndex(list._getIndex(id));
                },

                /**
                 * Возвращает порядковый номер модели по id
                 * @param id
                 * @returns {Number}
                 * @private
                 */
                _getIndex: function(id) {
                    var index;

                    field._raw.some(function(model, i) {
                        if (model.id == id) {
                            index = i;
                            return true;
                        }
                    });

                    return index;
                },

                /**
                 * Возвращает модель из списка по индексу
                 * @param i
                 * @returns {BEM.MODEL}
                 */
                getByIndex: function(i) {
                    return field._raw[i];
                },

                /**
                 * Возвращает массив моделей, соответствующих заданным парамтрам.
                 * @param {Object} attrs Объект, задающий условия поиска
                 * @returns {Array} Массив моделей
                 */
                where: function(attrs) {
                    if ($.isEmptyObject(attrs) || !attrs) {
                        return [];
                    }
                    return list.filter(function(model) {
                        return Object.keys(attrs).every(function(key) {
                            return attrs[key] === model.get(key);
                        });
                    });
                },

                /**
                 * Возвращает количество элементов
                 * @returns {Number}
                 */
                length: function() {
                    return field._raw.length;
                }
            };

            // расширяем объект стандартными методами массива
            ['map', 'forEach', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'indexOf'].forEach(function(name) {
                var nativeFn = field._raw[name];

                list[name] = function() {
                    return nativeFn.apply(field._raw, arguments);
                };
            });

            MODEL.on({ name: field.params.modelName, parentModel: field.model }, 'create', function(e, data) {
                setTimeout(function() {
                    if (data.model && list._getIndex(data.model.id) === undefined)
                        list.add(data.model);
                }, 0);
            });

            return list;
        },

        /**
         * Закешировать состояние
         * @returns {MODEL.FIELD}
         */
        fixData: function() {
            this._fixedValue = this._raw.map(function(model) {
                return model.toJSON();
            }, this);

            return this;
        },

        /**
         * Returns if some of inner models was changed
         *
         * @returns {Boolean}
         */
        isChanged: function() {
            return this._value.some(function (model) {
                return model.isChanged();
            });
        },

        /**
         * Задать новое значение для поля
         * @param {Array} value
         * @param {Object} opts
         * @returns {_set|*}
         */
        set: function(value, opts) {
            return this._set(value, opts);
        },

        /**
         * Задает значение для поля
         * @param {Array} data
         * @param {Object} opts
         * @returns {MODEL.FIELD}
         * @private
         */
        _set: function(data, opts) {
            this._value.clear({ silent: true });

            this._raw = data.map(function(itemData) {
                return this._value.add(itemData);
            }, this);

            this._trigger(opts && opts.isInit ? 'init': 'change', opts);

            return this;
        },

        /**
         * Повесить обработчик события на поле и на все вложенные модели
         * @param {String} e
         * @param {Function} fn
         * @param {Object} ctx
         */
        on: function(e, fn, ctx) {
            if (e !== 'change') {
                this._pushEventHandler(e, fn, ctx);

                this._raw.forEach(function(model) {
                    model.on(e, fn, ctx);
                });
            }

            this.__base.apply(this, arguments);
        },

        /**
         * Снять обработчик события с поля и со всех вложенных моделей
         * @param {String} e
         * @param {Function} fn
         * @param {Object} ctx
         */
        un: function(e, fn, ctx) {
            this._raw.forEach(function(model) {
                model.un(e, fn, ctx);
            }, this);

            this._popEventHandler(e, fn, ctx);

            this.__base.apply(this, arguments);
        },

        /**
         * Очистить поле и удалить все вложенные модели
         * @param {Object} [opts]
         * @returns {MODEL.FIELD}
         */
        clear: function(opts) {
            this._value.clear(opts);

            return this;
        },

        /**
         * Полчить данные поля
         * @returns {Array}
         */
        toJSON: function() {
            return this._raw.map(function(model) {
                return model.toJSON();
            }, this);
        },

        /**
         * Уничтожить объект и вложенные модели
         */
        destruct: function() {
            this.clear();
        }

    });
})(BEM.MODEL, jQuery);
