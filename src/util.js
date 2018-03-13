/**
 * Shallow compare objects
 *
 * @param {Object} a
 * @param {Object} b
 */
export const equals = (a, b) => {
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	if (aKeys.length !== bKeys.length) {
		return false;
	}

	return aKeys.every(key => a[key] === b[key]);
};
