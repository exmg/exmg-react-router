import { Component } from 'react';
import PropTypes from 'prop-types';
import pathToRegexp from 'path-to-regexp';

import { routerContextTypes } from '../RouterProvider/RouterProvider';
import { shallowEqual, routerStateEqual } from '../util';

export default class Route extends Component {
	static propTypes = {
		children: PropTypes.oneOfType([
			PropTypes.node,
			PropTypes.func,
		]),
		exact: PropTypes.bool,
		path: PropTypes.string,
		notFound: PropTypes.bool, // noMatch ?
		// eslint-disable-next-line react/no-unused-prop-types
		exclude: PropTypes.bool, // exclude from route notFound handling
	};

	static defaultProps = {
		children: null,
		exact: false,
		notFound: false,
		path: '/',
		exclude: false,
	};

	static contextTypes = routerContextTypes;
	static childContextTypes = routerContextTypes;

	state = {
		match: false,
	};

	// eslint-disable-next-line react/sort-comp
	keys = [];
	pathRegexp = pathToRegexp(this.path, this.keys, { end: false });

	getChildContext() {
		return {
			router: {
				...this.context.router,
				path: this.path,
			},
		};
	}

	componentDidMount() {
		const { router } = this.context;

		this.unregister = router.register(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		const propsChanged = !shallowEqual(this.props, nextProps);
		const stateChanged = !routerStateEqual(this.state, nextState);

		return propsChanged || stateChanged;
	}

	componentWillUnmount() {
		this.unregister();
	}

	get path() {
		const path = this.context.router.path + this.props.path;

		return path
			.replace(/\/\/|\/$/g, '/')
			.replace(/\/+$/, '');
	}

	match(pathname) {
		if (this.props.notFound) {
			return false;
		}

		const match = this.pathRegexp.exec(pathname);

		if (!match) {
			return false;
		}

		const [url, ...values] = match;
		const isExact = pathname === url;

		if (this.props.exact && !isExact) {
			return false;
		}

		return {
			pathname,
			params: this.keys.reduce((memo, key, index) => {
				// eslint-disable-next-line no-param-reassign
				memo[key.name] = values[index];
				return memo;
			}, {}),
		};
	}

	update(match) {
		this.setState({
			match,
		});
	}

	render() {
		const { children } = this.props;
		const { match } = this.state;

		if (typeof children === 'function') {
			// Empty object so we can always destruct
			return children(!!match, match ? match.params : {});
		}

		if (match) {
			return children;
		}

		return null;
	}
}
