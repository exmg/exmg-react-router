import React from 'react';
import renderer from 'react-test-renderer';

import RouterProvider from '../RouterProvider/RouterProvider';
import { Route } from '../Route';
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

const history = createHistory('memory');

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

test('prepends path from parent route for relative links', () => {
  history.push('/foo');

  const component = renderer.create(
		<RouterProvider>
      <Route path="/foo">
        <Link to="/bar">Absolute</Link>
        <Link to="/bar" relative>Relative</Link>
      </Route>
		</RouterProvider>,
	);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
