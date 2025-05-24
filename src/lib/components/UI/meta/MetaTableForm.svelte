<script>
	export let metaDbId;
	export let table = null;
	import { createEventDispatcher } from 'svelte';

	let name = table ? table.name : '';
	let comment = table ? table.comment : '';
	const dispatch = createEventDispatcher();

	async function save() {
		if (table) {
			await fetch(`/api/meta/tables/${table.id}`, {
				method: 'PATCH',
				body: JSON.stringify({ name, comment })
			});
		} else {
			await fetch('/api/meta/tables', {
				method: 'POST',
				body: JSON.stringify({ databaseId: metaDbId, name, comment })
			});
		}
		dispatch('save');
	}
</script>

<div>
	<label>Table Name</label>
	<input bind:value={name} />
	<label>Comment</label>
	<input bind:value={comment} />
	<button on:click={save}>Save</button>
	<button on:click={() => dispatch('close')}>Cancel</button>
</div>
