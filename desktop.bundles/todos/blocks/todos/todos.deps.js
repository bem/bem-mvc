([
    {
        tech: 'js',
        shouldDeps: [
            {
                block: 'todos',
                tech: 'bemhtml'
            },
            {
                block: 'checkbox',
                mods: { size: 'm', theme: 'normal' },
                tech: 'bemhtml'
            },
            {
                block: 'button',
                mods: {
                    size: ['m', 's'],
                    pseudo: 'yes',
                    theme: 'normal'
                },
                tech: 'bemhtml'
            }
        ]
    },
    {
        shouldDeps: [
            'i-bem',
            'm-todos',
            'glue',
            'i-glue-destroy',
            {
                block: 'link',
                mods: { pseudo: true }
            },
            {
                block: 'checkbox',
                mods: { size: 'm', theme: 'normal' }
            },
            {
                block: 'button',
                mods: {
                    size: ['m', 's'],
                    pseudo: 'yes',
                    theme: 'normal'
                }
            },
            {
                block: 'keyboard',
                elem: 'codes'
            }
        ]
    }
])
