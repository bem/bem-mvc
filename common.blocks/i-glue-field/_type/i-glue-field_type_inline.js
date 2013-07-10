BEM.DOM.decl({ block: 'i-glue-field_type_inline', baseBlock: 'i-glue-field' }, {

    onFieldChange: function(e, data) {
        this.domElem.html(this.model.get(this.name, 'format'));
    }

});
