import React from 'react';
import renderer from 'react-test-renderer';

import RouterProvider from '../RouterProvider/RouterProvider';
import Route from './Route';

global.requestAnimationFrame = cb => cb();

const setHash = hash => new Promise((resolve) => {
	window.location.hash = hash;

	setTimeout(resolve, 100);
});

test('Route renders children', (done) => {
	setHash('/').then(() => {
		const component = renderer.create(
			<RouterProvider>
				<Route path="/" exact>Home</Route>
				<Route path="/foo">Foo</Route>
			</RouterProvider>,
		);

		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		done();
	});
});

test('Route renders functions', (done) => {
	setHash('/').then(() => {
		const component = renderer.create(
			<RouterProvider>
				<Route path="/" exact>{match => match && 'Foo'}</Route>
				<Route path="/foo">{match => match && 'Bar'}</Route>
				<Route path="/foo/bar">{() => 'Render anyway'}</Route>
			</RouterProvider>,
		);

		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		done();
	});
});

test('Route renders functions route: /foo', (done) => {
	setHash('/foo').then(() => {
		const component = renderer.create(
			<RouterProvider>
				<Route path="/" exact>{match => match && 'Foo'}</Route>
				<Route path="/foo">{match => match && 'Bar'}</Route>
				<Route path="/foo/bar">{() => 'Render anyway'}</Route>
			</RouterProvider>,
		);

		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		done();
	});
});

test('Route contains params', (done) => {
	setHash('/16/barry/some/args').then(() => {
		const component = renderer.create(
			<RouterProvider>
				<Route path="/:id/:name/:rest*">{(match, params) => JSON.stringify(params)}</Route>
				<Route path="/:rest*">{(match, params) => JSON.stringify(params)}</Route>
			</RouterProvider>,
		);

		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		done();
	});
});

test('Renders notFound route', (done) => {
	setHash('/404').then(() => {
		const component = renderer.create(
			<RouterProvider>
				<Route path="/" exact>Home</Route>
				<Route path="/bar">Bar</Route>
				<Route notFound>404 Not Found</Route>
			</RouterProvider>,
		);

		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		done();
	});
});
