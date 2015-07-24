({
    mustDeps: [
    ],
    shouldDeps: [
        { elem: 'utils' },
        { elem: 'core' },
        {
            elem: 'field',
            mods: {
                type: [
                    'inner-events-storage',
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
