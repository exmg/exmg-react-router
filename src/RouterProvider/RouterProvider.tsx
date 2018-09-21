import React, { Component } from 'react';
import RouteComponent from 'Route/Route';
import { createHashHistory, UnregisterCallback  } from 'history';

export interface Context {
  register: (component: Component) => (() => void);
  parentPath: string;
}

export const Context = React.createContext<Context>({} as Context);

export interface Props {
  children: React.ReactNode;
}

interface RoutesMap {
  [key: string]: RouteComponent[];
}

export const history = createHashHistory();

export default class RouterProvider extends Component<Props> {
  raf?: number;
  routesMap: RoutesMap = {};
  unlisten: UnregisterCallback;

  register: Context['register'] = (routeComponent: RouteComponent) => {
    const { parentPath } = routeComponent.props;

    if (!this.routesMap[parentPath]) {
      this.routesMap[parentPath] = [];
    }

    const map = this.routesMap[parentPath];

    map.push(routeComponent);

    this.requestUpdate();

    return () => {
      const index = map.indexOf(routeComponent);

      map.splice(index, 1);
    };
  }

  contextProps: Context = {
    register: this.register,
    parentPath: '/',
  };

  componentDidMount() {
    this.unlisten = history.listen(this.update);
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
    const { pathname } = history.location;
    const routeGroups = Object.values(this.routesMap);

    this.raf = null;

    routeGroups.forEach((routes) => {
      let foundMatch = false;
      const nonMatchingRoutes: RouteComponent[] = [];

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
    });
  }

  render() {
    return (
      <Context.Provider
        value={ this.contextProps }
        >
        { this.props.children }
      </Context.Provider>
    );
  }
}
