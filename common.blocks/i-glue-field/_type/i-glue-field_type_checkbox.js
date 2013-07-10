BEM.DOM.decl({ block: 'i-glue-field_type_checkbox', baseBlock: 'i-glue-field' }, {
    onSetMod: {
        js: function() {
            this.__base();

            this.checkbox = this.findBlockOn('checkbox');
        }
    },

    init: function() {
        this.__base.apply(this, arguments);

        this.checkbox.on('change', function() {
            this.model.set(this.name, this.checkbox.isChecked());
        }, this);
    },

    set: function(value) {
        this.__base();
        this.checkbox.setMod('checked', value ? 'yes' : '');
    },

    onFieldChange: function(e, data) {
        this.checkbox.getMod('focused') !== 'yes' && this.checkbox.setMod('checked', data.value ? 'yes' : '');
    }

});
