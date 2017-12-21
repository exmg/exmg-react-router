import React from 'react';
import renderer from 'react-test-renderer';

import RouterProvider from '../RouterProvider/RouterProvider';
import Link from './Link';

global.requestAnimationFrame = cb => cb();

test('Link renders children', () => {
	const component = renderer.create(
		<RouterProvider>
			<Link to="/" exact>Home</Link>
			<Link to="/sub">Sub</Link>
		</RouterProvider>,
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
