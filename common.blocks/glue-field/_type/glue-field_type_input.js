modules.define('glue-field', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl({ block: 'glue-field_type_input', baseBlock: 'glue-field' }, {

    onSetMod: {
        js: {
            inited: function() {
                this.__base();
                this.input = this.findBlockOn('input');
            }
        }
    },

    init: function() {
        this.__base.apply(this, arguments);

        this.input
            .on('change', function() {
                this.model.set(this.name, this.input.getVal());
            }, this)
            .on('blur', function() {
                this.input.setVal(this.model.get(this.name, 'format'));
            }, this);
    },

    set: function(value) {
        this.__base();
        this.input.setVal(value);
    },

    onFieldChange: function(e, data) {
        this.input.getMod('focused') !== 'yes' && this.input.setVal(data.value);
    }

}));

});
