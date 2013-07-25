# Yet another MVC for i-bem

Набор i-bem блоков для реализации MVC-паттерна. Предоставляет API для работы с моделями и блоки для автоматического провязывания моделей с интерфейсом.

Требования к моделям
*   Декларативный стиль описания моделей
*   Доступ к созданным экземплярам моделей по имени и id
*   Автоматическое приведение значений полей к заданному типу
*   Валидация моделей

Требование к биндингам
*   i-bem ориентированость
*   Наследование собственной функциональсти в использующих i-bem блоках
*   Провязка с контролами из [bem-controls](https://github.com/bem/bem-controls)

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
Типы полей
*  string – строка
*  number – число
*  boolean – булеан
*  model – модель
*  array – массив произвольных данных
*  model-list – список моделей одного типа

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

## Ссылки
JS Docs:

*  [Models API](https://github.com/bem/bem-mvc/blob/v2/common.blocks/model/model.md)
*  [glue](https://github.com/bem/bem-mvc/blob/v2/common.blocks/glue/glue.md)
