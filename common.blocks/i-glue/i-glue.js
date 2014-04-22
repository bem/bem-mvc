/**
 * Блок для проклеивания моделей и DOM
 */
BEM.DOM.decl('i-glue', {

    onSetMod: {
        js: function() {

            this.glue();

        }
    },

    /**
     * Проклеить BEM-блоки полей с полями модели
     */
    glue: function() {
        this
            ._initModel()
            ._initFields();
    },

    /**
     * Инициализирует модель, соответствующую данному блоку
     * @param {Object} [modelParams] Парметры модели
     * @param {Object} [modelData] Данные для инициализации модили
     * @returns {BEM}
     * @private
     */
    _initModel: function(modelParams, modelData) {
        var mParams = modelParams || this.getModelParams(),
            model;

        if (mParams.id !== undefined) {
            model = BEM.MODEL.getOne(mParams);
        }

        this.model = model || BEM.MODEL.create(mParams,
                modelData || this.params.modelData || (this.params.modelParams && this.params.modelParams.data) || {});

        return this;
    },

    /**
     * Инициализирует поля и провязывает их с моделью
     * @returns {BEM}
     * @private
     */
    _initFields: function() {
        var _this = this;

        this._fields = {};

        $.each(this.findElem('model-field'), function(i, elem) {
            _this.initFieldBlock($(elem));
        });

        return this;
    },

    /**
     * Инициализируем блок i-glue-field (или его потомка) на BEM-блоке
     * @param {jQuery} elem
     * @returns {BEM}
     */
    initFieldBlock: function(elem) {
        elem = this.elemify(elem, 'model-field'); // идентифицируем элемент для случая, когда на одной ноде несколько элементов

        var elemParams = this.elemParams(elem) || {};

        if (!Array.isArray(elemParams))
            elemParams = [elemParams];

        elemParams.forEach(function(fieldParams) {
            fieldParams.name || (fieldParams.name = this.getMod(elem, 'name'));
            fieldParams.type || (fieldParams.type = this.getMod(elem, 'type'));

            var type = fieldParams.type,
                block = new BEM.DOM.blocks['i-glue-field' + (type ? '_type_' + type : '')](elem, fieldParams, true);

            this._fields[fieldParams.name] = block;
            block.init(this.model);
        }, this);

        return this;
    },

    /**
     * Возвращает BEM-блок по имени поля из модели
     * @param name Имя поля
     * @returns {BEM}
     */
    getFieldBlock: function(name) {
        return this._fields[name];
    },

    /**
     * Возвращает параметры модели
     * @returns {Object}
     */
    getModelParams: function() {
        if (this.params.modelParams) return this.params.modelParams;

        var params = {
            name: this.getModelName(),
            id: this.params.modelId
        };

        if (this.params.modelParentPath)
            params.parentPath = this.params.modelParentPath;

        if (this.params.modelParentName) {
            params.parentName = this.params.modelParentName;
            params.parentId = this.params.modelParentId;
        }

        return params;
    },

    /**
     * Возвращает путь к модели, соответствующей данному блоку
     * @returns {String}
     */
    getModelPath: function() {
        return MODEL.buildPath(this.getModelParams);
    },

    /**
     * Возвращает имя модели, соответствующей данному блоку
     * @returns {String}
     */
    getModelName: function() {
        return this.params.modelName || this.__self.getName();
    },

    /**
     * Уничтожает блок и созданные им объекты
     * @param keepDOM
     */
    destruct: function(keepDOM) {
        this._fields && Object.keys(this._fields).forEach(function(name) {
            this._fields[name].destruct(keepDOM);
        }, this);

        this.__base.apply(this, arguments);
    }


});
