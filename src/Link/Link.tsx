import React, { PureComponent } from 'react';

import { Route } from '../Route';
import { getHistory } from '../utils';

const isModifiedEvent = (event: React.MouseEvent<HTMLAnchorElement>) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

interface Props {
  activeClassName: string;
  back?: boolean;
  children: React.ReactNode;
  className: string;
  exact: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  relative?: boolean;
  replace: boolean;
  to: string;
}

export default class Link extends PureComponent<Props> {
  static defaultProps = {
    activeClassName: 'is-active',
    className: 'link',
    exact: false,
    replace: false,
    to: '/',
  };

  clickAction = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const { onClick, replace, back } = this.props;
    const slug = event.currentTarget.getAttribute('href');

    if (onClick) {
      onClick(event);
    }

    if (!event.defaultPrevented && event.button === 0 && !isModifiedEvent(event)) {
      event.preventDefault();

      if (back) {
        return getHistory().goBack();
      }

      if (replace) {
        getHistory().replace(slug);
      } else {
        getHistory().push(slug);
      }
    }
  }

  render() {
    const { to, exact, className, activeClassName, children, relative } = this.props;

    return (
      <Route path={ to } exact={ exact } exclude>
        { (match, params, parentPath) => (
            <a
              href={ relative ? `${parentPath}${to}` : to }
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
