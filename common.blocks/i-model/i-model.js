;(function(BEM, $, undefined) {

    var changesTimeout = 500,
        CHILD_SEPARATOR = '.',
        ID_SEPARATOR = ':',
        MODELS_SEPARATOR = ',',
        ANY_ID = '*',
        modelsGroupsCache = {},
        constructorsCache = {};

    /**
     * @namespace
     * @name BEM.MODEL
     */
    var MODEL = BEM.MODEL = $.inherit($.observable, {

        /**
         * Минимальное время между событиями на модели
         */
        changesTimeout: changesTimeout,

        /**
         * @class Конструктор модели
         * @constructs
         * @param {String|Object} modelParams параметры модели
         * @param {String} modelParams.name имя модели
         * @param {String|Number} [modelParams.id] идентификатор модели
         * @param {String} [modelParams.parentName] имя родительской модели
         * @param {String} [modelParams.parentPath] путь родительской модели
         * @param {Object} [modelParams.parentModel] экземпляр родительской модели
         * @param {Object} [data] данные для инициализации полей модели
         * @returns {BEM.MODEL}
         * @private
         */
        __constructor: function(modelParams, data) {
            this.name = modelParams.name;
            this.id = modelParams.id;
            this._path = MODEL.buildPath(modelParams);
            this.changed = [];

            /**
             * Генерирует событие change на модели
             * @type {*}
             */
            this.fireChange = $.throttle(this._fireChange, this.changesTimeout, this);

            /**
             * Debounce триггер на модели
             * @type {*}
             */
            this.debounceTrigger = $.debounce(function(name, data) {
                this.trigger(name, data);
            }, this.changesTimeout, false, this);

            this._initFields(data || {});

            return this;
        },

        /**
         * Возвращает путь модели
         * @returns {String}
         */
        path: function() {
            return this._path;
        },

        /**
         * Инициализирует поля модели
         * @param {Object} data данные для инициализации полей модели
         * @returns {BEM.MODEL}
         * @private
         */
        _initFields: function(data) {
            var name = this.name,
                decl = MODEL.decls[name],
                _this = this;

            this.fieldsDecl = decl;
            this.fields = {};

            this
                .on('field-init', function(e, data) {
                    if (!this.fieldsDecl[data.field].calculate)
                        return _this._calcDependsTo(data.field, data);
                })
                .on('field-change', function(e, data) {
                    return _this._onFieldChange(data.field, data);
                });

            $.each(this.fieldsDecl, function(name, props) {
                _this.fields[name] = MODEL.FIELD.create(name, props, _this);
            });

            data && $.each(this.fields, function(name, field) {
                var fieldDecl = _this.fieldsDecl[name];

                data && !fieldDecl.calculate &&
                    field.initData(typeof data[name] !== 'undefined' ? data[name] : fieldDecl.value);
            });

            this.trigger('init');

            return this;
        },

        /**
         * Вычиляет заначения зависимых полей
         * @param {String} name имя поля
         * @param {Object} opts дополнительные парметры доступные в обработчиках событий
         * @returns {BEM.MODEL}
         * @private
         */
        _calcDependsTo: function(name, opts) {
            var fieldsDecl = this.fieldsDecl[name],
                _this = this;

            fieldsDecl && fieldsDecl.dependsTo && $.each(fieldsDecl.dependsTo, function(i, childName) {
                var fieldDecl = _this.fieldsDecl[childName],
                    field = _this.fields[childName],
                    val;

                if (field && fieldDecl.calculate && fieldDecl.dependsFrom) {
                    val = fieldDecl.dependsFrom.length > 1 ? fieldDecl.dependsFrom.reduce(function(res, name) {
                        res[name] = _this.fields[name].get();

                        return res;
                    }, {}) : _this.fields[fieldDecl.dependsFrom[0] || fieldDecl.dependsFrom].get();

                    _this.set(childName, fieldDecl.calculate.call(_this, val), opts);
                }

            });

            return this;
        },

        /**
         * Возвращает значение поля
         * @param {String} name
         * @param {String} [type] формат предтавления значения. по умолчанию вызывается get, либо raw/formatted
         * @returns {*}
         */
        get: function(name, type) {
            if (!type) type = 'get';

            var fieldDecl = this.fieldsDecl[name],
                method = {
                    raw: 'raw',
                    format: 'format',
                    formatted: 'format',
                    get: 'get'
                }[type];

            if (this.hasField(name) && method) {
                if (fieldDecl.calculate && !fieldDecl.dependsFrom)
                    return fieldDecl.calculate.call(this);

                return this.fields[name][method]();
            }
        },

        /**
         * Задает значение полю модели
         * @param {String} name имя поля
         * @param {*} value значение
         * @param {Object} [opts] дополнительные парметры доступные в обработчиках событий change
         * @returns {BEM.MODEL}
         */
        set: function(name, value, opts) {
            var field = this.fields[name],
                fieldsScheme = this.fieldsDecl[name];

            opts = $.extend({}, opts, { value: value });

            if (!field || !fieldsScheme) return this;

            if (!field.isEqual(value)) {
                field[opts.isInit ? 'initData' : 'set'](value, opts);
            }

            return this;
        },

        /**
         * Очищает поля модели
         * @param {String} [name] имя поля
         * @param {Object} [opts] дополнительные парметры доступные в обработчиках событий change
         * @returns {BEM.MODEL}
         */
        clear: function(name, opts) {
            if (typeof name === 'string') {
                this.fields[name].clear(opts);
            } else {
                opts = name;

                $.each(this.fields, function(fieldName, field) {
                    if (field.getType() !== 'id' && !this.fieldsDecl[fieldName].calculate)
                        field.clear(opts);
                }.bind(this));
            }

            this.trigger('clear', opts);

            return this;
        },

        /**
         * Задает поля модели по данным из объекта, генерирует событие update на модели
         * @param {Object} data данные устанавливаемые в модели
         * @param {Object} [opts] доп. параметры
         * @returns {BEM.MODEL}
         */
        update: function(data, opts) {
            var _this = this;

            $.each(data, function(name, val) {
                _this.set(name, val, opts);
            });

            this.trigger('update', opts);

            return this;
        },

        /**
         * Проверяет наличие поля у модели
         * @param {String} name имя поля
         * @returns {boolean}
         */
        hasField: function(name) {
            return !!this.fields[name];
        },

        /**
         * Проверяет поле или всю модель на пустоту
         * @param {String} [name]
         */
        isEmpty: function(name) {
            if (name) {
                return this.fields[name].isEmpty();
            } else {
                var isEmpty = true;
                $.each(this.fields, function(fieldName, field) {
                    isEmpty &= field.isEmpty();
                });

                return !!isEmpty;
            }
        },

        /**
         * Проверяет, изменилось ли значение поля или любого из полей с момента последней фиксации
         * @param {String} [name] имя поля
         * @returns {Boolean}
         */
        isChanged: function(name) {
            if (name) {
                return this.fields[name].isChanged();
            } else {
                var isChanged = false;
                $.each(this.fields, function(fieldName, field) {
                    isChanged |= field.isChanged();
                });

                return !!isChanged;
            }
        },

        /**
         * Возвращает тип поля
         * @param {String} name имя поля
         * @returns {String}
         */
        getType: function(name) {
            if (this.hasField(name))
                return this.fields[name].getType();
        },

        /**
         * Кеширует значения полей модели, генерирует событие fix на модели
         * @param {Object} [opts] доп. параметры
         * @returns {BEM.MODEL}
         */
        fix: function(opts) {
            $.each(this.fields, function(fieldName, field) {
                field.fixData(opts);
            });

            this.trigger('fix', opts);

            return this;
        },

        /**
         * Восстанавливает значения полей модели из кеша, генерирует событие update на модели
         * @param {Object} [opts] доп. параметры
         * @returns {BEM.MODEL}
         */
        rollback: function(opts) {
            $.each(this.fields, function(fieldName, field) {
                field.rollback(opts);
            });

            this.trigger('rollback', opts);

            return this;
        },

        /**
         * Возвращает объект с данными модели
         * @returns {Object}
         */
        toJSON: function() {
            var res = {},
                _this = this;

            $.each(this.fields, function(fieldName, field) {
                if (!_this.fieldsDecl[fieldName].internal)
                    res[fieldName] = field.toJSON();
            });

            return res;
        },

        /**
         * Возвращает объект с фиксированными значениями полей
         * @returns {Object}
         */
        getFixedValue: function() {
            var res = {};

            $.each(this.fields, function(fieldName, field) {
                res[fieldName] = field.getFixedValue();
            });

            return res;
        },

        /**
         * Назначает обработчик события на модель или поле модели
         * @param {String} [field] имя поля
         * @param {String} e имя события
         * @param {Object} [data] дополнительные данные события
         * @param {Function} fn обработчик события
         * @param {Object} ctx контекст вызова обработчика
         * @returns {BEM.MODEL}
         */
        on: function(field, e, data, fn, ctx) {
            if ($.isFunction(e)) {
                ctx = fn;
                fn = data;
                data = e;
                e = field;
                field = undefined;
            }
            
            !field ?
                this.__base(e, data, fn, ctx) :
                field.split(' ').forEach(function(name) {
                    this.fields[name].on(e, data, fn, ctx);
                }, this);

            return this;
        },

        /**
         * Удаляет обработчик события с модели или поля модели
         * @param {String} [field] имя поля
         * @param {String} e имя события
         * @param {Function} fn обработчик события
         * @param {Object} ctx контекст вызова обработчика
         * @returns {BEM.MODEL}
         */
        un: function(field, e, fn, ctx) {
            if ($.isFunction(e)) {
                ctx = fn;
                fn = e;
                e = field;
                field = undefined;
            }

            !field ?
                this.__base(e, fn, ctx) :
                field.split(' ').forEach(function(name) {
                    this.fields[name].un(e, fn, ctx);
                }, this);

            return this;
        },

        /**
         * Тригерит обработчик события на модели или поле модели
         * @param {String} [field] имя поля
         * @param {String} e имя события
         * @param [data] данные доступные в обработчике события
         * @returns {BEM.MODEL}
         */
        trigger: function(field, e, data) {
            if (!(typeof field == 'string' && typeof e == 'string')) {
                data = e;
                e = field;
                field = undefined;
            }

            !field ?
                this.__base(e, data) :
                field.split(' ').forEach(function(name) {
                    this.fields[name].trigger(e, data);
                }, this);

            return this;
        },

        /**
         * Тригерит (с декоратором $.throttle) событие change на модели при изменении полей
         * @param {String} name имя поля
         * @param {Object} opts доп. параметры
         * @returns {BEM.MODEL}
         * @private
         */
        _onFieldChange: function(name, opts) {
            if (this.changed.indexOf(name) == -1) this.changed.push(name);
            this.fieldsDecl[name].calculate || this._calcDependsTo(name, opts);
            this.fireChange(opts);

            return this;
        },

        /**
         * Сгенерировать событие change на модели
         * @param {Object} opts
         * @private
         */
        _fireChange: function(opts) {
            this.trigger('change', $.extend({}, opts, { changedFields: this.changed }));
            this.changed = [];
        },

        /**
         * Удаляет модель из хранилища
         */
        destruct: function() {
            this.__self.destruct(this);
        },

        /**
         * Возвращает результат проверки модели на валидность
         * @returns {boolean}
         */
        isValid: function() {
            return !!this.validate().valid;
        },

        /**
         * Проверяет модель на валидность, генерирует событие error с описанием ошибки(ок)
         * @param {String} [name] - имя поля
         * @returns {Object}
         */
        validate: function(name) {
            var _this = this,
                res = {},
                validateRes;

            if (name) {
                validateRes = this.fields[name].validate();
                if (validateRes !== true) {
                    res.errorFields = [name];
                    res.errors = validateRes.invalidRules;
                }
            } else {
                $.each(this.fieldsDecl, function(name) {
                    validateRes = _this.fields[name].validate();
                    if (validateRes !== true) {
                        (res.errorFields || (res.errorFields = [])).push(name);
                        res.errors = (res.errors || []).concat(validateRes.invalidRules);
                        (res.errorsData || (res.errorsData = {}))[name] = validateRes.invalidRules;
                    }
                });
            }

            if (!res.errors)
                res.valid = true;
            else
                this.trigger('error', res);

            this.trigger('validated', res);

            return res;
        },

        /**
         * Сравнивает значение модели с переданным значением
         * @param {BEM.MODEL|Object} val модель или хеш
         * @returns {boolean}
         */
        isEqual: function(val) {

            if (!val) return false;

            var isComparingValueModel = val instanceof BEM.MODEL,
                selfFieldNames = Object.keys(this.fields),
                fieldNamesToCompare = Object.keys(isComparingValueModel ? val.fields : val);

            if (selfFieldNames.length != fieldNamesToCompare.length) return false;

            return !selfFieldNames.some(function(fieldName) {
                return !this.fields[fieldName].isEqual(isComparingValueModel ? val.get(fieldName) : val[fieldName]);
            }, this);
        }

    }, /** @lends BEM.MODEL */ {

        /**
         * Харанилище экземпляров моделей
         */
        models: {},

        /**
         * Хранилище деклараций
         */
        decls: {},

        /**
         * Хранилище данных для моделей
         */
        modelsData: {},

        /**
         * Хранилища обработчиков событий на моделях и полях
         */
        modelsTriggers: {},
        fieldsTriggers: {},

        /**
         * Декларирует описание модели
         * @static
         * @protected
         * @param {String|Object} decl
         * @param {String} decl.model|decl.name
         * @param {String} [decl.baseModel]
         * @param {{
         *     XXX: {String|Number},
         *     XXX: {
         *         {String} [type] тип поля
         *         {Boolean} [internal] внутреннее поле
         *         {*|Function} [default] дефолтное значение
         *         {*|Function} [value] начанольное значение
         *         {Object|Function} [validation] ф-ия конструктор объекта валидации или он сам
         *         {Function} [format] ф-ия форматирования
         *         {Function} [preprocess] ф-ия вызываемая до записи значения
         *         {Function} [calculate] ф-ия вычисления значения, вызывается, если изменилось одно из связанных полей
         *         {String|Array} [dependsFrom] массив от которых зависит значение поля
         *     }
         * }} fields где ключ имя поля, значение строка с типом или объект вида
         * @param {Object} staticProps Статические методы и поля
         */
        decl: function(decl, fields, staticProps) {
            if (typeof decl == 'string') {
                decl = { model: decl };
            } else if (decl.name) {
                decl.model = decl.name;
            }

            $.each(fields, function(name, props) {
                if (typeof props == 'string')
                    fields[name] = { type: props };
            });

            if (decl.baseModel) {
                if (!MODEL.models[decl.baseModel])
                    throw('baseModel "' + decl.baseModel + '" for "' + decl.model + '" is undefined');

                fields = $.extend(true, {}, MODEL.decls[decl.baseModel], fields);
            }

            MODEL.models[decl.model] = {};
            MODEL.decls[decl.model] = fields;

            MODEL.checkModelDecl(decl, fields, staticProps);

            constructorsCache[decl.model] = $.inherit(constructorsCache[decl.baseModel] || MODEL, staticProps);

            MODEL._buildDeps(fields, decl.model);

            return this;
        },

        /**
         * Проверяет валидность декларации модели
         * @static
         * @protected
         * @param {Object} decl
         * @param {Object} fields
         * @param {Object} staticProps
         */
        checkModelDecl: function (decl, fields, staticProps) {
            staticProps && $.each(staticProps, function(name) {
                if (name in MODEL.prototype) throw new Error('method "' + name + '" is protected');
            });
        },

        /**
         * Устанавливает связи между зависимыми полями
         * @param {Object} fieldDecl декларация полей
         * @param {String} modelName имя модели
         * @private
         */
        _buildDeps: function(fieldDecl, modelName) {
            var fieldNames = Object.keys(fieldDecl),
                deps = {};

            function pushDeps(fields, toPushDeps) {
                fields = Array.isArray(fields) ? fields : [fields];
                fields.forEach(function(field) {
                    if (!fieldDecl[field])
                        throw Error('in model "' + modelName + '" depended field "' + field +'" is not declared');
                    if (toPushDeps.indexOf(field) !== -1)
                        throw Error('in model "' + modelName + '" circle fields dependence: ' +
                            toPushDeps.concat(field).join(' -> '));

                    var fieldDeps = (deps[field] || (deps[field] = []));

                    fieldDeps.push.apply(fieldDeps, toPushDeps.filter(function(name) {
                        return fieldDeps.indexOf(name) === -1
                    }));

                    fieldDecl[field].dependsFrom &&
                        pushDeps(fieldDecl[field].dependsFrom, toPushDeps.concat(field));
                });
            }

            fieldNames.forEach(function(fieldName) {
                var field = fieldDecl[fieldName];

                if (field.dependsFrom && !$.isArray(field.dependsFrom))
                    field.dependsFrom = [field.dependsFrom];

                deps[fieldName] || field.dependsFrom && pushDeps(field.dependsFrom, [fieldName]);
            });

            fieldNames.forEach(function(fieldName) {
                if (deps[fieldName])
                    fieldDecl[fieldName].dependsTo = deps[fieldName].sort(function(a, b) {
                        var bDeps = deps[b] || [];
                        var aDeps = deps[a] || [];

                        if (bDeps.indexOf(a) > -1) {
                            return 1;
                        } else if (aDeps.indexOf(b) > -1) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
            });

        },

        /**
         * Создает экземпляр модели
         * @protected
         * @param {String|Object} modelParams имя модели или параметры модели
         * @param {String} modelParams.name имя модели
         * @param {String|Number} [modelParams.id] идентификатор, если не указан, создается автоматически
         * @param {String} [modelParams.parentName] имя родительской модели
         * @param {String|Number} [modelParams.parentId] идентификатор родительской модели
         * @param {String} [modelParams.parentPath] путь родительской модели
         * @param {Object} [modelParams.parentModel] экземпляр родительской модели
         * @param {Object} [data] данные, которыми будет проинициализирована модель
         * @returns {BEM.MODEL}
         */
        create: function(modelParams, data) {
            if (typeof modelParams === 'string') modelParams = { name: modelParams };

            var decl = MODEL.decls[modelParams.name];

            if (!decl)
                throw new Error('unknown model: "' + modelParams.name + '"');

            // выставляем id из поля типа 'id' или из декларации
            $.each(decl, function(name, field) {
                if (field.type === 'id')
                    modelParams.id = (data && data[name]);
            });

            if (typeof modelParams.id === 'undefined')
                modelParams.id = $.identify();

            // создаем модель
            var model = new (constructorsCache[modelParams.name] || MODEL)(modelParams, data);

            MODEL._addModel(model);
            model.trigger('create', { model: model });

            return model;
        },

        /**
         * Возвращает экземляр или массив экземпляров моделей по имени и пути
         * @protected
         * @param {String|Object} modelParams имя модели или параметры модели
         * @param {String} modelParams.name имя модели
         * @param {String|Number} [modelParams.id] идентификатор, если не указан, создается автоматически
         * @param {String} [modelParams.path] путь модели
         * @param {String} [modelParams.parentName] имя родительской модели
         * @param {String|Number} [modelParams.parentId] идентификатор родительской модели
         * @param {String} [modelParams.parentPath] путь родительской модели
         * @param {Object} [modelParams.parentModel] экземпляр родительской модели
         * @param {Boolean} [dropCache] Не брать значения из кеша
         * @returns {BEM.MODEL[]|Array}
         */
        get: function(modelParams, dropCache) {
            if (typeof modelParams == 'string') modelParams = { name: modelParams };
            modelParams = $.extend({}, modelParams);

            if (typeof modelParams.id === 'undefined') modelParams.id = ANY_ID;

            var name = modelParams.name,
                modelsByName = MODEL.models[name],
                models = [],
                modelsCacheByName = modelsGroupsCache[name],

                path = modelParams.path || MODEL.buildPath(modelParams),
                paths = path.split(MODELS_SEPARATOR);

            if (!MODEL.decls[name])
                throw('model "' + name + '" is not declared');

            if (!dropCache && modelsCacheByName && modelsCacheByName[path]) return modelsCacheByName[path].slice();

            for (var ip = 0, np = paths.length; ip < np; ip++) {
                var pathRegexp = MODEL._getPathRegexp(paths[ip]);

                for (var mPath in modelsByName) {
                    if (modelsByName.hasOwnProperty(mPath) && modelsByName[mPath] !== null && (new RegExp(pathRegexp, 'g')).test(mPath))
                        models.push(modelsByName[mPath]);
                }
            }

            modelsCacheByName || (modelsGroupsCache[name] = {});
            modelsGroupsCache[name][path] = models.slice();

            return models;
        },

        /**
         * Возвращает экземпляр модели по имени или пути
         * @param {Object|String} modelParams @see get.modelParams
         * @param {Boolean} dropCache @see get.dropCache
         * @returns {BEM.MODEL|undefined}
         */
        getOne: function(modelParams, dropCache) {
            return this.get(modelParams, dropCache).pop();
        },

        /**
         * Возвращает созданный или создает экземпляр модели
         * @param {Object|String} modelParams @see get.modelParams
         * @returns {BEM.MODEL|undefined}
         */
        getOrCreate: function(modelParams) {
            if (typeof modelParams === 'string') modelParams = { name: modelParams };
            var modelData = MODEL.modelsData[modelParams.name];

            return MODEL.getOne(modelParams) || MODEL.create(
                modelParams,
                modelData && modelData[MODEL.buildPath(modelParams)] || {});
        },

        /**
         * Назначает глобальный обработчик событий на экземпляры моделей по пути
         * @param {String|Object} modelParams Имя модели или параметры описываеющие path модели
         * @param {String} [field] имя поля
         * @param {String} e имя события
         * @param {Function} fn обработчик события
         * @param {Object} [ctx] контекст выполнения обработчика
         * @returns {BEM.MODEL}
         */
        on: function(modelParams, field, e, fn, ctx) {
            if ($.isFunction(e)) {
                ctx = fn;
                fn = e;
                e = field;
                field = undefined;
            }

            if (typeof modelParams == 'string') modelParams = { name: modelParams };

            var modelName = modelParams.name,
                eventPath = MODEL.buildPath(modelParams),
                triggers = !field ?
                    MODEL.modelsTriggers[modelName] || (MODEL.modelsTriggers[modelName] = {}) :
                    (MODEL.fieldsTriggers[modelName] || (MODEL.fieldsTriggers[modelName] = {})) &&
                        MODEL.fieldsTriggers[modelName][field] || (MODEL.fieldsTriggers[modelName][field] = {});

            e.split(' ').forEach(function(event) {
                (triggers[event] || (triggers[event] = [])).push({
                    name: modelName,
                    path: eventPath,
                    field: field,
                    fn: fn,
                    ctx: ctx
                });
            });

            MODEL.forEachModel(function() {
                this.on(field, e, fn, ctx);
            }, modelParams, true);

            return this;
        },

        /**
         * Удаляет глобальный обработчик событий на экземпляры моделей по пути
         * @param {String|Object} modelParams Имя модели или параметры описываеющие path модели
         * @param {String} [field] имя поля
         * @param {String} e имя события
         * @param {Function} fn обработчик события
         * @param {Object} [ctx] контекст выполнения обработчика
         * @returns {BEM.MODEL}
         */
        un: function(modelParams, field, e, fn, ctx) {
            if ($.isFunction(e)) {
                ctx = fn;
                fn = e;
                e = field;
                field = undefined;
            }

            if (typeof modelParams == 'string') modelParams = { name: modelParams };

            var modelName = modelParams.name,
                eventPath = MODEL.buildPath(modelParams),
                triggers = !field ?
                    MODEL.modelsTriggers[modelName] :
                    MODEL.fieldsTriggers[modelName] && MODEL.fieldsTriggers[modelName][field];

            e.split(' ').forEach(function(event) {
                var pos;

                triggers[event] && $.each(triggers[event], function(i, event) {
                    if (event.path === eventPath &&
                        event.fn === fn &&
                        event.ctx === ctx &&
                        event.field === field) {

                        pos = i;

                        return false;
                    }
                });

                if (typeof pos !== 'undefined') {

                    // удаляем обработчик из хранилища
                    triggers[event].splice(pos, 1);

                    // отписываем обработчик с моделей
                    MODEL.forEachModel(function() {
                        this.un(event.field, event, fn, ctx);
                    }, modelParams, true);

                }
            });

            return this;
        },

        /**
         * Тригерит событие на моделях по имени и пути
         * @param {String|Object} modelParams Имя модели или параметры описываеющие path модели
         * @param {String} [field] имя поля
         * @param {String} e имя события
         * @param {Object} [data] данные передаваемые в обработчик события
         * @returns {BEM.MODEL}
         */
        trigger: function(modelParams, field, e, data) {
            if (!(typeof field == 'string' && typeof e == 'string')) {
                data = e;
                e = field;
                field = undefined;
            }

            if (typeof modelParams == 'string') modelParams = { name: modelParams };

            e.split(' ').forEach(function(event) {
                MODEL.forEachModel(function() {
                    this.trigger(field, event, data);
                }, modelParams, true);
            });

            return this;
        },

        /**
         * Назначает глобальные обработчики событий на экземпляр модели
         * @param {BEM.MODEL} model экземпляр модели
         * @returns {BEM.MODEL}
         * @private
         */
        _bindToModel: function(model) {
            return this._bindToEvents(model, MODEL.modelsTriggers[model.name]);
        },

        /**
         * Назначает глобальные обработчики событий на поля экземпляра модели
         * @param {BEM.MODEL} model экземпляр модели
         * @returns {BEM.MODEL}
         * @private
         */
        _bindToFields: function(model) {
            var _this = this,
                fields = this.fieldsTriggers[model.name];

            fields && $.each(fields, function(fieldName, fieldTriggers) {

                _this._bindToEvents(model, fieldTriggers);

            });

            return this;
        },

        /**
         * Хелпер навешивания событий на экземпляр модели
         * @param {BEM.MODEL} model экземпляр модели
         * @param {Object} events события
         * @returns {BEM.MODEL}
         * @private
         */
        _bindToEvents: function(model, events) {
            var _this = this;

            events && $.each(events, function(eventName, storage) {
                storage.forEach(function(event) {
                    var regExp = new RegExp(this._getPathRegexp(event.path), 'g');

                    if (regExp.test(model.path())) {
                        model.on(event.field, eventName, event.fn, event.ctx);
                    }
                }, _this);
            });

            return this;
        },

        /**
         * Добавляет модель в хранилище
         * @private
         * @param {BEM.MODEL} model экземпляр модели
         * @returns {BEM.MODEL}
         * @private
         */
        _addModel: function(model) {

            MODEL.models[model.name][model.path()] = model;
            modelsGroupsCache[model.name] = null;

            MODEL
                ._bindToModel(model)
                ._bindToFields(model);

            return this;
        },

        /**
         * Уничтожает экземпляр модели, удаляет его из хранилища
         * @param {BEM.MODEL|String|Object} modelParams Модель, имя модели или параметры описываеющие path модели
         * @returns {BEM.MODEL}
         */
        destruct: function(modelParams) {
            if (typeof modelParams == 'string') modelParams = { name: modelParams };

            if (modelParams instanceof MODEL)
                modelParams = {
                    path: modelParams.path(),
                    name: modelParams.name,
                    id: modelParams.id
                };

            MODEL.forEachModel(function() {

                $.each(this.fields, function(name, field) {
                    field.destruct();
                });

                MODEL.models[this.name][this.path()] = null;
                this.trigger('destruct', { model: this });
            }, modelParams, true);

            modelsGroupsCache[modelParams.name] = null;

            return this;
        },

        /**
         * Возвращает путь к модели по заданным параметрам
         * @param {Object|Array} pathParts параметры пути
         * @param {String} pathParts.name имя модели
         * @param {String|Number} [pathParts.id] идентификатор модели
         *
         * @param {String} [pathParts.parentName] имя родитеской модели
         * @param {String|Number} [pathParts.parentId] идентификатор родительской модели
         * @param {String|Object} [pathParts.parentPath] путь родительской модели
         * @param {BEM.MODEL} [pathParts.parentModel] экземпляр родительской модели
         *
         * @param {String} [pathParts.childName] имя дочерней модели
         * @param {String|Number} [pathParts.childId] идентификатор дочерней модели
         * @param {String|Object} [pathParts.childPath] путь дочерней модели
         * @param {BEM.MODEL} [pathParts.childModel] экземпляр дочерней модели
         * @returns {String}
         */
        buildPath: function(pathParts) {
            if ($.isArray(pathParts))
                return pathParts.map(MODEL.buildPath).join(MODELS_SEPARATOR);

            var parts = { parent: '', child: '' };

            ['parent', 'child'].forEach(function buildPathForEach(el) {
                var path = pathParts[el + 'Path'],
                    model = pathParts[el + 'Model'],
                    name = pathParts[el + 'Name'],
                    id = pathParts[el + 'Id'];

                parts[el] = model && model.path() ||
                    (typeof path === 'object' ? MODEL.buildPath(path) : path) ||
                    (name ? name + (typeof id !== 'undefined' ? ID_SEPARATOR + id : '') : '');
            });

            return (parts.parent ? parts.parent + CHILD_SEPARATOR : '') +
                pathParts.name +
                ID_SEPARATOR + (typeof pathParts.id !== 'undefined' ? pathParts.id : ANY_ID)  +
                (parts.child ? CHILD_SEPARATOR + parts.child : '');
        },

        /**
         * Возвращает строку для построения регулярного выражения проверки пути
         * @param {String} path
         * @returns {String}
         * @private
         */
        _getPathRegexp: function(path) {
            return path.replace(new RegExp('\\' + ANY_ID, 'g'), '([^' + CHILD_SEPARATOR + ID_SEPARATOR + ']*)') + '$';
        },

        /**
         * Выполняет callback для каждой модели найденной по заданному пути. Если callback вернул false, то
         * итерация остановливается
         * @param {Function} callback ф-ия выполняемая для каждой модели
         * @param {String|Object} modelParams параметры модели
         * @param {Boolean} [dropCache] Не брать значения из кеша
         * @returns {BEM.MODEL}
         */
        forEachModel: function(callback, modelParams, dropCache) {
            var modelsByPath = MODEL.get(modelParams, dropCache);

            if (Array.isArray(modelsByPath))
                for (var i = 0, n = modelsByPath.length; i < n; i++)
                    if (callback.call(modelsByPath[i]) === false) break;

            return this;
        }

    });

    BEM.DOM.decl('i-model', {
        onSetMod: {
            js: {
                inited: function() {
                    var data = MODEL.modelsData,
                        modelsParams = this.params.data,
                        storeData = function storeData(modelParams) {
                            var modelData = data[modelParams.name] || (data[modelParams.name] = {});

                            modelData[MODEL.buildPath(modelParams)] = modelParams.data;
                        };

                    if (Array.isArray(modelsParams)) {
                        modelsParams.forEach(storeData);
                    } else {
                        storeData(modelsParams);
                    }
                }
            }
        }
    });

})(BEM, jQuery);
