modules.define('glue-field', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl({ block: 'glue-field_type_select', baseBlock: 'glue-field' }, {
    onSetMod: {
        js: {
            inited: function() {
                this.__base();
                this.select = this.findBlockOn('select');
            }
        }
    },

    init: function() {
        this.__base.apply(this, arguments);

        this.select.on('change', function() {
            this.model.set(this.name, this.select.val());
        }, this);
    },

    set: function(value) {
        this.__base();
        this.select.val(value);
    },

    onFieldChange: function(e, data) {
        this.select.getMod('focused') !== 'yes' && this.select.val(data.value);
    }

}));

});
