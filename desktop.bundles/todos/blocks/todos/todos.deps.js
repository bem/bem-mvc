([
    {
        tech: 'js',
        mustDeps: [
            {
                block: 'todos',
                tech: 'bemhtml'
            },
            {
                block: 'checkbox',
                mods: { size: 'm' },
                tech: 'bemhtml'
            },
            {
                block: 'button',
                mods: {
                    size: ['m', 's', 'xs'],
                    pseudo: 'yes'
                },
                tech: 'bemhtml'
            }
        ]
    },
    {
        mustDeps: [
            {
                block: 'i-bem',
                elem: 'html'
            },
            {
                block: 'm-todos'
            },
            {
                block: 'i-glue'
            },
            {
                block: 'b-link',
                mods: { pseudo: 'yes' }
            }
        ],
        shouldDeps: [
            {
                block: 'i-glue-destroy'
            },
            {
                block: 'checkbox',
                mods: { size: 'm' }
            },
            {
                block: 'button',
                mods: {
                    size: ['m', 's', 'xs'],
                    pseudo: 'yes'
                }
            }
        ]
    }
])
