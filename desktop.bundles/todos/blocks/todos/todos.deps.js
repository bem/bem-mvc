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
<<<<<<< HEAD
                block: 'i-bem',
                elem: 'html'
=======
                block: 'i-bem'
>>>>>>> Port todos bundle from v1, some cleanup
            },
            {
                block: 'm-todos'
            },
            {
<<<<<<< HEAD
                block: 'i-glue'
            },
            {
                block: 'b-link',
=======
                block: 'glue'
            },
            {
                block: 'link',
>>>>>>> Port todos bundle from v1, some cleanup
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
