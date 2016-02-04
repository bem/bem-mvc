(function(BEM) {
    var MODEL = BEM.MODEL,
        objects = MODEL._utils.objects;

    MODEL.FIELD.decl({ field: 'models-list', baseField: 'inner-events-storage' }, {

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
        _trigger: function(event, opts) {
            var innerField = opts && opts.field;

            return this.__base(event, objects.extend({ innerField: innerField }, opts));
        },

        /**
         * Создает значение поля типа models-list, которое предоставляет методы для работы со списком
         * @param {Object} field контекст текущего поля
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
                // флаг для предотвращения повторного добавления модели в список
                isAdding = false,
                list = {

                /**
                 * Создает модель и инициализирует ее переданными данными
                 * @param {Object} data
                 * @param {Object} opts
                 * @returns {*}
                 * @private
                 */
                _createModel: function(data, opts) {
                    isAdding = true; // устанавливаем флаг для обработчика на событие create

                    var model = data instanceof MODEL ?
                        data :
                        typeof data === 'string' ?
                            MODEL.getOrCreate({ name: field.params.modelName, id: data, parentModel: field.model }, opts) :
                            MODEL.create({ name: field.params.modelName, parentModel: field.model }, data, opts);

                    model
                        .on('change', function(e, data) {
                            field._trigger(
                                'change',
                                objects.extend({
                                    // @deprecated use model instead
                                    data: model,
                                    model: model
                                }, data));
                        })
                        .on('destruct', function(e, data) {
                            list.remove(data.model.id);
                        });

                    isAdding = false;

                    return model;
                },

                /**
                 * Добавляет модель в список
                 * @param {Object} itemData
                 * @param {Object} opts
                 * @returns {*}
                 */
                add: function(itemData, opts) {
                    opts = objects.extend({}, opts, { _fieldName: currentField.name });

                    var model = list._createModel(itemData, opts),
                        index = field._raw.length;

                    field._raw.push(model);

                    currentField._bindFieldEventHandlers(model);

                    field
                        .trigger('add', objects.extend({}, opts, { model: model, index: index }))
                        ._trigger('change', opts);

                    return model;
                },

                /**
                 * Добавляет модель в список по индексу
                 *
                 * @param {Number} index
                 * @param {Object} itemData
                 * @param {Object} opts
                 * @return {*}
                 */
                addByIndex: function(index, itemData, opts) {
                    opts = objects.extend({}, opts, { _fieldName: currentField.name });

                    var model = list._createModel(itemData, opts);

                    field._raw.splice(index, 0, model);

                    currentField._bindFieldEventHandlers(model);

                    field
                        .trigger('add', objects.extend({}, opts, { model: model, index: index }))
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
                    opts = objects.extend({}, opts, { _fieldName: currentField.name });

                    if (typeof index !== 'undefined') {
                        var model = list.getByIndex(index);

                        field._raw.splice(index, 1);

                        currentField._unBindFieldEventHandlers(model);

                        field.trigger('remove', objects.extend({}, opts, { model: model, index: index }));

                        opts.keepModel !== true && model.destruct();

                        field._trigger('change', opts);
                    }
                },

                /**
                 * Очищает список
                 * @param {Object} opts
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
                 * @param {String|Number} id
                 * @returns {BEM.MODEL}
                 */
                getById: function(id) {
                    return list.getByIndex(list._getIndex(id));
                },

                /**
                 * Возвращает порядковый номер модели по id
                 * @param {Number} id
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
                 * @param {Number} i
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
                if (!isAdding && data.model &&
                    list._getIndex(data.model.id) === undefined &&
                    (data._fieldName && data._fieldName === currentField.name)) {

                    list.add(data.model);
                }
            });

            return list;
        },

        /**
         * Закешировать состояние
         * @returns {MODEL.FIELD}
         */
        fixData: function() {
            this._raw.forEach(function(model) {
                model.fix();
            });

            this._fixedValue = this._raw.map(function(model) {
                return model.getFixedValue();
            }, this);

            return this;
        },

        /**
         * Returns if some of inner models was changed
         *
         * @returns {Boolean}
         */
        isChanged: function() {
            var fixedValue = this.getFixedValue();

            return (fixedValue !== undefined && this._value.length() !== fixedValue.length) || this._value.some(function(model, i) {
                return model.isChanged() || !model.isEqual(this.getFixedValue()[i]);
            }, this);
        },

        /**
         * Сравнивает значение поля с переданным значением
         * @param {MODEL.FIELD.types['models-list']|Array} val поле типа models-list или массив
         * @returns {boolean}
         */
        isEqual: function(val) {
            if (!val) return false;

            var isModelList = val instanceof MODEL.FIELD.types['models-list'],
                length;

            isModelList && (val = val.get());
            length = isModelList ? val.length() : val.length;

            return this._value.length() == length && this._value.every(function(item, i) {
                if (val[i] instanceof MODEL && val[i].id !== item.id)
                    return false;

                return item.isEqual(isModelList ? val.getByIndex(i) : val[i]);
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

            this._trigger(opts && opts.isInit ? 'init' : 'change', opts);

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
        },

        /**
         * Правила валидиции для поля типа models-list
         * @returns {Object}
         * @private
         */
        _getValidationRules: function() {
            var field = this;

            return objects.extend(this._commonRules(), {
                /**
                 * валидация каждой из вложенных моделей
                 */
                deep: {
                    value: true,
                    validate: function(curValue, ruleValue, name) {
                        var isValid = true;

                        field._value.forEach(function(model) {
                            isValid &= model.isValid() == ruleValue;
                        });

                        return isValid;
                    }
                }
            });
        }
    });
})(BEM);
