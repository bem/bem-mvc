([
    {
        tech: 'js',
        mustDeps: [
            {
                block: 'i-bem',
                elems: ['html'],
                tech: 'bemhtml'
            },
            {
                block: 'i-glue-field',
                tech: 'bemhtml'
            },
            { block: 'i-model', tech: 'bemhtml' },
            { block: 'i-model-aggregator', tech: 'bemhtml' }
        ]
    },
    {
        shouldDeps: [
            {
                block: 'i-model'
            },
            {
                block: 'i-glue'
            },
            {
                block: 'i-model-aggregator'
            }
        ]
    }
])
