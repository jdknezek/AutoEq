import * as fs from 'node:fs/promises';

// https://i.rtings.com/assets/products/ybzJnMXP/graph-sound-profile.json
import json from './graph-sound-profile.json' with { type: 'json' }

const { data, options: { series } } = json;

const prefix = /^Target: |HRTF: /;

const targets = series
	.map((serie, i) => ({ i, label: serie.label }))
	.filter(({ label }) => prefix.test(label))
	.map((target) => ({ ...target, label: target.label.replace(prefix, '') }));
console.log(targets);

await fs.writeFile('targets/targets.csv', [
	['frequency', ...targets.map((target) => target.label)].join(','),
	...data.map((row) => [row[0], ...targets.map(({ i }) => row[i + 1])].join(',')),
].join('\n'));

for (const target of targets) {
	await fs.writeFile(`targets/${target.label}.csv`, [
		'frequency,raw',
		...data.map((row) => `${row[0]},${row[target.i + 1]}`),
	].join('\n'));
};
