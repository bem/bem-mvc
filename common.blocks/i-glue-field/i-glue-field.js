BEM.DOM.decl('i-glue-field', {

    onSetMod: {
        js: function() {
            this.name = this.params.name;
        }
    },

    /**
     * Инициализирует блок i-glue-field
     * @protected
     * @param {BEM.MODEL} model
     */
    init: function(model) {
        this.model = model;

        this.model.on(this.name, 'change', this.onFieldChange, this);

        return this;
    },

    /**
     * Выставить значение поля модели
     * @param {*} val Значение поля
     */
    set: function(val) {
        this.model.set(this.name, val);

        return this;
    },

    /**
     * Получить занчение поля модели
     */
    get: function() {
        return this.model.get(this.name);
    },

    /**
     * Выполнить действие по изменению поля модели
     * @param {String} e
     * @param {*} data
     */
    onFieldChange: function(e, data) {},

    /**
     * Уничтожить блок, отписаться от событий
     */
    destruct: function() {
        this.model.un(this.name, 'change', this.onFieldChange, this);

        this.__base.apply(this, arguments);
    }

});
