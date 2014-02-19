;(function(MODEL, $) {
    MODEL.FIELD.types.boolean = $.inherit(MODEL.FIELD, {

        /**
         * Перед записью приводит значение к boolean
         * @param {*} value
         * @returns {boolean}
         * @private
         */
        _preprocess: function(value) {
            if (this.checkEmpty(value)) return;

            return !!(typeof value == 'string' ? +value : value);
        },

        /**
         * Приводит к 1 или 0
         * @param {Boolean} value
         * @returns {string}
         * @private
         */
        _format: function(value) {
            return (0 + value).toString();
        },

        /**
         * Возвращает начальное значение поля
         * Для поля типа boolean false вполне корректное fixedValue - не надо его игнорировать
         * @returns {Boolean}
         */
        getFixedValue: function() {
            return this._fixedValue === undefined ? this.getDefault() : this._fixedValue;
        }

    });
})(BEM.MODEL, jQuery);
