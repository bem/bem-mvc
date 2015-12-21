modules.define('glue-field', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl({ block: 'glue-field_type_textarea', baseBlock: 'glue-field_type_input' }, {

    onSetMod: {
        js: {
            inited: function() {
                this.__base();
                this.input = this.findBlockOn('textarea');
            }
        }
    },
}));

});

