import { Component } from 'react';
import PropTypes from 'prop-types';
import createHistory from 'history/createHashHistory';

export const routerContextTypes = {
	router: PropTypes.shape({
		path: PropTypes.string.isRequired,
		register: PropTypes.func.isRequired,
		history: PropTypes.shape({
			push: PropTypes.func.isRequired,
			replace: PropTypes.func.isRequired,
		}).isRequired,
	}),
};

export default class RouterProvider extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	static defaultProps = {
		children: null,
	};

	static childContextTypes = routerContextTypes;

	// eslint-disable-next-line react/sort-comp
	history = createHistory();
	routes = [];
	routeMap = {};

	getChildContext() {
		return {
			router: {
				// Pass path to build op child routes
				path: '',
				register: this.register,
				history: this.history,
			},
		};
	}

	componentWillMount() {
		this.unlisten = this.history.listen(this.updateAction);
	}

	componentDidMount() {
		this.updateAction();
	}

	componentWillUnmount() {
		this.unlisten();
	}

	register = (route) => {
		this.routes.push(route);

		const parentPath = route.context.router.path;

		if (!this.routeMap[parentPath]) {
			this.routeMap[parentPath] = [route];
		} else {
			this.routeMap[parentPath].push(route);
		}

		const routeMap = this.routeMap[parentPath];

		this.requestUpdate();

		return () => {
			const index = routeMap.indexOf(route);

			routeMap.splice(index, 1);
		};
	}

	requestUpdate() {
		if (!this.rAF) {
			this.rAF = requestAnimationFrame(this.updateAction);
		}
	}

	updateAction = () => {
		const { pathname } = this.history.location;

		Object.values(this.routeMap).forEach((routes) => {
			let foundMatch = false;
			const nonMatchingRoutes = [];

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
				nonMatchingRoutes.forEach(route => route.update(!foundMatch));
			}
		});

		this.rAF = null;
	}

	render() {
		return this.props.children;
	}
}
