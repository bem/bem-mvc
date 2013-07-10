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

        if (mParams.id) {
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
        elemParams.name || (elemParams.name = this.getMod(elem, 'name'));
        elemParams.type || (elemParams.type = this.getMod(elem, 'type'));

        var type = elemParams.type,
            block = new BEM.DOM.blocks['i-glue-field' + (type ? '_type_' + type : '')](elem, elemParams, true);

        this._fields[elemParams.name] = block;
        block.init(this.model);

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
            name: this.getModelName()
        };

        if (this.params.modelId)
            params.id = this.params.modelId;

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
    }


});
