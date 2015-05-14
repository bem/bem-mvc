# Yet another MVC for i-bem

Набор i-bem блоков для реализации MVC-паттерна. Предоставляет API для работы с моделями и блоки для автоматического провязывания моделей с интерфейсом.

Требования к моделям
*   Декларативный стиль описания моделей
*   Доступ к созданным экземплярам моделей по имени и id 
*   Автоматическое приведение значений полей к заданному типу
*   Валидация моделей

Требование к биндингам
*   i-bem ориентированность
*   Наследование собственной функциональности в использующих i-bem блоках
*   Провязка с контролами из [bem-controls](https://github.com/bem/bem-controls)

Зависимости
*   [bem-bl](https://github.com/bem/bem-bl)
*   [bem-controls](https://github.com/bem/bem-controls)

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
Также при декларации можно указать методы модели (переопределение базовых методов модели породит ошибку).
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
                return value >= 170; 
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
                        return this.get('height') > 170;
                    },
                    validate: function(value) {
                        return value <= 90;
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
Для провязывания модели с DOM-представлением используется блок i-glue. Блок которой "проклеивает" модель и DOM.
Для того, чтобы провязать модель с каким либо контролом, необходимо на родительский блок примешать блок i-glue, а на контрол элемент model-field блока i-glue и указать им параметры модели.
BEMJSON в таком случае будет выглядеть так:
````javascript
{
    block: 'b-model',
    mix: [{
        block: 'i-glue',                   // примешиваем блок i-glue
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
                block: 'i-glue', 
                elem: 'model-field',
                js: {
                    name: 'weight',         // указываем ему с каким полем провязываться
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
Иногда создание моделей с помощью блока `i-glue` может быть неудобной. Для случая, когда данные для модели генерируются во время шаблонизации, можно использовать блок `i-model`.
```javascript
{
    block: 'i-model',
    modelName: 'super-model',
    modelData: {
        name: 'Claudia Schiffer',
        weight: 75,
        height: 180.5
    }
}
// или
{
    block: 'i-model',
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
В таком случае в DOM'е появится столько элементов, сколько в конечном bemjson'е блоков i-model. Чтобы избежать засорения DOM'а вспомогательными объектам, можно любой контент обернуть в блок `i-model-aggregator`
```javascript
{
    block: 'i-model-aggregator',
    content: [
        { block: 'i-model', modelName: 'model1' },
        {
            block: 'view-block',
            content: [
                { block: 'i-model', modelName: 'model2' }
            ]
        },
        { block: 'i-model', modelName: 'model3' }
    ]
}
```
В итоге все блоки `i-model` внутри агрегатора будут объединены в один и модели будут проинициализированы до инициализации других блоков.

## Тестирование

Запустить в корне `bem server`

Открыть страницу `localhost:8080/desktop.bundles/tests/tests.html`

## Ссылки
JS Docs:

*  [Models API](https://github.com/dosyara/yamvc/blob/master/common.blocks/i-model/i-model.md)
*  [i-glue](https://github.com/dosyara/yamvc/blob/master/common.blocks/i-glue/i-glue.md)
