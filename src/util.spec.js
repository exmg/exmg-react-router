import { equals } from './util';

describe('equals', () => {
	it('should equal empty object', () => {
		const a = {};
		const b = {};

		expect(equals(a, b)).toBe(true);
	});

	it('should equal filled object', () => {
		const a = { foo: 'bar' };
		const b = { foo: 'bar' };

		expect(equals(a, b)).toBe(true);
	});

	it('should not equal filled object with different values', () => {
		const a = { foo: 'bar' };
		const b = { foo: 'BAZ' };

		expect(equals(a, b)).toBe(false);
	});

	it('should not equal with different keys', () => {
		const a = { foo: 'bar' };
		const b = { baz: 'bar' };

		expect(equals(a, b)).toBe(false);
	});
});
