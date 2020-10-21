import assert from 'assert';
import fn from '../index';
import fixtures from './fixtures.json';

Object.entries(fixtures).forEach(([name, fixture]) => {
	describe(name, function() {
		const { test: t, options, expect: e } = fixture;
		t.forEach((query, i) => {
			it(query, function() {
				assert.equal(fn(query, options), e[i]);
			});
		});
	});
});
