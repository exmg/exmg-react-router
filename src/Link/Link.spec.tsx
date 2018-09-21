import React from 'react';
import renderer from 'react-test-renderer';

import RouterProvider from '../RouterProvider/RouterProvider';
import { createHistory } from '../utils';
import Link from './Link';

declare global {
  namespace NodeJS {
    interface Global {
      requestAnimationFrame: (cb: () => void) => void;
    }
  }
}

global.requestAnimationFrame = cb => cb();

createHistory('memory');

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
