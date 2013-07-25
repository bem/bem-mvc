<<<<<<< HEAD
BEM.DOM.decl({ block: 'i-glue-destroy', baseBlock: 'i-glue' }, {
    onSetMod: {
        js: function() {
            this.__base();

            this.bindTo('click', function() {

                this.model.destruct();

            }, this);
        }
    }
});
=======
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
>>>>>>> Port todos bundle from v1, some cleanup
