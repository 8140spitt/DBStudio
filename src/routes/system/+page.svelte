<script>
	import { onMount } from 'svelte';

	import { formatHex, oklch } from 'culori';

	function generateOklchSteps(hex, mode = 'tint', steps = 5) {
		const base = oklch(hex);
		const colors = [formatHex(base)];
		for (let i = 1; i <= steps; i++) {
			let l = base.l;
			let c = base.c;
			if (mode === 'tint') l = base.l + (1 - base.l) * (i / steps) * 0.85;
			if (mode === 'shade') l = base.l - base.l * (i / steps) * 0.95;
			if (mode === 'tone') c = base.c - base.c * (i / steps) * 0.85;
			colors.push(formatHex({ mode: 'oklch', l, c, h: base.h }));
		}
		return colors;
	}

	// Convert HEX to HSL
	function hexToHSL(H) {
		let r = 0,
			g = 0,
			b = 0;
		if (H.length == 4) {
			r = '0x' + H[1] + H[1];
			g = '0x' + H[2] + H[2];
			b = '0x' + H[3] + H[3];
		} else if (H.length == 7) {
			r = '0x' + H[1] + H[2];
			g = '0x' + H[3] + H[4];
			b = '0x' + H[5] + H[6];
		}
		r /= 255;
		g /= 255;
		b /= 255;
		const cmin = Math.min(r, g, b);
		const cmax = Math.max(r, g, b);
		const delta = cmax - cmin;
		let h = 0,
			s = 0,
			l = (cmax + cmin) / 2;

		if (delta == 0) h = 0;
		else if (cmax == r) h = ((g - b) / delta) % 6;
		else if (cmax == g) h = (b - r) / delta + 2;
		else h = (r - g) / delta + 4;

		h = Math.round(h * 60);
		if (h < 0) h += 360;

		s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);

		return { h, s, l };
	}

	// Clamp utility
	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	// Generate tints (lighter): increase lightness from baseL up to max 95%
	function generateTints(H, S, baseL, steps) {
		const tints = [];
		for (let i = 1; i <= steps; i++) {
			const factor = i / steps;
			const L = clamp(baseL + factor * (95 - baseL), 0, 100);
			tints.push(`hsl(${H}, ${S}%, ${Math.round(L)}%)`);
		}
		return tints;
	}

	// Generate tones (muted): decrease saturation from baseS down to min 10%
	function generateTones(H, baseS, L, steps) {
		const tones = [];
		for (let i = 1; i <= steps; i++) {
			const factor = i / steps;
			const S = clamp(baseS - factor * (baseS - 10), 0, 100);
			tones.push(`hsl(${H}, ${Math.round(S)}%, ${L}%)`);
		}
		return tones;
	}

	// Generate shades (darker): decrease lightness from baseL down to min 5%
	function generateShades(H, S, baseL, steps) {
		const shades = [];
		for (let i = 1; i <= steps; i++) {
			const factor = i / steps;
			const L = clamp(baseL - factor * (baseL - 5), 0, 100);
			shades.push(`hsl(${H}, ${S}%, ${Math.round(L)}%)`);
		}
		return shades;
	}

	// Inputs and reactive palette
	let baseColor = $state('#1e90ff');
	let steps = $state(5);

	let tints = $state([]);
	let tones = $state([]);
	let shades = $state([]);

	let savedColors = $state([
		'#1e90ff',
		'#8a2be2',
		'#00ffc8',
		'#2f4f4f',
		'#121212',
		'#f5f7fa',
		'#28a745',
		'#ffc107',
		'#dc3545'
	]);

	function updatePalettes() {
		const { h, s, l } = hexToHSL(baseColor);
		const baseHSL = `hsl(${h}, ${s}%, ${l}%)`;

		tints = [
			baseHSL, // Step 0: base color
			...generateTints(h, s, l, steps)
		];
		tones = [baseHSL, ...generateTones(h, s, l, steps)];
		shades = [baseHSL, ...generateShades(h, s, l, steps)];
	}
	onMount(updatePalettes);

	function saveCurrentColor() {
		let c = baseColor.trim();
		if (!savedColors.includes(c)) {
			savedColors = [...savedColors, c];
		}
	}

	function selectSavedColor(color) {
		baseColor = color;
		updatePalettes();
	}

	function removeSavedColor(color) {
		savedColors = savedColors.filter((c) => c !== color);
	}

	$inspect(savedColors);
</script>

<main style="color: {baseColor};">
	<h1>Shades, Tints & Tones Palette Generator</h1>

	<label for="baseColor">Select Base Color:</label>
	<input
		id="baseColor"
		type="color"
		bind:value={baseColor}
		aria-label="Base color picker"
		oninput={updatePalettes}
		style="--border-clr: {baseColor};"
	/>

	<label for="steps">Number of Steps (1 to 20):</label>
	<input
		id="steps"
		type="number"
		min="1"
		max="20"
		bind:value={steps}
		oninput={(e) => {
			steps = e.target.value;
			updatePalettes();
		}}
		aria-label="Number of steps"
		style="--border-clr: {baseColor};"
	/>
	<button type="button" onclick={saveCurrentColor} style="margin-bottom: 1rem;">
		Save Base Color
	</button>

	{#if savedColors.length}
		<div class="saved-colors">
			<strong>Saved Colors:</strong>
			<div class="swatches">
				{#each savedColors as color, i}
					<div class="saved-swatch">
						<button
							class="saved-swatch-button"
							style="background: {color}"
							title="Saved color: {color}"
							onclick={() => selectSavedColor(color)}
							aria-label="Select saved color {color}"
						>
						</button>

						<button
							class="remove"
							title="Remove"
							onclick={() => {
								removeSavedColor(color);
							}}
						>
							&times;
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<section aria-label="Tints palette">
		<h2>Tints (Lighter)</h2>
		<div class="palette">
			{#each tints as color, i}
				<div class="swatch" style="background-color: {color}" title={`Tint step ${i}: ${color}`}>
					{i === 0 ? 'Base' : i}
				</div>
			{/each}
		</div>
	</section>

	<section aria-label="Tones palette">
		<h2>Tones (Muted)</h2>
		<div class="palette">
			{#each tones as color, i}
				<div class="swatch" style="background-color: {color}" title={`Tone step ${i}: ${color}`}>
					{i === 0 ? 'Base' : i}
				</div>
			{/each}
		</div>
	</section>

	<section aria-label="Shades palette">
		<h2>Shades (Darker)</h2>
		<div class="palette">
			{#each shades as color, i}
				<div class="swatch" style="background-color: {color}" title={`Shade step ${i}: ${color}`}>
					{i === 0 ? 'Base' : i}
				</div>
			{/each}
		</div>
	</section>
</main>

<style>
	main {
		padding: 2rem;
		font-family: system-ui, sans-serif;
		max-width: 800px;
		margin: auto;
	}
	label {
		display: block;
		margin-bottom: 0.25rem;
		font-weight: 600;
	}
	input[type='color'],
	input[type='number'] {
		--border-clr: #ccc;
		margin-bottom: 1rem;
		width: 100%;
		height: 2.5rem;
		border-radius: 6px;
		border: 1px solid var(--border-clr);
		font-size: 1rem;
		padding: 0.25rem;
	}
	input[type='number'] {
		max-width: 120px;
	}
	section {
		margin-bottom: 2rem;
	}
	.palette {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.swatch {
		flex: 1 1 60px;
		height: 60px;
		border-radius: 8px;
		box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		color: white;
		text-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
		cursor: default;
		user-select: none;
	}

	button[type='button'] {
		padding: 0.5rem 1.2rem;
		font-size: 1rem;
		border-radius: 6px;
		border: none;
		background: #222;
		color: white;
		cursor: pointer;
		margin-top: 0.25rem;
		margin-bottom: 1rem;
	}

	button[type='button']:hover {
		background: #444;
	}

	.saved-colors {
		margin-bottom: 2rem;
	}
	.swatches {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 0.5rem;
	}
	.saved-swatch {
		min-width: 60px;
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		background: #eee;
		box-shadow: 0 0 3px rgba(0, 0, 0, 0.13);
		cursor: pointer;
		position: relative;
		transition: border 0.2s;
		border: 2px solid transparent;
		color: #222;
		font-size: 0.9rem;
	}

	.saved-swatch-button {
		width: 100%;
		height: 100%;
		border-radius: 6px;
		border: none;
		background: transparent;
		cursor: pointer;
	}
	.saved-swatch:hover {
		border: 2px solid #222;
	}
	.remove {
		margin: 0;
		padding: 0;
		top: -10px;
		right: -10px;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 1.2em;
		cursor: pointer;
		user-select: none;
		transition: color 0.15s;
		position: absolute;
		background: #d00;
		border-radius: 50%;
	}
	.remove:hover {
		background-color: #900;
	}
</style>
