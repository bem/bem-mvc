modules.define(
    'model',
    ['inherit'],
    function(provide, inherit, MODEL) {


MODEL.FIELD.types.id = inherit(MODEL.FIELD, {

    isEmpty: function() {
        return true;
    }

});

provide(MODEL);

});
