<script>
	export let metaDbId;
	import { onMount } from 'svelte';
	import MetaTableForm from './MetaTableForm.svelte';

	let tables = [];
	let showForm = false;
	let editing = null;

	async function fetchTables() {
		const res = await fetch(`/api/meta/tables?dbId=${metaDbId}`);
		tables = await res.json();
	}

	function openCreate() {
		editing = null;
		showForm = true;
	}
	function openEdit(table) {
		editing = table;
		showForm = true;
	}

	async function handleSave() {
		showForm = false;
		await fetchTables();
	}

	async function handleDelete(id) {
		if (confirm('Delete this table?')) {
			await fetch(`/api/meta/tables/${id}`, { method: 'DELETE' });
			await fetchTables();
		}
	}

	onMount(fetchTables);
</script>

<div>
	<h2>Tables</h2>
	<button on:click={openCreate}>Add Table</button>
	<ul>
		{#each tables as table}
			<li>
				<span>{table.name}</span>
				<button on:click={() => openEdit(table)}>Edit</button>
				<button on:click={() => handleDelete(table.id)}>Delete</button>
				<a href={`/app/.../db/${metaDbId}/tables/${table.id}/columns`}>Columns</a>
			</li>
		{/each}
	</ul>
	{#if showForm}
		<MetaTableForm
			{metaDbId}
			table={editing}
			on:save={handleSave}
			on:close={() => (showForm = false)}
		/>
	{/if}
</div>
