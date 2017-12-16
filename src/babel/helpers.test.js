import {
	isEmpty, 
	makeid, 
	GetIndexByKey,
	ReturnArrayIfUndefined

} from './helpers';


const thingy = [
	{
		id: 'foo',
		value: 'orange'
	},
	{
		id: 'bar',
		value: 'green'
	},
	{
		id: 'baz',
		value: 'blue'
	}
]


test('it can determine if an object is not empty', () => {
	expect(isEmpty({foo:'bar'})).toBe(false)
})

test('it can determine if an object is empty', () => {
	expect(isEmpty({})).toBe(true)
})

test('it can generate a unique id', () => {
	expect(makeid()).not.toBeNull()
})
test('it can generate a unique id to a specific length', () => {
	expect(makeid(15)).toHaveLength(15)
})

test('it can get the index of an array of objects', () => {
	

	expect(
		GetIndexByKey('id', 'foo', thingy)
	).toEqual(0);

	expect(
		GetIndexByKey('id', 'baz', thingy)
	).toEqual(2);
})

test('it can return an empty array if a variable is undefined/empty/null', () => {
	const useme = {
		1: 'abc123',
		2: 123456,
		3: null,
		4: ''
	}
	const RAID = ReturnArrayIfUndefined;

	expect(RAID(useme[1])).toBe('abc123');
	expect(RAID(useme)).toBe(useme);
	// I think this is the only way to test for an undefined variable in jest
	// React props can be passed undefined without problems anyways I think.
	expect(RAID(useme[17])).toEqual([]);
})