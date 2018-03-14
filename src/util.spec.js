import { shallowEqual, routerStateEqual } from './util';

describe('shallowEqual', () => {
	it('should equal empty object', () => {
		const a = {};
		const b = {};

		expect(shallowEqual(a, b)).toBe(true);
	});

	it('should equal filled object', () => {
		const a = { foo: 'bar' };
		const b = { foo: 'bar' };

		expect(shallowEqual(a, b)).toBe(true);
	});

	it('should not equal filled object with different values', () => {
		const a = { foo: 'bar' };
		const b = { foo: 'BAZ' };

		expect(shallowEqual(a, b)).toBe(false);
	});

	it('should not equal with different keys', () => {
		const a = { foo: 'bar' };
		const b = { baz: 'bar' };

		expect(shallowEqual(a, b)).toBe(false);
	});

	it('should not equal with different amount of keys', () => {
		const a = { foo: 'bar' };
		const b = { foo: 'bar', baz: 'bar' };

		expect(shallowEqual(a, b)).toBe(false);
	});
});

describe('routerStateEqual', () => {
	it('should equal falsy match', () => {
		const a = { match: false };
		const b = { match: false };

		expect(routerStateEqual(a, b)).toBe(true);
	});

	it('should not equal new match', () => {
		const a = { match: false };
		const b = { match: {} };

		expect(routerStateEqual(a, b)).toBe(false);
	});

	it('should equal same path and params', () => {
		const a = { match: { pathname: '', params: { a: 'b' } } };
		const b = { match: { pathname: '', params: { a: 'b' } } };

		expect(routerStateEqual(a, b)).toBe(true);
	});

	it('should not equal with different params', () => {
		const a = { match: { pathname: '', params: { a: 'b' } } };
		const b = { match: { pathname: '', params: { a: 'c' } } };

		expect(routerStateEqual(a, b)).toBe(false);
	});
});

