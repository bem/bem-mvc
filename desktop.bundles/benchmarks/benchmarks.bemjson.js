({
    block: 'b-page',
    title: 'benchmarks',
    head: [
        { elem: 'css', url: '_benchmarks.css', ie: false },
        { elem: 'css', url: '_benchmarks', ie: true },
        { elem: 'meta', attrs: { name: 'description', content: '' }},
    ],
    content: [
        { block: 'i-jquery', mods: { version: '1.8.3' } },
        { elem: 'js', url: '_benchmarks.js' },

        { block: 'i-model-benchmark', js: true },
        { block: 'i-glue-benchmark', js: true }

    ]
})
