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
                    'string',
                    'number',
                    'boolean',
                     'array',
                    'model',
                    //'models-list'
                ]
            }
        }
    ]
})
