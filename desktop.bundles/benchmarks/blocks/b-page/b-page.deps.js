([
    {
        tech: 'js',
        mustDeps: [
            {
                block: 'i-bem',
                elem: 'html',
                tech: 'bemhtml'
            },
            { block: 'i-glue-benchmark', tech: 'bemhtml' },
            { block: 'input', mods: { size: 'xs' }, tech: 'bemhtml' }
        ]
    },
    {
        shouldDeps: [
            {
                name: 'i-bem',
                elems: [
                    {
                        name: 'dom',
                        mods: [{ name: 'init', vals: ['auto'] }]
                    },
                    {
                        name: 'html'
                    }
                ]
            },
            { block: 'i-glue-benchmark' }
        ]
    }
])
