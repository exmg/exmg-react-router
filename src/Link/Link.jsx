import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Route } from '../Route';
import { routerContextTypes } from '../RouterProvider/RouterProvider';

const isModifiedEvent = event =>
	!!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

export default class Link extends PureComponent {
	static propTypes = {
		activeClassName: PropTypes.string,
		children: PropTypes.node,
		className: PropTypes.string,
		exact: PropTypes.bool,
		onClick: PropTypes.func,
		to: PropTypes.string.isRequired,
		replace: PropTypes.bool,
	};

	static defaultProps = {
		activeClassName: 'is-active',
		children: null,
		className: 'link',
		exact: false,
		onClick: null,
		replace: false,
	};

	static contextTypes = routerContextTypes;

	clickAction = (event) => {
		const { to, onClick, replace } = this.props;
		const { history } = this.context.router;

		if (
			!event.defaultPrevented && // onClick prevented default
			event.button === 0 && // ignore right clicks
			!isModifiedEvent(event) // ignore clicks with modifier keys
		) {
			event.preventDefault();

			if (replace) {
				history.replace(to);
			} else {
				history.push(to);
			}
		}

		if (onClick) {
			onClick(event);
		}
	}

	render() {
		const { to, exact, children, className, activeClassName } = this.props;

		return (
			<Route path={ to } exact={ exact } exclude>
				{ match => (
					<a
						href={ `#${to}` }
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
