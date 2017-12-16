import {
	Bootstrap3ColumnsCreator, 
	Bootstrap3Column, 
	Bootstrap3IntroductionText,
	makeNewColumn
} from './row-type-bootstrap';


test('it can generate a new column', () => {
	const column = makeNewColumn('foobarbaz123');

	expect(column.cssClass).toBeDefined();
	expect(column.id).toBeDefined();
	expect(column.id).toMatch('foobarbaz123');

})