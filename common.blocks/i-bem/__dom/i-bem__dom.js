modules.define(
    'i-bem__dom',
    ['inherit', 'jquery'],
    function(provide, inherit, $, DOM) {

provide(inherit.self(DOM, {}, {
    init: function() {
        var nodes = $('.model');

        if (nodes.length) nodes.bem('model');

        this.__base.apply(this, arguments);
    }
}));

});
