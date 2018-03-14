/**
 * Shallow compare objects
 *
 * @param {Object} a
 * @param {Object} b
 */
export const shallowEqual = (a, b) => {
	if (a === b) {
		return true;
	}

	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	if (aKeys.length !== bKeys.length) {
		return false;
	}

	return aKeys.every(key => a[key] === b[key]);
};

export const routerStateEqual = (a, b) => {
	if (a.match === b.match) {
		return true;
	}

	if (a.match && b.match) {
		return (a.match.pathname === b.match.pathname)
			&& shallowEqual(a.match.params, b.match.params);
	}

	return false;
};
