({
    shouldDeps: [
        {
            block: 'functions',
            elems: ['throttle', 'debounce']
        },
        {
            elem: 'field',
            mods: {
                type: [
                    'id',
                    'string',
                    'number',
                    'boolean',
                    'model',
                    'array',
                    'models-list'
                ]
            }
        }
    ]
})
