import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';

import { Context } from '../RouterProvider';

type ChildrenFunc = (match: boolean, params?: Params) => React.ReactNode;

export interface Props {
  children: React.ReactNode | ChildrenFunc;
  exact?: boolean;
  path?: string;
  notFound?: boolean;
  exclude?: boolean;
}

export interface Params {
  [key: string]: any;
}

export interface Match {
  params: Params;
  pathname: string;
}

export interface State {
  match: false | Match;
}

export class RouteComponent extends Component<Props & Context, State> {
  static defaultProps = {
    path: '/',
    exact: false,
    notFound: false,
    exclude: false,
  };

  state = {
    match: false,
  } as State;

  keys: pathToRegexp.Key[] = [];
  pathRegexp = pathToRegexp(this.path, this.keys, { end: false });
  unregister: () => void;

  get path() {
    const path = this.props.parentPath + this.props.path;

    return path
			.replace(/\/\/|\/$/g, '/')
			.replace(/\/+$/, '');
  }

  componentDidMount() {
    this.unregister = this.props.register(this);
  }

  componentWillUnmount() {
    this.unregister();
  }

  match(pathname: string): false | Match {
    if (this.props.notFound) {
      return false;
    }

    const match = this.pathRegexp.exec(pathname);

    if (!match) {
      return false;
    }

    const [matchPath, ...values] = match;

    if (this.props.exact && pathname !== matchPath) {
      return false;
    }

    const params: Params = {};

    this.keys.forEach((key, index) => {
      params[key.name] = values[index];
    });

    return {
      pathname,
      params,
    };
  }

  update(match: State['match']) {
    this.setState({
      match,
    });
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.state.match === nextState.match && this.props === nextProps) {
      return false;
    }

    return true;
  }

  render() {
    const { children } = this.props;
    const { match } = this.state;

    if (typeof children === 'function') {
      if (match) {
        return children(true, match.params);
      }

      return children(false, {});
    }

    if (match) {
      return children;
    }

    return null;
  }
}

export class Route extends Component<Props> {
  // register: Context['register'] = (component) => {
  //   console.log('Route::register', component);
  // }

  // contextProps: Context = {
  //   register: this.register,
  //   parentPath: this.props.path,
  // };

  render() {
    const { children, ...props } = this.props;

    return (
      <Context.Consumer>
        { router => (
          <Context.Provider value={ { register: router.register, parentPath: this.props.path } }>
            <RouteComponent { ...router } { ...props }>
              { children }
            </RouteComponent>
          </Context.Provider>
        ) }
      </Context.Consumer>
    );
  }
}

// export const Route: React.SFC<Props> = ({ children, ...props }) => (
//   <Context.Consumer>
//     { router => (
//       <RouteComponent { ...router } { ...props }>
//         <Context.Provider value={ router }>
//           { children }
//         </Context.Provider>
//       </RouteComponent>
//     ) }
//   </Context.Consumer>
// );
