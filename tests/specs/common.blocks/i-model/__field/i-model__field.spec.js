'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),

    sinonChai = require('sinon-chai'),

    universalBundle = require('fs').readFileSync('./desktop.bundles/universal/_universal.js').toString(),
    createModels = new Function('BEM', universalBundle);

chai.use(sinonChai);

describe('i-model__field', function() {
    beforeEach(function() {
        GLOBAL.BEM = { MODEL: {} };

        createModels(GLOBAL.BEM);
    });

    describe('internal', function() {
        it('should not return internal fields in toJSON', function() {
            BEM.MODEL.decl('model', { field1: { type: '', internal: true }, field2: '' });

            var model = BEM.MODEL.create('model', { field1: 'val1', field2: 'val2' });

            expect(model.toJSON()).to.eql({ field2: 'val2' });
        });
    });

    describe('default', function() {
        it('should init field with default value', function() {
            BEM.MODEL.decl('model', { field: { type: '', default: 'def val' } });

            var model = BEM.MODEL.create('model');

            expect(model.get('field')).to.equal('def val');
        });

        it('should init field with default value from function', function() {
            BEM.MODEL.decl('model', { field: { type: '', default: function() { return 'def val'; } } });

            var model = BEM.MODEL.create('model');

            expect(model.get('field')).to.equal('def val');
        });

        it('should set default value to field if value is empty', function() {
            BEM.MODEL.decl('model', { field: { type: '', default: 'def val' } });

            var model = BEM.MODEL.create('model', { field: 'init value' });

            model.set('field', undefined);

            expect(model.get('field')).to.equal('def val');
        });
    });

    describe('value', function() {
        it('should init field with default value', function() {
            BEM.MODEL.decl('model', { field: { type: '', value: 'init val' } });

            var model = BEM.MODEL.create('model');

            expect(model.get('field')).to.equal('init val');
        });
    });

    describe('format', function() {
        it('should return default formatted value', function() {
            BEM.MODEL.decl('model', { field: { type: '' } });

            var model = BEM.MODEL.create('model');

            model.set('field', 1);

            expect(model.get('field', 'format')).to.equal('1');
        });

        it('should return formatted value', function() {
            BEM.MODEL.decl('model', { field: { type: '', format: function(val) { return val + '!' } } });

            var model = BEM.MODEL.create('model');

            model.set('field', 'val');

            expect(model.get('field', 'format')).to.equal('val!');
        });

        it('should return formatted value with options', function() {
            BEM.MODEL.decl('model', {
                field: {
                    type: '',
                    format: function(val, opts) { return val + opts.option },
                    formatOptions: { option: '?' }
                }
            });

            var model = BEM.MODEL.create('model');

            model.set('field', 'val');

            expect(model.get('field', 'format')).to.equal('val?');
        });
    });

    describe('preprocess', function() {
        it('should pre-process value on init', function() {
            BEM.MODEL.decl('model', { field: { type: '', preprocess: function(val) { return val + '!' } } });

            var model = BEM.MODEL.create('model', { field: 'init val' });

            expect(model.get('field')).to.equal('init val!');
        });

        it('should pre-process value before set', function() {
            BEM.MODEL.decl('model', { field: { type: '', preprocess: function(val) { return val + '!' } } });

            var model = BEM.MODEL.create('model');

            model.set('field', 'val');

            expect(model.get('field')).to.equal('val!');
        });

        it('should return unprocessed value', function() {
            BEM.MODEL.decl('model', { field: { type: '', preprocess: function(val) { return val + '!' } } });

            var model = BEM.MODEL.create('model');

            model.set('field', 'val');

            expect(model.get('field', 'raw')).to.equal('val');
        });

        it('should pre-process value from isEqual method', function() {
            BEM.MODEL.decl('model', { field: { type: '', preprocess: function(val) { return val + '!' } } });

            var model = BEM.MODEL.create('model', { field: 'val' });

            expect(model.isEqual({ field: 'val' })).to.equal(true);
        });
    });

    describe('calculate', function() {
        it('should return calculated value', function() {
            BEM.MODEL.decl('model', {
                field: {
                    type: '',
                    calculate: function() { return 'val' }
                }
            });

            var model = BEM.MODEL.create('model');

            expect(model.get('field')).to.equal('val');
        });

        it('should return calculated value by other fields', function() {
            BEM.MODEL.decl('model', {
                field1: '',
                field2: {
                    type: '',
                    calculate: function() { return this.get('field1') + '!' }
                }
            });

            var model = BEM.MODEL.create('model', { field1: 'val' });

            expect(model.get('field2')).to.equal('val!');
        });

        it('should calculated value by one filed and return it', function() {
            BEM.MODEL.decl('model', {
                field1: '',
                field2: {
                    type: '',
                    calculate: function(val) { return val + '!' },
                    dependsFrom: ['field1']
                }
            });

            var model = BEM.MODEL.create('model', { field1: 'val' });

            expect(model.get('field2')).to.equal('val!');
        });

        it('should calculated value by fileds and return it', function() {
            BEM.MODEL.decl('model', {
                field1: '',
                field2: '',
                field3: {
                    type: '',
                    calculate: function(vals) { return vals.field1 + vals.field2 },
                    dependsFrom: ['field1', 'field2']
                }
            });

            var model = BEM.MODEL.create('model', { field1: 'val1', field2: 'val2' });

            expect(model.get('field3')).to.equal('val1val2');
        });
    });

    describe('validation', function() {
        it('by default is valid', function() {
            BEM.MODEL.decl('model', { field: '' });

            var model = BEM.MODEL.create('model');

            expect(model.isValid()).to.equal(true);
        });

        it('could be defined by function', function() {
            BEM.MODEL.decl('model', {
                field: {
                    type: '',
                    validation: function() {
                        return {
                            validate: function() {
                                return false;
                            }
                        }
                    }
                }
            });

            var model = BEM.MODEL.create('model');

            expect(model.isValid()).to.equal(false);
        });

        describe('@validate', function() {
            it('should be valid if result is true', function() {
                BEM.MODEL.decl('model', {
                    field: {
                        type: '',
                        validation: {
                            validate: function() {
                                return true;
                            }
                        }
                    }
                });

                var model = BEM.MODEL.create('model');

                expect(model.isValid()).to.equal(true);
            });

            it('should not be valid if result is false', function() {
                BEM.MODEL.decl('model', {
                    field: {
                        type: '',
                        validation: {
                            validate: function() {
                                return false;
                            }
                        }
                    }
                });

                var model = BEM.MODEL.create('model');

                expect(model.isValid()).to.equal(false);
            });
        });

        describe('@needToValidate', function() {
            it('should not check validation if result is false', function() {
                BEM.MODEL.decl('model', {
                    field: {
                        type: '',
                        validation: {
                            validate: function() {
                                return false;
                            },
                            needToValidate: function() {
                                return false;
                            }
                        }
                    }
                });

                var model = BEM.MODEL.create('model');

                expect(model.isValid()).to.equal(true);
            });

            it('should check validation if result is true', function() {
                BEM.MODEL.decl('model', {
                    field: {
                        type: '',
                        validation: {
                            validate: function() {
                                return false;
                            },
                            needToValidate: function() {
                                return true;
                            }
                        }
                    }
                });

                var model = BEM.MODEL.create('model');

                expect(model.isValid()).to.equal(false);
            });
        });

        describe('@text', function() {
            it('should return error text', function() {
                BEM.MODEL.decl('model', {
                    field: {
                        type: '',
                        validation: {
                            validate: function() {
                                return false;
                            },
                            text: 'err text'
                        }
                    }
                });

                var model = BEM.MODEL.create('model'),
                    onErrorSpy = sinon.spy();

                model.on('field', 'error', onErrorSpy);
                model.isValid();

                expect(onErrorSpy.lastCall.args[1]).be.eql({ field: 'field', text: 'err text' });
            });
        });

        describe('@rules', function() {
            it('should not be valid if false is returned', function() {
                BEM.MODEL.decl('model', {
                    field: {
                        type: '',
                        validation: {
                            rules: {
                                invalid: {
                                    validate: function() {
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                });

                var model = BEM.MODEL.create('model');

                expect(model.isValid()).to.equal(false);
            });
        });
    });

});
