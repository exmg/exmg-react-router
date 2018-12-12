import React, { Component } from 'react';

import { createHistory, HistoryTypes } from '../utils';
import { Route } from 'Route/Route';
import { UnregisterCallback  } from 'history';

export interface Context {
  register: (component: Component) => (() => void);
  parentPath: string;
}

export const Context = React.createContext<Context>({} as Context);

export interface Props {
  children: React.ReactNode;
  type: HistoryTypes;
}

interface RoutesMap {
  [key: string]: Route[];
}

export default class RouterProvider extends Component<Props> {
  static defaultProps = {
    type: 'hash',
  };

  raf?: number;
  routesMap: RoutesMap = {};
  unlisten: UnregisterCallback;
  history = createHistory(this.props.type);

  register: Context['register'] = (routeComponent: Route) => {
    const { parentPath } = routeComponent.context;

    if (!this.routesMap[parentPath]) {
      this.routesMap[parentPath] = [];
    }

    const map = this.routesMap[parentPath];

    map.push(routeComponent);

    this.requestUpdate();

    return () => {
      const index = map.indexOf(routeComponent);

      map.splice(index, 1);

      this.requestUpdate();
    };
  }

  contextProps: Context = {
    register: this.register,
    parentPath: '/',
  };

  componentDidMount() {
    this.unlisten = this.history.listen(this.update);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  requestUpdate() {
    if (!this.raf) {
      this.raf = requestAnimationFrame(this.update);
    }
  }

  update = () => {
    const { pathname } = this.history.location;
    const routeGroups = Object.values(this.routesMap);

    routeGroups.forEach(routes => this.updateGroup(pathname, routes));

    this.raf = null;
  }

  updateGroup(pathname: string, routes: Route[]) {
    let foundMatch = false;
    const nonMatchingRoutes: Route[] = [];

    routes.forEach((route) => {
      const match = route.match(pathname);

      if (!route.props.notFound) {
        route.update(match);
      }

      if (route.props.exclude) {
        return;
      }

      if (match) {
        foundMatch = true;
      }

      if (route.props.notFound) {
        nonMatchingRoutes.push(route);
      }
    });

    if (nonMatchingRoutes.length) {
      const notFoundMatch = foundMatch ? false : { pathname, params: {} };

      nonMatchingRoutes.forEach(route => route.update(notFoundMatch));
    }
  }

  render() {
    return (
      <Context.Provider value={ this.contextProps }>
        { this.props.children }
      </Context.Provider>
    );
  }
}
