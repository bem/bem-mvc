modules.define(
    'i-glue-destroy',
    ['i-bem__dom', 'glue'],
    function(provide, BEMDOM, Glue) {

provide(BEMDOM.decl({ block: 'i-glue-destroy', baseBlock: Glue }, {}, {
    live: function() {
        this.liveBindTo('click', function() {
            this.model.destruct();
        })
    }
}));

});
