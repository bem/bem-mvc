;(function(BEM) {
    var MODEL = BEM.MODEL,
        objects = MODEL._utils.objects;

    /**
     * Реализация внутреннего хранилища обработчиков событий
     */
    MODEL.FIELD.decl('inner-events-storage', {

        /**
         * @class Конструктор поля модели
         * @constructs
         * @private
         */
        __constructor: function() {
            /**
             * Хранилище обработчиков событий на вложенных моделях
             */
            this._eventHandlers = {};

            this.__base.apply(this, arguments);
        },

        /**
         * Сохранить обработчик события в хранилище
         * @param {String} e
         * @param {Function} fn
         * @param {Object} ctx
         * @private
         */
        _pushEventHandler: function(e, fn, ctx) {
            if (!this._eventHandlers[e])
                this._eventHandlers[e] = [];

            this._eventHandlers[e].push({
                name: e,
                fn: fn,
                ctx: ctx
            });
        },

        /**
         * Удалить обработчик события из хранилища
         * @param {String} e
         * @param {Function} fn
         * @param {Object} ctx
         * @private
         */
        _popEventHandler: function(e, fn, ctx) {
            if (!this._eventHandlers[e]) return;

            if (typeof fn !== 'undefined') {
                this._eventHandlers[e] = this._eventHandlers[e].filter(function(event) {
                    return !(fn === event.fn && ctx === event.ctx);
                });
            } else {
                delete this._eventHandlers[e];
            }
        },

        /**
         * Повесить обработчики событий из хранилища на модель
         * @param {MODEL} model
         * @private
         */
        _bindFieldEventHandlers: function(model) {
            objects.each(this._eventHandlers, function(events, e) {
                events && events.forEach(function(event) {
                    model.on(e, event.fn, event.ctx);
                });
            });
        },

        /**
         * Снять обработчики событий из хранилища с модели
         * @param {MODEL} model
         * @private
         */
        _unBindFieldEventHandlers: function(model) {
            objects.each(this._eventHandlers, function(events, e) {
                events && events.forEach(function(event) {
                    model.un(e, event.fn, event.ctx);
                });
            });
        }

    });
})(BEM);
