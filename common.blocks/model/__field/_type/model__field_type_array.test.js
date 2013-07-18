BEM.TEST.decl('i-model__field_type_array', function() {

    describe('Field with type "array"', function() {
        BEM.MODEL.decl('array-type-field', {
            f: {
                type: 'array'
            }
        });

        it('should unshift values', function() {
            var model = BEM.MODEL.create('array-type-field', { f: [1, 2, 3] }),

                onUnshiftChange = jasmine.createSpy('onUnshiftChange'),
                onUnshiftAdd = jasmine.createSpy('onUnshiftAdd');

            model.on('f', 'change', onUnshiftChange);
            model.on('f', 'add', onUnshiftAdd);

            model.get('f').unshift(0);

            expect(model.get('f')).toEqual([0, 1, 2, 3]);
            expect(onUnshiftChange).toHaveBeenCalled();
            expect(onUnshiftAdd).toHaveBeenCalled();
        });

        it('should pop values', function() {
            var model = BEM.MODEL.create('array-type-field', { f: [1, 2, 3] }),

                onPopChange = jasmine.createSpy('onPopChange'),
                onPopRemove = jasmine.createSpy('onPopAdd');

            model.on('f', 'change', onPopChange);
            model.on('f', 'remove', onPopRemove);

            model.get('f').pop();

            expect(model.get('f')).toEqual([1, 2]);
            expect(onPopChange).toHaveBeenCalled();
            expect(onPopRemove).toHaveBeenCalled();
        });

        it('should shift values', function() {
            var model = BEM.MODEL.create('array-type-field', { f: [1, 2, 3] }),

                onShiftChange = jasmine.createSpy('onShiftChange'),
                onShiftRemove = jasmine.createSpy('onShiftAdd');

            model.on('f', 'change', onShiftChange);
            model.on('f', 'remove', onShiftRemove);

            model.get('f').shift();

            expect(model.get('f')).toEqual([2, 3]);
            expect(onShiftChange).toHaveBeenCalled();
            expect(onShiftRemove).toHaveBeenCalled();
        });

        it('should splice values', function() {
            var model = BEM.MODEL.create('array-type-field', { f: [1, 2, 3] }),

                onSpliceChange = jasmine.createSpy('onSpliceChange'),
                onSpliceRemove = jasmine.createSpy('onSpliceAdd'),
                onSpliceAdd = jasmine.createSpy('onSpliceAdd');

            model.on('f', 'change', onSpliceChange);
            model.on('f', 'remove', onSpliceRemove);
            model.on('f', 'add', onSpliceAdd);

            model.get('f').splice(1, 2, 5, 6, 7);

            expect(model.get('f')).toEqual([1, 5, 6, 7]);
            expect(onSpliceChange).toHaveBeenCalled();
            expect(onSpliceRemove).toHaveBeenCalled();
            expect(onSpliceAdd).toHaveBeenCalled();
        });

        it('should sort values', function() {
            var model = BEM.MODEL.create('array-type-field', { f: [2, 1, 3] }),

                onSortChange = jasmine.createSpy('onSortChange');

            model.on('f', 'change', onSortChange);

            model.get('f').sort();

            expect(model.get('f')).toEqual([1, 2, 3]);
            expect(onSortChange).toHaveBeenCalled();
        });

        it('should reverse values', function() {
            var model = BEM.MODEL.create('array-type-field', { f: [1, 2, 3] }),

                onReverseChange = jasmine.createSpy('onReverseChange');

            model.on('f', 'change', onReverseChange);

            model.get('f').reverse();

            expect(model.get('f')).toEqual([3, 2, 1]);
            expect(onReverseChange).toHaveBeenCalled();
        });

        it('should iterate values', function() {
            var model = BEM.MODEL.create('array-type-field', { f: [1, 2, 3] }),

                onForEach = jasmine.createSpy('forEach'),
                onMap = jasmine.createSpy('map');

            model.get('f').forEach(onForEach);
            model.get('f').map(onMap);

            expect(onForEach).toHaveBeenCalled();
            expect(onMap).toHaveBeenCalled();
        });

    });

});
