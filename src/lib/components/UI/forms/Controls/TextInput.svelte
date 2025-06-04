<script>
	import FormGroup from './FormGroup.svelte';
	let {
		id = 'text-input',
		label = 'Text Input',
		placeholder = 'Enter text',
		value = '',
		required = false,
		autocomplete = null,
		ariaDescribedBy = ''
	} = $props();
</script>

<FormGroup {id} {label} {required}>
	<input
		type="text"
		{placeholder}
		bind:value
		{required}
		{autocomplete}
		aria-describedby={ariaDescribedBy}
	/>
	{#if ariaDescribedBy}
		<span id={ariaDescribedBy} class="visually-hidden">Additional information</span>
	{/if}
</FormGroup>

<style>
	input {
		background: var(--surface-2);
		color: var(--text-1);
		border: var(--border);
		border-radius: 16px;
		padding: 1ex 2ex;

		accent-color: var(--accent);
	}

	input:not([type='checkbox'], [type='radio']) {
		width: 100%;
	}
</style>
