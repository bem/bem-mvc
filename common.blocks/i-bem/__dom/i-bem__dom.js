$.inheritSelf(BEM.DOM, {}, {
    init: function() {
        var nodes = $('.i-model');

        if (nodes.length)
            nodes.bem('i-model');

        this.__base.apply(this, arguments);
    }
});
