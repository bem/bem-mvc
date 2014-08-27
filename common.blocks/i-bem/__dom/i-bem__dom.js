/**
 * module i-bem__dom
 */

modules.define(
    'i-bem__dom',
    ['inherit', 'jquery'],
    function(provide, inherit, $, DOM) {

/**
 * exports i-bem:.blocks.i-bem__dom
 * @class i-bem__dom
 * @bem i-bem__dom
 */
provide(inherit.self(DOM, {}, /** @lends i-bem__dom */{

    /**
     * Инициализирует блок i-bem
     * @protected
     */
    init: function() {
        var nodes = $('.model');

        if (nodes.length) nodes.bem('model');

        this.__base.apply(this, arguments);
    }
}));

});
