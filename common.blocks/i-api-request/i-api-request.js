;(function(BEM, $, undefined) {

    BEM.decl('i-api-request',


        ["GET", "POST", "PUT", "DELETE"].reduce(function(decl, type) {

                decl[type.toLowerCase()] = function(url, options) {

                    if (type === "DELETE") {
                        // Подменяем dataType, чтобы срабатывал onSuccess
                        options.params = $.extend(options.params, {
                            dataType: "text"
                        });
                    }

                    return this._request(url, options, type);
                }

                return decl;

            }, {

                /**
                 * Минималистичный контроллер ajax-запросов в терминах REST
                 * @private
                 * @param {String} url
                 * @param {Object} options опции
                 * @param {Function|Array} [options.onSuccess] колбек, кторорый будет вызван, если запрос успешно выполнен
                 * @param {Function|Array} [options.onError] колбек, кторорый будет вызван, если запрос не выполнился
                 * @param {Boolean} [options.emulateJSON] эмулирует передачу JSON в формате HTML-форм
                 * @param {String} [options.baseUrl] базоввый URL, при запросах конкатенируется с параметром url
                 * @param {Object} [options.params] параметры jQuery.ajax
                 * @param {String} [type]
                 * @returns {jQuery.ajax}
                 */
                _request: function(url, options, type) {

                    var params;

                    options = $.extend(true, this.__self.getDefaults(), options);

                    request = options.request || {};

                    //Кэшируем
                    params = options.params;
                    //Устанавливаем тип запроса
                    params.type = type;
                    //Устанавливаем базовый URL, если есть
                    params.url = options.baseUrl ? options.baseUrl + url : url;

                    if (options.emulateJSON) {
                        params.headers = $.extend(params.headers, {
                            "Content-Type": "application/x-www-form-urlencoded"
                        });

                        if (params.data) {
                            request.data = JSON.stringify(params.data);
                            delete params.data;
                        }
                    }

                    // Пробрасываем колбеки
                    ['onSuccess', 'onError'].reduce(function(params, prop) {

                        if (typeof options[prop] !== undefined) {
                            params[prop.toLowerCase().slice(2)] = options[prop];
                        }

                        return params;

                    }, params);

                    params.url = this._urlify(params.url, request);

                    return $.ajax(params);
                },
                /**
                 * Хелпер: склеивает url и параметры запроса (request)
                 * @param {String} url
                 * @param {Object} request
                 * @returns {String}
                 * @private
                 */
                _urlify: function(url, request) {

                    var params = $.param(request);

                    if (params !== '') {
                        url += (url.indexOf('?') >= 0 ? '&' : '?') + params;
                    }

                    return url;
                }
        }), {

            /**
             * Возвращает настройки по умолчанию (должен переопределяться)
             * @returns {Object}
             */
            getDefaults: function() {
                return {};
            }
    });

}(BEM, jQuery));
