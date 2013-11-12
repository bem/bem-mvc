;(function(MODEL, $) {
    MODEL.FIELD.types.id = $.inherit(MODEL.FIELD, {

        isEmpty: function() {
            return true;
        }

    });
})(BEM.MODEL, jQuery);
