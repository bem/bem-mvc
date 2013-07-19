modules.define('i-bem__dom', [], function(provide, DOM) {

DOM.decl({ block: 'glue-field_type_inline', baseBlock: 'glue-field' }, {

    onFieldChange: function(e, data) {
        this.domElem.html(this.model.get(this.name, 'format'));
    }

});

provide(DOM);

});
