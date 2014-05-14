({
    block: 'page',
    title: 'bem-mvc • TodoMVC',
    head: [
        { elem: 'css', url: '_todos.css', ie: false },
        { elem: 'css', url: '_todos', ie: true },
        { elem: 'meta', attrs: { name: 'description', content: 'bem-mvc demo example' }}
    ],
    content:[
        // данные для модели
        {
            block: 'model',
            modelParams: {
                name: 'todos',
                data: {
                    list: [
                        { text: 'milk', done: true },
                        { text: 'bread', done: false }
                    ]
                }
            }
        },

        {
            block: 'todos',
            js: {
                modelName: 'todos'
            },
            content: [
                {
                    elem: 'title',
                    content: 'todos'
                },
                {
                    elem: 'body',
                    content: [
                        {
                            elem: 'new-todo',
                            content: [
                                {
                                    block: 'checkbox',
                                    mix: [
                                        {
                                            block: 'todos',
                                            elem: 'all-done'
                                        },
                                        {
                                            block: 'todos',
                                            elem: 'model-field',
                                            js: {
                                                type: 'mod',
                                                name: 'allDone',
                                                block: 'checkbox',
                                                modName: 'checked'
                                            }
                                        }
                                    ],
                                    mods: { size: 'm' },
                                    checkboxAttrs: { autocomplete: 'off' }
                                },
                                {
                                    block: 'input',
                                    mix: { block: 'todos', elem: 'new-todo-input' },
                                    name: 'text',
                                    placeholder: 'What needs to be done?',
                                    mods: { size: 'm' },
                                    content: [
                                        { elem: 'control' }
                                    ]
                                }
                            ]
                        },
                        {
                            elem: 'todo-items',
                            mix: {
                                block: 'todos',
                                elem: 'model-field',
                                js: {
                                    type: 'mod',
                                    name: 'show',
                                    block: 'todos',
                                    elem: 'todo-items',
                                    modName: 'show'
                                }
                            }
                        }
                    ]
                },
                {
                    elem: 'footer',
                    content: [
                        {
                            elem: 'items-left',
                            content: [
                                {
                                    tag: 'b',
                                    content: '1'
                                },
                                ' item left'
                            ]
                        },
                        {
                            elem: 'filters',
                            content: [
                                {
                                    elem: 'filter',
                                    mods: { type: 'all' },
                                    url: '#/',
                                    content: 'All'
                                },
                                {
                                    elem: 'filter',
                                    mods: { type: 'active' },
                                    url: '#/active',
                                    content: 'Active'
                                },
                                {
                                    elem: 'filter',
                                    mods: { type: 'completed' },
                                    url: '#/completed',
                                    content: 'Completed'
                                }
                            ]
                        },
                        {
                            block: 'button',
                            mix: [
                                {
                                    block: 'todos',
                                    elem: 'clear-completed',
                                    mods: { visible: 'yes' }
                                },
                                {
                                    block: 'todos',
                                    elem: 'model-field',
                                    js: {
                                        type: 'mod',
                                        name: 'hasCompleted',
                                        block: 'todos',
                                        elem: 'clear-completed',
                                        modName: 'visible'
                                    }
                                }
                            ],
                            url: '#',
                            mods: { size: 'xs', pseudo: 'yes' },
                            content: [
                                'Clear completed (',
                                {
                                    block: 'todos',
                                    elem: 'completed-count',
                                    mix: {
                                        block: 'todos',
                                        elem: 'model-field',
                                        js: {
                                            name: 'itemsCompleted',
                                            type: 'inline'
                                        }
                                    },
                                    content: 1
                                },
                                ')'
                            ]
                        }
                    ]
                }

            ]
        },
        { elem: 'js', url: '_todos.js' }
    ]
})
