import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-dom/extend-expect';

import { RouterProvider } from '../RouterProvider';
import { createHistory, getHistory } from '../utils';
import { Route } from './Route';

declare global {
  namespace NodeJS {
    interface Global {
      requestAnimationFrame: (cb: () => void) => void;
    }
  }
}

global.requestAnimationFrame = cb => cb();

createHistory('memory');

const setLocation = (to: string) => new Promise((resolve) => {
  getHistory().push(to);

  setTimeout(resolve, 20);
});

test('Route renders children', (done) => {
  setLocation('/').then(() => {
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
  setLocation('/').then(() => {
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
  setLocation('/foo').then(() => {
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
  setLocation('/16/barry/some/args').then(() => {
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
  setLocation('/404').then(() => {
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
