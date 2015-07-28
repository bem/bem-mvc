exports.blocks = [
    { block: 'i-model', elem: 'server-utils' },
    { block: 'i-model', elem: 'core' },
    {
        block: 'i-model',
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
];
