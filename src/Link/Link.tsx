import React, { PureComponent } from 'react';

import { Route } from '../Route';
import { getHistory } from '../utils';

const isModifiedEvent = (event: React.MouseEvent<HTMLAnchorElement>) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

interface Props {
  activeClassName: string;
  children: React.ReactNode;
  className: string;
  exact: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  replace: boolean;
  to: string;
}

export default class Link extends PureComponent<Props> {
  static defaultProps = {
    activeClassName: 'is-active',
    className: 'link',
    exact: false,
    replace: false,
  };

  clickAction = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const { to, onClick, replace } = this.props;

    if (onClick) {
      onClick(event);
    }

    if (!event.defaultPrevented && event.button === 0 && !isModifiedEvent(event)) {
      event.preventDefault();

      if (replace) {
        getHistory().replace(to);
      } else {
        getHistory().push(to);
      }
    }
  }

  render() {
    const { to, exact, className, activeClassName, children } = this.props;

    return (
      <Route path={ to } exact={ exact } exclude>
        { match => (
            <a
              href={ `${to}` }
              onClick={ this.clickAction }
              className={ `${className} ${match ? activeClassName : ''}` }
            >
              { children }
            </a>
          ) }
      </Route>
    );
  }
}
