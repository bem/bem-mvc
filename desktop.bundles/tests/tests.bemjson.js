({
    block: 'b-page',
    title: 'tests',
    head: [
        { elem: 'css', url: '_tests.css', ie: false },
        { elem: 'css', url: '_tests', ie: true },
        { elem: 'meta', attrs: { name: 'description', content: '' }}
    ],
    content: [
        {
            block: 'i-bem',
            elem: 'test'
        },
        { elem: 'js', url: 'jquery-1.8.3.js' },
        { elem: 'js', url: '_tests.js' },
        { elem: 'js', url: '_tests.test.js' }
    ]
})
