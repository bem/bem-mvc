<<<<<<< HEAD
BEM.MODEL.decl('todos', {
=======
modules.define('model', function(provide, MODEL) {

MODEL.decl('todos', {
>>>>>>> Port todos bundle from v1, some cleanup

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
    },

    itemsLeft: {
        type: 'string',
        calculate: function() {
            return this.get('list', 'raw').filter(function(todo) {
                return !todo.get('done');
            }).length;
        },
        dependsFrom: 'list'
    }

});

<<<<<<< HEAD
BEM.MODEL.decl('todo-item', {
    text: 'string',
    done: 'boolean'
});
=======
MODEL.decl('todo-item', {
    text: 'string',
    done: 'boolean'
});

provide(MODEL);

});
>>>>>>> Port todos bundle from v1, some cleanup
