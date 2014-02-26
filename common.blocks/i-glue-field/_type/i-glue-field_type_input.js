BEM.DOM.decl({ block: 'i-glue-field_type_input', baseBlock: 'i-glue-field' }, {
    onSetMod: {
        js: function() {
            this.__base();
            this.input = this.findBlockOn('input');
        }
    },

    init: function() {
        this.__base.apply(this, arguments);

        this.input
            .on('change', function() {
                this.model.set(this.name, this.input.val());
            }, this)
            .on('blur', function() {
                this.input.val(this.model.get(this.name, 'format'));
            }, this);
    },

    set: function(value) {
        this.__base();
        this.input.val(value);
    },

    onFieldChange: function(e, data) {
        this.input.getMod('focused') !== 'yes' && this.input.val(data.field ? this.model.get(data.field, 'format') : data.value);
    }

});
