;(function(MODEL, $) {

    var methodMap = {
        "read": "get",
        "create": "post",
        "update": "put",
        "delete": "delete"
    };

    MODEL = $.inheritSelf(MODEL, {

        /**
         * Вытягивает модель с сервера
         * @param {Object} options параметры запроса (блок: i-api-request)
         */
        fetch: function(options) {
            var _this = this,
                success;

            options = options || {};
            success = options.onSuccess;

            options.onSuccess = function(data) {

                _this.update(_this.parse(data));
                if (success) {
                    success.call(this, _this, data, options);
                }
                _this.trigger("sync", _this, data, options)
            };

            this.__self.sync("read", this, options);
        },
        /**
         * Сохраняет модель на сервер
         * @param {Object} options параметры запроса (блок: i-api-request)
         */
        save: function(options) {
            var _this = this,
                data = _this.toJSON(),
                method = this.isNew() ? "create" : "update",
                success;

            options = options || {};

            options.params = $.extend(options.params, {data: data});
            success = options.onSuccess;

            options.onSuccess = function(data) {
                _this.update(_this.parse(data));
                if (success) {
                    success.call(this, _this, data, options);
                }
                _this.trigger("sync", _this, data, options);

            };
            this.__self.sync(method, this, options);
        },
        /**
         * Удаляет модель на сервере
         * @param {Object} options параметры запроса (блок: i-api-request)
         */
        destroy: function(options) {
            var _this = this,
                destroy = function() {
                    _this.clear();
                    _this.trigger("destroy", _this, options);

                },
                success;

            options = options || {};
            success = options.onSuccess;

            options.onSuccess = function(data) {

                destroy();

                if (success) {
                    success.call(this, _this, data, options);
                }

                if (_this.isNew()) {
                    _this.trigger("sync", _this, options);
                }
            };

            if (this.isNew()) {
                options.onSuccess();
                return false;
            }
            this.__self.sync("delete", this, options);
        },
        /**
         * Метод получения url модели
         * @returns {String}
         */
        getUrl: function() {
            return this.get('urlRoot');
        },
        /**
         * Преобразование перед апдейтом модели
         * @param {Object} data
         * @returns {Object}
         */
        parse: function(data) {
            return data;
        },
        /**
         * Метод, определяющий сохранена ли модель на сервере
         * @returns {Boolean}
         */
        isNew: function() {
            return !this.get(MODEL.ID_FIELD);
        }

    }, {
        /**
         * Синхронизирует состояние модели
         * @param {String} method
         * @param {BEM.MODEL} model
         * @param {Object} options
         * @returns {jQuery.ajax}
         */
        sync: function(method, model, options) {
            var type = methodMap[method];

            return BEM.create("i-api-request")[type](model.getUrl(), options);
        },

        ID_FIELD: "id"    // поле, считающееся id модели
    });

})(BEM.MODEL, jQuery);
