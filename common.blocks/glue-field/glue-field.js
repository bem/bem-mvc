/**
 * @module  glue-field
 */

modules.define('glue-field', ['i-bem__dom'], function(provide, BEMDOM) {

/**
 * Блок для проклеивания моделей и DOM
 * @exports
 * @class glue-field
 * @bem
 */
provide(BEMDOM.decl('glue-field', /** @lends glue-field.prototype */{

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
     * @returns {glue-field} this
     */
    init: function(model) {
        this.model = model;

        this.model.on(this.name, 'change', this.onFieldChange, this);

        return this;
    },

    /**
     * Выставить значение поля модели
     * @param {*} val Значение поля
     * @returns {glue-field} this
     */
    set: function(val) {
        this.model.set(this.name, val);

        return this;
    },

    /**
     * Получить значение поля модели
     * @returns {String}
     */
    get: function() {
        return this.model.get(this.name);
    },

    /**
     * Выполнить действие по изменению поля модели
     * @param e
     * @param data
     */
    onFieldChange: function(e, data) {},

    /**
     * Уничтожить блок, отписаться от событий
     */
    destruct: function() {
        this.model.un(this.name, 'change', this.onFieldChange, this);

        this.__base.apply(this, arguments);
    }

}));

});
