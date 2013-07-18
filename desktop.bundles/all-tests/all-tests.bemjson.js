({
    block: 'page',
    title: 'tests',
    head: [
        { elem: 'css', url: '_all-tests.css', ie: false },
        { elem: 'css', url: '_all-tests', ie: true },
        { elem: 'meta', attrs: { name: 'description', content: '' }},
        { elem: 'meta', attrs: { name: 'keywords', content: '' }}
    ],
    content: [

        { block: 'models-test', content: { block: 'test' } },

        { block : 'i-jquery', mods: { version: '1.8.3' } },
        { elem: 'js', url: '_all-tests.js' },
        { elem: 'js', url: '_all-tests.bemhtml.js' },
        { elem: 'js', url: '_all-tests.test.js' }
    ]
})
