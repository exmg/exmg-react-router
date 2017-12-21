# exmg-react-router

Hash based router for react.

## Demo

> TODO Check out the [demo](http://exmg.github.io/exmg-react-router/demo/).

> TODO Add animated example <div className={ match ? 'route-is-active' : '' }></div> ?

## Install

```bash
npm install exmg-react-router
```

## Usage

### Example

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider, Route, Link } from 'exmg-react-router';

ReactDOM.render(
    <RouterProvider>
        <div className="body">
            <Route path="/" exact>
                <h1>Home</h1>
            </Route>
            <Route path="/hello/:name">
                { (match, params) => (match && <h1>Hello { params.name }</h1>) }
            </Route>
        </div>
        <footer>
            <Link to="/">Home</Link>
            <Link to="/hello/World!">Hello World</Link>
        </footer>
    </RouterProvider>,
    document.getElementById('app')
);
```

### Example sub routes

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider, Route, Link } from 'exmg-react-router';

ReactDOM.render(
    <RouterProvider>
        <div className="body">
            <Route path="/" exact>
                <h1>Home</h1>
            </Route>
            <Route path="/foo">
                { /* Routes will inherit path, so absolute path will be /foo */ }
                <Route path="/" exact>
                    <h1>Foo /</h1>
                </Route>
                { /* And /foo/bar */ }
                <Route path="/bar" exact>
                    <h1>Foo /bar</h1>
                </Route>

                { /* Links have absolute path */ }
                <Link to="/foo">
                    Foo /
                </Link>
                <Link to="/foo/bar">
                    Foo /bar
                </Link>
            </Route>
        </div>
        <footer>
            <Link to="/">Home</Link>
            <Link to="/foo">Hello World</Link>
        </footer>
    </RouterProvider>,
    document.getElementById('app')
);
```

## Props

### RouterProvider

### Route

* `children: ?JSX.Element` default `null`
* `exact: ?Boolean` default `false`
* `path: String`
* `notFound: ?Boolean` default `false`

### Link

* `activeClassName: ?String` default `'is-active'`
* `children: ?JSX.Element` default `null`
* `className: ?String` default `'link'`
* `exact: ?Boolean` default `false`
* `onClick: ?Function`  default `null`
* `to: String`
* `replace: ?Boolean` default `false`