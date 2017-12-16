import {DynamicRowRenderModels} from './frontend';
import {rowTypeData} from '../schema/row-types';

test('it can get a model from the row type schema', () => {
	// find the first thing listed in rowTypeData configuration class
	const firstElement 	= rowTypeData[0];
	// return the model from the element
	const dynamic 		= DynamicRowRenderModels(firstElement.id);

	// do they match?
	expect(firstElement.model).toBe(dynamic);
})