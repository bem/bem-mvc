modules.define(
    'model',
    ['inherit', 'objects'],
    function(provide, inherit, objects, MODEL) {


    MODEL.FIELD.types['models-list'] = inherit(MODEL.FIELD, {

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
         * Создает значение поля типа models-list, которое предоставляет методы для работы со списком
         * @param field контекст текущего поля
         * @returns {{
         * _createModel: Function,
         * add: Function,
         * remove: Function,
         * getById: Function,
         * _getIndex: Function,
         * getByIndex: Function
         * }}
         * @private
         */
        _createValueObject: function(field) {
            var list = {

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
                        .on('change', function() {
                            field._trigger('change', { data: model });
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

                    field
                        .trigger('add', objects.extend({}, opts, { model: model }))
                        ._trigger('change', opts);

                    return model;
                },

                /**
                 * Добавляет модель в список по индексу
                 *
                 * @param index
                 * @param itemData
                 * @param opts
                 * @return {*}
                 */
                addByIndex: function(index, itemData, opts) {
                    var model = list._createModel(itemData);

                    field._raw.splice(index, 0, model);

                    field
                        .trigger('add', objects.extend({}, opts, { model: model, index: index }))
                        ._trigger('change', opts);

                    return model;
                },

                /**
                 * Удаляет модель из списка по id
                 * @param id
                 * @param opts
                 */
                remove: function(id, opts) {
                    var index = list._getIndex(id);

                    if (index !== undefined) {
                        var model = list.getByIndex(index);

                        field._raw.splice(index, 1);
                        field.trigger('remove', objects.extend({}, opts, { model: model }));
                        model.destruct();

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
                        model.destruct()
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
                    if (objects.isEmpty(attrs) || !attrs) {
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
         * Очистить поле и удалить все вложенные модели
         * @param {Object} [opts]
         * @returns {MODEL.FIELD}
         */
        clear: function(opts) {
            this._value.clear();

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

    provide(MODEL);

});
