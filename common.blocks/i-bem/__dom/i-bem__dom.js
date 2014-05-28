$.inheritSelf(BEM.DOM, {}, {
    init: function() {
        var nodes = $('.i-model');

        if (nodes.length) {
            nodes.each(function(i, node) {
                $(node).bem('i-model')
            });
        }

        this.__base.apply(this, arguments);
    }
});
