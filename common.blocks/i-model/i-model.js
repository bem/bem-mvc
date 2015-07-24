;(function(BEM, $) {

    BEM.DOM.decl('i-model', {
        onSetMod: {
            js: {
                inited: function() {
                    var data = BEM.MODEL.modelsData,
                        modelsParams = this.params.data,
                        storeData = function storeData(modelParams) {
                            var modelData = data[modelParams.name] || (data[modelParams.name] = {});

                            modelData[BEM.MODEL.buildPath(modelParams)] = modelParams.data;
                        };

                    if (Array.isArray(modelsParams)) {
                        modelsParams.forEach(storeData);
                    } else {
                        storeData(modelsParams);
                    }
                }
            }
        }
    });

    BEM.MODEL = {};

})(BEM, jQuery);
