modules.define('model', function(provide, MODEL) {

MODEL.decl('todos', {

    list: {
        type: 'models-list',
        modelName: 'todo-item'
    },

    show: 'string',

    allDone: {
        type: 'boolean',
        calculate: function() {
            return this.get('itemsLeft') === 0;
        },
        dependsFrom: 'itemsLeft'
    },

    itemsLeft: {
        type: 'string',
        calculate: function() {
            return this.get('list', 'raw').filter(function(todo) {
                return !todo.get('done');
            }).length;
        },
        dependsFrom: 'list'
    },

    itemsCompleted: {
        type: 'string',
        calculate: function() {
            return this.get('list', 'raw').filter(function(todo) {
                return todo.get('done');
            }).length;
        },
        dependsFrom: 'list'
    },

    hasCompleted: {
        type: 'boolean',
        calculate: function() {
            return this.get('itemsCompleted') !== 0;
        },
        dependsFrom: 'itemsCompleted'
    }

});

MODEL.decl('todo-item', {
    text: 'string',
    done: 'boolean'
});

provide(MODEL);

});
