<script>
	import { onMount } from 'svelte';

	import { formatHex, oklch, clampRgb } from 'culori';
	import Loader from '$lib/components/UI/loader.svelte';

	function clampOklch(l, c, h) {
		const color = clampRgb({ mode: 'oklch', l, c, h });
		return formatHex(color);
	}

	// Easing function for more natural, perceptually spaced steps
	function easeInOut(t) {
		return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
	}

	// Generates n natural, even palette steps in OKLCH color space
	function generateOklchSteps(hex, mode = 'tint', steps = 5) {
		const base = oklch(hex);
		const colors = [clampOklch(base.l, base.c, base.h)];
		const maxLight = 0.96,
			minLight = 0.08; // avoid pure white/black
		const minChroma = 0.03;

		for (let i = 1; i <= steps; i++) {
			// Use eased t for natural gradation
			const t = easeInOut(i / steps);

			let l = base.l;
			let c = base.c;

			if (mode === 'tint') {
				l = base.l + (maxLight - base.l) * t;
				c = base.c * (1 - 0.5 * t); // fade a bit, not to gray
			}
			if (mode === 'shade') {
				l = base.l - (base.l - minLight) * t;
				c = base.c * (1 - 0.15 * t); // keep a little color in the darks
			}
			if (mode === 'tone') {
				c = base.c - (base.c - minChroma) * t;
				// Keep lightness about the same for tones
			}

			colors.push(clampOklch(l, c, base.h));
		}
		return colors;
	}

	// Inputs and reactive palette
	let savedColors = $state([
		'#424242',
		'#8a2be2',
		'#1e90ff',
		'#00ffc8',
		'#00fa92',
		'#ff7d78',
		'#fefc78',
		'#75d5ff'
	]);

	let baseColor = $state('#8a2be2'); // Default to first saved color or fallback
	let steps = $state(5);

	let tints = $state([]);
	let tones = $state([]);
	let shades = $state([]);

	function updatePalettes() {
		tints = generateOklchSteps(baseColor, 'tint', steps);
		tones = generateOklchSteps(baseColor, 'tone', steps);
		shades = generateOklchSteps(baseColor, 'shade', steps);
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
	<button
		type="button"
		class="save-color-button"
		aria-label="Save current base color"
		onclick={saveCurrentColor}
		style="margin-bottom: 1rem; background: {baseColor}; hover: {shades[shades.length - 1]};"
	>
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
				<div class="swatch-container">
					<div class="swatch" style="background-color: {color}" title={`Tint step ${i}: ${color}`}>
						{i === 0 ? 'Base' : i}
					</div>
					<p>{color.toString()}</p>
				</div>
			{/each}
		</div>
	</section>

	<section aria-label="Shades palette">
		<h2>Shades (Darker)</h2>
		<div class="palette">
			{#each shades as color, i}
				<div class="swatch-container">
					<div class="swatch" style="background-color: {color}" title={`Shade step ${i}: ${color}`}>
						{i === 0 ? 'Base' : i}
					</div>
					<p>{color}</p>
				</div>
			{/each}
		</div>
	</section>

	<section aria-label="Tones palette">
		<h2>Tones (Muted)</h2>
		<div class="palette">
			{#each tones as color, i}
				<div class="swatch-container">
					<div class="swatch" style="background-color: {color}" title={`Tone step ${i}: ${color}`}>
						{i === 0 ? 'Base' : i}
					</div>
					<p>{color}</p>
				</div>
			{/each}
		</div>
	</section>

	<footer>
		<p>Generated with ❤️ by NuBlox</p>
	</footer>
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
	.swatch-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1 1 60px;
		height: 60px;
		user-select: auto;
	}

	.swatch-container p {
		margin-top: 0.25rem;
		font-size: 0.8rem;
		color: #333;
		text-align: center;
		max-width: 100px;
		word-break: break-all;
		font-weight: 500;
	}
	.swatch-container .swatch {
		width: 100%;
		height: 100%;
		border-radius: 8px;
		box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		color: white;
		text-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
		cursor: default;
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
	.swatch-container p {
		user-select: text !important;
	}
</style>
