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
