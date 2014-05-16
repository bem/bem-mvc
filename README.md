# BEM blocks library for MVCподумать как красиво

bem-mvc library contains of i-bem blocks to enable you to realize MVC-pattern. Gives you an API to work with models 
and blocks for automated binding of models with the interface.

**Due to active development of bem-core and bem-components libraries some functionalities may work incorrect! 
We work hard to stabilize it and welcome any efforts from you.**

Models' requirements:
*   Declarative style of models' description;
*   Access to created samples of models by names and id;
*   Automated adjustment of fields' values to given types;
*   Models' validation.

Bindings' requirements:
*   i-bem oriented;
*   Inheritance of own functionality in used i-bem blocks;
*   Bindings with controls from [bem-components](https://github.com/bem/bem-components).

Dependancies:
*   [bem-core](https://github.com/bem/bem-core)
*   [bem-components](https://github.com/bem/bem-components)

## Models

To use model it is necessary to declare it by seting up a name and fields' description
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
While declaring it is possible as well to set up model's methods (redefinition of basic methods of a model will cause an error)
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
Types of fields:
*  string;
*  number;
*  boolean;
*  model;
*  array;
*  models-list – a list of same type's models.

To create a model it is necessary to declare model's name and to pass initialized parameters if needed
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

In case of sample model's link absence it is possible to call it from an internal storage by name
````javascript
var model = BEM.MODEL.get('model')[0];
````

Now we can set models' fields
````javascript
model
    .set('weight', '80') // will be converted to number
    .set('height', 180)
    .update({
        weight: 80,
        height: 180
    });
````

And receive their values
````javascript
model.get('weight'); // 80
model.get('birth'); // '1970.8.25'

model.toJSON(); // all fields of a model
````

Events help us find out about changes
````javascript
model.on('weight', 'change', function() {
    alert('Time to loose some weight!');
});
````

To validate a model you need to set up validations rules
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
        validation: {             // to declare a validation function
            validate: function(value) {
                if (value < 170) return false;
            }
        }
    },
    weight: {
        type: 'number',
        validation: {
            rules: {               // or validation rules:
                required: true,      // standard
                toFat: {             // custom
                    needToValidate: function() {        // to check whether needs to be validated
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
And check for validity
````javascript
model.isValid();
````

## Bindings

To bind a model with a DOM we use `glue` block. This block will "glue" model with DOM.
To bind a model to any control it is necessary to mix to parent's block a `glue` block and 
to control — model-field element of `glue` block, and to give them model's parameters.

BEMJSON is such cases will look like the following
````javascript
{
    block: 'b-model',
    mix: [{
        block: 'glue',                   // mix in `glue` block
        js: {
            modelName: 'model',            // set up a model's name 
            modelData: {
                name: 'Claudia Schiffer',  // and data
                weight: 75,
                height: 180.5
            }
        }
    }],
    content: [
        ...

        {
            block: 'input',
            mix: [{                        // on enter field we mix in model-field element
                block: 'glue',
                elem: 'model-field',
                js: {
                    name: 'weight',         // give it a field to bind
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
A model with given parameters will be created after initialization. And changes withing the enter field 
will automatically appear in the model and vice versa.

Bindings types (model-field modifiers):
*  input – bind to `input` block;
*  select – bind to `select` block;
*  checkbox – bind to `checkbox` block;
*  inline – field value paste into html;
*  mod – block's modifier change.

## Models' aggregation

Unfortunately, not always setting up models with a help of `glue` block can be handy. 
If model's data is generated during templating you can use `model` block.
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
// or
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
In this case DOM will have as many elements as the end bemjson of `model` block will have. 
To avoid clogging of DOM by auxiliaries we can wrap any content in `model-aggregator` block.
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
As a result all `model` blocks inside the aggregator will be bild into one, and all models will be initialized
before other blocks' initialization.

## Testing

Launch `bem server` in root folder

Open `localhost:8080/desktop.bundles/all-tests/all-tests.html` page

TodoMVC example `localhost:8080/desktop.bundles/todos/todos.html`
