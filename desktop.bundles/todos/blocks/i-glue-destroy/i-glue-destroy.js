modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl({ block: 'i-glue-destroy', baseBlock: 'glue' }, {
    onSetMod: {
        js: {
            inited: function() {
                this.__base();

                this.bindTo('click', function() {

                    this.model.destruct();

                }, this);
            }
        }
    }
});

provide(DOM);

});
