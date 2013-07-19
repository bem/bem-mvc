modules.define('i-bem__dom', [], function(provide, DOM) {

DOM.decl('glue-field', {

    onSetMod: {
        js: {
            inited: function() {
                this.name = this.params.name;
            }
        }
    },

    /**
     * Инициализирует блок glue-field
     * @protected
     * @param model
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
     * @param e
     * @param data
     */
    onFieldChange: function(e, data) {}

});

provide(DOM);

});
