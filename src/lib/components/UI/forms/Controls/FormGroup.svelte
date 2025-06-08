<script>
	let { id, label, required, className = '', children } = $props();
</script>

<div class="form-group {className}">
	<label for={id}>{label}</label>
	{@render children()}
</div>
