({
    block: 'b-page',
    title: 'tests',
    head: [
        { elem: 'css', url: '_tests.css', ie: false },
        { elem: 'css', url: '_tests', ie: true },
        { block: 'i-jquery', elem: 'core' },
        { elem: 'js', url: '_tests.js' },
        { elem: 'js', url: '_tests.test.js' },
        { elem: 'js', url: '_tests.bemhtml.js' },
        { elem: 'meta', attrs: { name: 'description', content: '' }},
        { elem: 'meta', attrs: { name: 'keywords', content: '' }}
    ],
    content: [
        {
            block: 'i-bem',
            elem: 'test'
        },
        {
            block: 'i-model'
        }
    ]
})
