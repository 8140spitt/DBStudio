<script>
	let { id, label, required, className = '', children } = $props();
</script>

<div class="form-group {className}">
	<label for={id}>{label}</label>
	{@render children()}
</div>

<style>
	.form-group {
		display: grid;
		gap: 0.5cap;
	}

	label {
		text-transform: uppercase;
		font-size: 1rem;

		text-box-trim: trim-both;
		text-box-edge: cap alphabetic;
	}
</style>
