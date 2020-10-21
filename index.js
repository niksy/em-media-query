import parse from 'postcss-value-parser';
import round from 'lodash.round';

/**
 * @param {string} string
 * @param {object} options
 *
 * @returns {string}
 */
export default (string, options) => {
	options = { precision: 5, ...options };

	const tree = parse(string);

	tree.walk((node) => {
		if (node.type === 'function') {
			const values = node.nodes;
			const minMax = values.some((item) => {
				return /(?:min|max)-(?:width|height)/.test(item.value);
			});

			// If we are working with min/max-width/height query
			if (minMax) {
				values

					// Work only with pixel values
					.filter((item) => {
						const value = parse.unit(item.value);
						return (
							item.type === 'word' && value && value.unit === 'px'
						);
					})

					// Convert to ems
					.map((item) => {
						const value = parse.unit(item.value);
						item.value = [
							round(Number(value.number) / 16, options.precision),
							'em'
						].join('');
						return item;
					});
			}
		}
	});

	return tree.toString();
};
