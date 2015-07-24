;(function(BEM, $) {
    BEM.MODEL._utils = {
        objects: getObjects(),
        functions: getFunctions(),
        inherit: $.inherit,
        observable: $.observable,
        identify: $.identify,
        throttle: $.throttle,
        debounce: $.debounce
    };

    var hasOwnProp = Object.prototype.hasOwnProperty;

    function getObjects() {
        // © bem-core/common.blocks/objects/objects.vanilla.js
        return {
            extend: function(target, source) {
                (typeof target !== 'object' || target === null) && (target = {});

                for(var i = 1, len = arguments.length; i < len; i++) {
                    var obj = arguments[i];
                    if(obj) {
                        for(var key in obj) {
                            hasOwnProp.call(obj, key) && (target[key] = obj[key]);
                        }
                    }
                }

                return target;
            },
            isEmpty : function(obj) {
                for(var key in obj) {
                    if(hasOwnProp.call(obj, key)) {
                        return false;
                    }
                }

                return true;
            },
            each: function(obj, fn, ctx) {
                for(var key in obj) {
                    if(hasOwnProp.call(obj, key)) {
                        ctx? fn.call(ctx, obj[key], key) : fn(obj[key], key);
                    }
                }
            }
        };
    }

    function getFunctions( ) {
        return {
            isFunction: $.isFunction
        }
    }
})(BEM, jQuery);
