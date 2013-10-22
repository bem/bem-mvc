modules.define('i-bem__dom', ['jquery', 'BEMHTML'], function(provide, $, BEMHTML, DOM) {

DOM.decl({ block: 'todos', baseBlock: 'glue' }, {

    onSetMod: {

        js: {
            inited: function() {
                this.__base();

                this.modelPath = this.model.path();
                this._newTodoInput = this.findBlockOn('new-todo-input', 'input');
                this._allDoneChecbox = this.findBlockOn('all-done', 'checkbox');

                // DOM-события на элементах блока
                this
                    .bindTo('new-todo-input', 'keypress', function(e, data) {
                        if (e.keyCode == 13) {
                            this.addTodoItem(this._newTodoInput.val());
                            this._newTodoInput.val('');
                        }
                    })
                    .bindTo('all-done', 'click', function(e, data) {
                        this.afterCurrentEvent(function() {
                            var state = this._allDoneChecbox.isChecked(),
                                todoItems = this.model.get('list', 'raw');

                            todoItems.forEach(function(item) {
                                item.set('done', state);
                            });
                        });
                    })
                    .bindTo('clear-completed', 'click', function() {
                        this.model.get('list')
                            .filter(function(todo) {
                                return todo.get('done');
                            })
                            .forEach(function(todo) {
                                todo.destruct();
                            });
                    })
                    .bindToWin('hashchange', function(e, data) {
                        this.model.set('show', this._getShowType());
                    });

                // события изменения модели
                this.model
                    .on('list', 'add', function(e, data) {
                        DOM.append(this.elem('todo-items'), this._generateTodoItem(data.model));
                    }, this)
                    .on('list', 'remove', function(e, data) {
                        this.findElem('todo-item', 'id', data.model.id).remove();
                    }, this)
                    .on('itemsLeft', 'change', function() {
                        var itemsLeft = this.model.get('itemsLeft');

                        DOM.update(this.elem('items-left'), itemsLeft == 0
                            ? '<b>All done</b>'
                            : itemsLeft == 1
                                ? '<b>1</b> item left'
                                : '<b>' + itemsLeft + '</b>' + ' items left');

                    }, this)
                    .on('show', 'change', function(e, data) {
                        this.delMod(this.elem('filter'), 'active');

                        this.setMod(this.elem('filter', 'type', data.value), 'active', 'yes');
                    }, this);

                this._initTodos();
            }
        }

    },

    /**
     * Инициализирует блок
     * @private
     */
    _initTodos: function() {
        this.updateTodos(this.model.get('list'));
        this.model.set('show', this._getShowType());
    },

    /**
     * Добавляет элемент в список
     * @param {String} text
     */
    addTodoItem: function(text) {
        if (!text) return;

        this.model.get('list').add({
            text: text
        });
    },

    /**
     * Обновляет содержимое контйнера элементов
     * @param {Array} todos
     */
    updateTodos: function(todos) {
        this.elem('todo-items').html('');

        todos && DOM.update(this.elem('todo-items'), BEMHTML.apply(todos.map(this._generateTodoItem, this)));
    },

    /**
     * Генерирует html элемента для вставки на страницу
     * @param {BEM.MODEL.FIELD} todo
     * @returns {String}
     * @private
     */
    _generateTodoItem: function(todo) {
        return BEMHTML.apply({
            block: 'todos',
            elem: 'todo-item',
            mods: $.extend({ id: todo.id }, todo.get('done') ? { completed: 'yes' } : {}),
            parentPath: this.modelPath,
            text: todo.get('text'),
            done: todo.get('done'),
            id: todo.id
        });
    },

    /**
     * Возвращает тип отображаемых элементов по хэшу
     * @returns {string}
     * @private
     */
    _getShowType: function() {
        switch (window.location.hash) {
            case '#/active':
                return 'active';
            case '#/completed':
                return 'completed';
            default:
                return 'all';
        }
    }

});


provide(DOM);

});
