block('model-aggregator').def()(function() {
    this._modelAggregation = true;
    this._modelAggregatorData = [];

    applyCtx(this.ctx.content);

    this._modelAggregation = false;

    return applyCtx({
        block: 'model',
        modelsParams: this._modelAggregatorData
    });
});
