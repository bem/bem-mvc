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
            }
        ]
    },
    {
        shouldDeps: [
            {
                block: 'i-model'
            },
            {
                block: 'i-glue'
            }
        ]
    }
])