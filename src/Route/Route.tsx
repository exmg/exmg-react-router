import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';

import { Context as RouterContext } from '../RouterProvider';

type ChildrenFunc = (match: boolean, params?: Params, parentPath?: string) => React.ReactNode;

export interface Props {
  children?: React.ReactNode;
  render?: ChildrenFunc;
  exact?: boolean;
  exclude?: boolean;
  notFound?: boolean;
  path?: string;
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

export class Route extends Component<Props, State> {
  static contextType = RouterContext;
  static defaultProps = {
    path: '/',
    exact: false,
    notFound: false,
    exclude: false,
  };

  state = {
    match: false,
  } as State;

  context!: RouterContext;

  keys: pathToRegexp.Key[] = [];
  pathRegexp = pathToRegexp(this.path, this.keys, { end: false });
  unregister: () => void;

  get path() {
    const path = this.context.parentPath + this.props.path;

    return path
      .replace(/\/\/|\/$/g, '/')
      .replace(/\/+$/, '');
  }

  componentDidMount() {
    this.unregister = this.context.register(this);
  }

  componentWillUnmount() {
    this.unregister();
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.state.match === nextState.match && this.props === nextProps) {
      return false;
    }

    return true;
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

  renderChildren() {
    const { children, render } = this.props;
    const { match } = this.state;

    if (typeof render === 'function') {
      if (match) {
        return render(true, match.params, this.context.parentPath);
      }

      return render(false, {}, this.context.parentPath);
    }

    if (match) {
      return children;
    }

    return null;
  }

  render() {
    return (
      <RouterContext.Provider value={ { register: this.context.register, parentPath: this.path } }>
        {this.renderChildren()}
      </RouterContext.Provider>
    );
  }
}
