__constructor(modelParams, modelParams.name, \[modelParams.id\], \[modelParams.parentName\], \[modelParams.parentPath\], \[modelParams.parentModel\], \[data\])
----------------------------------------------------------------------------------------------------
**Parameters**

**modelParams**:  *String|Object*,  параметры модели

**modelParams.name**:  *String*,  имя модели

**[modelParams.id]**:  *String|Number*,  идентификатор модели

**[modelParams.parentName]**:  *String*,  имя родительской модели

**[modelParams.parentPath]**:  *String*,  путь родительской модели

**[modelParams.parentModel]**:  *Object*,  экземпляр родительской модели

**[data]**:  *Object*,  данные для инициализации полей модели

path()
------
Возвращает путь модели


_initFields(data)
-----------------
Инициализирует поля модели


**Parameters**

**data**:  *Object*,  данные для инициализации полей модели

_calcDependsTo(name, opts)
--------------------------
Вычисляет значения зависимых полей


**Parameters**

**name**:  *String*,  имя поля

**opts**:  *Object*,  дополнительные параметры доступные в обработчиках событий

get(name, \[type\])
-------------------
Возвращает значение поля


**Parameters**

**name**:  *String*,  


**[type]**:  *String*,  формат представления значения. по умолчанию вызывается get, либо raw/formatted

set(name, value, \[opts\])
--------------------------
Задает значение полю модели


**Parameters**

**name**:  *String*,  имя поля

**value**:  ***,  значение

**[opts]**:  *Object*,  дополнительные параметры доступные в обработчиках событий change

clear(\[name\], \[opts\])
-------------------------
Очищает поля модели


**Parameters**

**[name]**:  *String*,  имя поля

**[opts]**:  *Object*,  дополнительные параметры доступные в обработчиках событий change

update(data, \[opts\])
----------------------
Задает поля модели по данным из объекта, генерирует событие update на модели


**Parameters**

**data**:  *Object*,  данные устанавливаемые в модели

**[opts]**:  *Object*,  доп. параметры

hasField(name)
--------------
Проверяет наличие поля у модели


**Parameters**

**name**:  *String*,  имя поля

isEmpty(\[name\])
-----------------
Проверяет поле или всю модель на пустоту


**Parameters**

**[name]**:  *String*,  


isChanged(\[name\])
-------------------
Проверяет, изменилось ли значение поля или любого из полей с момента последней фиксации


**Parameters**

**[name]**:  *String*,  имя поля

getType(name)
-------------
Возвращает тип поля


**Parameters**

**name**:  *String*,  имя поля

fix(\[opts\])
-------------
Кеширует значения полей модели, генерирует событие fix на модели


**Parameters**

**[opts]**:  *Object*,  доп. параметры

rollback(\[opts\])
------------------
Восстанавливает значения полей модели из кеша, генерирует событие update на модели


**Parameters**

**[opts]**:  *Object*,  доп. параметры

toJSON()
--------
Возвращает объект с данными модели


on(\[field\], e, \[data\], fn, ctx)
-----------------------------------
Назначает обработчик события на модель или поле модели


**Parameters**

**[field]**:  *String*,  имя поля

**e**:  *String*,  имя события

**[data]**:  *Object*,  дополнительные данные события

**fn**:  *Function*,  обработчик события

**ctx**:  *Object*,  контекст вызова обработчика

un(\[field\], e, fn, ctx)
-------------------------
Удаляет обработчик события с модели или поля модели


**Parameters**

**[field]**:  *String*,  имя поля

**e**:  *String*,  имя события

**fn**:  *Function*,  обработчик события

**ctx**:  *Object*,  контекст вызова обработчика

trigger(\[field\], e, \[data\])
-------------------------------
Тригерит обработчик события на модели или поле модели


**Parameters**

**[field]**:  *String*,  имя поля

**e**:  *String*,  имя события

**[data]**,  данные доступные в обработчике события

_onFieldChange(name, opts)
--------------------------
Тригерит (с декоратором $.throttle) событие change на модели при изменении полей


**Parameters**

**name**:  *String*,  имя поля

**opts**:  *Object*,  доп. параметры

_fireChange(opts)
-----------------
Сгенерировать событие change на модели


**Parameters**

**opts**:  *Object*,  


destruct()
----------
Удаляет модель из хранилища


isValid()
---------
Возвращает результат проверки модели на валидность


validate(\[name\])
------------------
Проверяет модель на валидность, генерирует событие error с описанием ошибки(ок)


**Parameters**

**[name]**:  *String*,  - имя поля

decl(decl, decl.model|decl.name, \[decl.baseModel\], {{, staticProps)
---------------------------------------------------------------------
Декларирует описание модели
XXX: {String|Number},
XXX: {
{String} [type] тип поля
{Boolean} [internal] внутреннее поле
{*|Function} [default] дефолтное значение
{*|Function} [value] начальное значение
{Object|Function} [validation] ф-ия конструктор объекта валидации или он сам
{Function} [format] ф-ия форматирования
{Function} [preprocess] ф-ия вызываемая до записи значения
{Function} [calculate] ф-ия вычисления значения, вызывается, если изменилось одно из связанных полей
{String|Array} [dependsFrom] массив от которых зависит значение поля
}
}} fields где ключ имя поля, значение строка с типом или объект вида


**Parameters**

**decl**:  *String|Object*,  


**decl.model|decl.name**:  *String*,  


**[decl.baseModel]**:  *String*,  


**{{**,  


**staticProps**:  *Object*,  Статические методы и поля

_buildDeps(fieldDecl, modelName)
--------------------------------
Устанавливает связи между зависимыми полями


**Parameters**

**fieldDecl**:  *Object*,  декларация полей

**modelName**:  *String*,  имя модели

create(modelParams, modelParams.name, \[modelParams.id\], \[modelParams.parentName\], \[modelParams.parentId\], \[modelParams.parentPath\], \[modelParams.parentModel\], \[data\])
----------------------------------------------------------------------------------------------------
Создает экземпляр модели


**Parameters**

**modelParams**:  *String|Object*,  имя модели или параметры модели

**modelParams.name**:  *String*,  имя модели

**[modelParams.id]**:  *String|Number*,  идентификатор, если не указан, создается автоматически

**[modelParams.parentName]**:  *String*,  имя родительской модели

**[modelParams.parentId]**:  *String|Number*,  идентификатор родительской модели

**[modelParams.parentPath]**:  *String*,  путь родительской модели

**[modelParams.parentModel]**:  *Object*,  экземпляр родительской модели

**[data]**:  *Object*,  данные, которыми будет проинициализирована модель

get(modelParams, modelParams.name, \[modelParams.id\], \[modelParams.path\], \[modelParams.parentName\], \[modelParams.parentId\], \[modelParams.parentPath\], \[modelParams.parentModel\], \[dropCache\])
----------------------------------------------------------------------------------------------------
Возвращает экземпляр или массив экземпляров моделей по имени и пути


**Parameters**

**modelParams**:  *String|Object*,  имя модели или параметры модели

**modelParams.name**:  *String*,  имя модели

**[modelParams.id]**:  *String|Number*,  идентификатор, если не указан, создается автоматически

**[modelParams.path]**:  *String*,  путь модели

**[modelParams.parentName]**:  *String*,  имя родительской модели

**[modelParams.parentId]**:  *String|Number*,  идентификатор родительской модели

**[modelParams.parentPath]**:  *String*,  путь родительской модели

**[modelParams.parentModel]**:  *Object*,  экземпляр родительской модели

**[dropCache]**:  *Boolean*,  Не брать значения из кеша

getOne(modelParams, dropCache)
------------------------------
Возвращает экземпляр модели по имени или пути


**Parameters**

**modelParams**:  *Object|String*,  @see get.modelParams

**dropCache**:  *Boolean*,  @see get.dropCache

on(modelParams, \[field\], e, fn, \[ctx\])
------------------------------------------
Назначает глобальный обработчик событий на экземпляры моделей по пути


**Parameters**

**modelParams**:  *String|Object*,  Имя модели или параметры описывающие path модели

**[field]**:  *String*,  имя поля

**e**:  *String*,  имя события

**fn**:  *Function*,  обработчик события

**[ctx]**:  *Object*,  контекст выполнения обработчика

un(modelParams, \[field\], e, fn, \[ctx\])
------------------------------------------
Удаляет глобальный обработчик событий на экземпляры моделей по пути


**Parameters**

**modelParams**:  *String|Object*,  Имя модели или параметры описывающие path модели

**[field]**:  *String*,  имя поля

**e**:  *String*,  имя события

**fn**:  *Function*,  обработчик события

**[ctx]**:  *Object*,  контекст выполнения обработчика

trigger(modelParams, \[field\], e, \[data\])
--------------------------------------------
Тригерит событие на моделях по имени и пути


**Parameters**

**modelParams**:  *String|Object*,  Имя модели или параметры описывающие path модели

**[field]**:  *String*,  имя поля

**e**:  *String*,  имя события

**[data]**:  *Object*,  данные передаваемые в обработчик события

_bindToModel(model)
-------------------
Назначает глобальные обработчики событий на экземпляр модели


**Parameters**

**model**:  *BEM.MODEL*,  экземпляр модели

_bindToFields(model)
--------------------
Назначает глобальные обработчики событий на поля экземпляра модели


**Parameters**

**model**:  *BEM.MODEL*,  экземпляр модели

_bindToEvents(model, events)
----------------------------
Хелпер навешивания событий на экземпляр модели


**Parameters**

**model**:  *BEM.MODEL*,  экземпляр модели

**events**:  *Object*,  события

_addModel(model)
----------------
Добавляет модель в хранилище


**Parameters**

**model**:  *BEM.MODEL*,  экземпляр модели

destruct(modelParams)
---------------------
Уничтожает экземпляр модели, удаляет его из хранилища


**Parameters**

**modelParams**:  *BEM.MODEL|String|Object*,  Модель, имя модели или параметры описывающие path модели

buildPath(pathParts, pathParts.name, \[pathParts.id\], \[pathParts.parentName\], \[pathParts.parentId\], \[pathParts.parentPath\], \[pathParts.parentModel\], \[pathParts.childName\], \[pathParts.childId\], \[pathParts.childPath\], \[pathParts.childModel\])
----------------------------------------------------------------------------------------------------
Возвращает путь к модели по заданным параметрам




**Parameters**

**pathParts**:  *Object|Array*,  параметры пути

**pathParts.name**:  *String*,  имя модели

**[pathParts.id]**:  *String|Number*,  идентификатор модели

**[pathParts.parentName]**:  *String*,  имя родительской модели

**[pathParts.parentId]**:  *String|Number*,  идентификатор родительской модели

**[pathParts.parentPath]**:  *String|Object*,  путь родительской модели

**[pathParts.parentModel]**:  *BEM.MODEL*,  экземпляр родительской модели

**[pathParts.childName]**:  *String*,  имя дочерней модели

**[pathParts.childId]**:  *String|Number*,  идентификатор дочерней модели

**[pathParts.childPath]**:  *String|Object*,  путь дочерней модели

**[pathParts.childModel]**:  *BEM.MODEL*,  экземпляр дочерней модели

_getPathRegexp(path)
--------------------
Возвращает строку для построения регулярного выражения проверки пути


**Parameters**

**path**:  *String*,  


forEachModel(callback, modelParams, \[dropCache\])
--------------------------------------------------
Выполняет callback для каждой модели найденной по заданному пути. Если callback вернул false, то
итерация останавливается


**Parameters**

**callback**:  *Function*,  ф-ия выполняемая для каждой модели

**modelParams**:  *String|Object*,  параметры модели

**[dropCache]**:  *Boolean*,  Не брать значения из кеша

class Конструктор модели
------------------------
