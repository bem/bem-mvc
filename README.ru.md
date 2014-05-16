# Библиотека БЭМ-блоков для реализации MVC-паттерна

Набор i-bem блоков для реализации MVC-паттерна. Предоставляет API для работы с моделями и блоки для автоматического провязывания моделей с интерфейсом.

**В связи с активной разработкой в бибилиотеках bem-core и bem-components некоторая функциональность может работать некорретно! Мы работаем над стабилизацией и не откажемся от любой помощи в этом**

Требования к моделям
*   Декларативный стиль описания моделей
*   Доступ к созданным экземплярам моделей по имени и id
*   Автоматическое приведение значений полей к заданному типу
*   Валидация моделей

Требование к биндингам
*   i-bem ориентированость
*   Наследование собственной функциональсти в использующих i-bem блоках
*   Провязка с контролами из [bem-components](https://github.com/bem/bem-components)

Зависимости
*   [bem-core](https://github.com/bem/bem-core)
*   [bem-components](https://github.com/bem/bem-components)

## Модели
Для использования модели необходимо задекларировать её, указав имя модели и описав поля.
````javascript
BEM.MODEL.decl('model', {
    name: 'string',
    birth: {
        type: 'string',
        preprocess: function(value) {
            return value.year + '.' + value.month + '.' + value.day;
        }
    },
    height: 'number',
    weight: 'number'
});
````
Также при декларации можно указать методы модели (переопределение бащовых методов модели породит ошибку).
````javascript
BEM.MODEL.decl('model', {
    name: 'string',
    hasBoyfriend: {
        type: 'boolean',
        default: false
    }
}, {
    toggleStatus: function() {
        this.set('hasBoyfriend', !this.get('hasBoyfriend'));

        return this;
    }
});

var model = BEM.MODEL.create('model', { name: 'Claudia Schiffer', hasBoyfriend: true });
model.toggleStatus();
model.get('hasBoyfriend'); // false
````
Типы полей
*  string – строка
*  number – число
*  boolean – булеан
*  model – модель
*  array – массив произвольных данных
*  models-list – список моделей одного типа

Чтобы создать модель, нужно указать имя модели и, если нужно, передать инициализационные параметры
````javascript
var model = BEM.MODEL.create('model', {
    name: 'Claudia Schiffer',
    birth: {
        year: 1970,
        year: 1970,
        month: 8,
        day: 25
    },
    weight: 75,
    height: 180.5
});
````

В случае, когда отсутствует ссылка на экземпляр модели, ее можно запросить из хранилища, например, по имени
````javascript
var model = BEM.MODEL.get('model')[0];
````

Теперь можно устанавливать поля модели
````javascript
model
    .set('weight', '80') // будет приведено к number
    .set('height', 180)
    .update({
        weight: 80,
        height: 180
    });
````

И получать их значения
````javascript
model.get('weight'); // 80
model.get('birth'); // '1970.8.25'

model.toJSON(); // все поля модели
````

О изменениях можно узнавать с помощью событий
````javascript
model.on('weight', 'change', function() {
    alert('Пора худеть!');
});
````

Чтобы валидировать модель, нужно задать правила валидации
````javascript
BEM.MODEL.decl('model-with-validation', {
    name: 'string',
    birth: {
        type: 'string',
        preprocess: function(value) {
            return value.year + '.' + value.month + '.' + value.day;
        }
    },
    height: {
        type: 'number',
        validation: {             // задать функцию валидации
            validate: function(value) {
                if (value < 170) return false;
            }
        }
    },
    weight: {
        type: 'number',
        validation: {
            rules: {               // или правила валидации:
                required: true,      // стандартное
                toFat: {             // и кастомное
                    needToValidate: function() {        // проверить нужно ли выполнять валидацию
                        if (this.get('height') > 170) return true;
                    },
                    validate: function(value) {
                        if (value > 90) return false;
                    }
                }
            }
        }
    }
});
````
И проверить на валидность
````javascript
model.isValid();
````

## Биндинги
Для провязывания модели с DOM-представлением используется блок glue. Блок которой "проклеивает" модель и DOM.
Для того, чтобы провязать модель с каким либо контролом, необходимо на родительский блок примешать блок glue, а на контрол элемент model-field блока glue и указать им параметры модели.
BEMJSON в таком случае будет выглядеть так:
````javascript
{
    block: 'b-model',
    mix: [{
        block: 'glue',                   // примешиваем блок glue
        js: {
            modelName: 'model',            // указываем имя модели
            modelData: {
                name: 'Claudia Schiffer',  // и данные
                weight: 75,
                height: 180.5
            }
        }
    }],
    content: [
        ...

        {
            block: 'input',
            mix: [{                        // на поле ввода примешиваем элемент model-field
                block: 'glue',
                elem: 'model-field',
                js: {
                    name: 'weight',         // указываем ему с каким полем провязыватсья
                    type: 'input'
                }
            }],
            name: 'weight',
            value: '75',
            mods: { size: 's' },
            content: { elem: 'control' }
        }

        ...
    ]
}
````
После инициализации будет создана модель, с указанными данным. И изменения в поле ввода, будут автоматически отражаться в модели (и наоборот).

Типы биндингов (модификаторы model-field)
*  input – провязка с блоком input
*  select – провязка с блоком select
*  checkbox – провязка с блоком checkbox
*  inline – вставка значения поля в html
*  mod – изменение модификатора блока

## Агрегация моделей
Иногда создание моделей с помощью блока `glue` может быть неудобной. Для случая, когда данные для модели генерируются во время шаблонизации, можно использовать блок `model`.
```javascript
{
    block: 'model',
    modelName: 'super-model',
    modelData: {
        name: 'Claudia Schiffer',
        weight: 75,
        height: 180.5
    }
}
// или
{
    block: 'model',
    modelParams: {
        name: 'super-model',
        data: {
            name: 'Claudia Schiffer',
            weight: 75,
            height: 180.5
        }
    }
}
```
В таком случае в DOM'е появится столько элементов, сколько в конечном bemjson'е блоков model. Чтобы избежать засорения DOM'а вспомогательными объектам, можно любой контент обернуть в блок `model-aggregator`
```javascript
{
    block: 'model-aggregator',
    content: [
        { block: 'model', modelName: 'model1' },
        {
            block: 'view-block',
            content: [
                { block: 'model', modelName: 'model2' }
            ]
        },
        { block: 'model', modelName: 'model3' }
    ]
}
```
В итоге все блоки `model` внутри агрегатора будут объеденены в один и модели будут проинициализированы до инииализации других блоков.

## Тестирование

Запустить в корне `bem server`

Открыть страницу `localhost:8080/desktop.bundles/all-tests/all-tests.html`

Пример TodoMVC `localhost:8080/desktop.bundles/todos/todos.html`

## Ссылки
JS Docs:

*  [Models API](https://github.com/bem/bem-mvc/blob/v2/common.blocks/model/model.md)
*  [glue](https://github.com/bem/bem-mvc/blob/v2/common.blocks/glue/glue.md)
