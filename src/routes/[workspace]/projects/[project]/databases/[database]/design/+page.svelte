<script lang="ts">
	import { writable } from 'svelte/store';

	// --- Types ---
	type ColumnDef = {
		name: string;
		type: string;
		length?: number;
		isPrimaryKey?: boolean;
		isAutoIncrement?: boolean;
		isNotNull?: boolean;
		isUnique?: boolean;
		default?: string | number | boolean | null;
	};

	// --- Defaults ---
	const defaultColumn: ColumnDef = {
		name: '',
		type: 'varchar',
		length: 50,
		isPrimaryKey: false,
		isAutoIncrement: false,
		isNotNull: false,
		isUnique: false,
		default: undefined
	};

	// --- Store ---
	const columns = writable<ColumnDef[]>([
		{ name: 'id', type: 'int', isPrimaryKey: true, isAutoIncrement: true },
		{ name: 'username', type: 'varchar', length: 50, isNotNull: true },
		{ name: 'email', type: 'varchar', length: 100, isUnique: true },
		{ name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' }
	]);

	// --- Functions ---
	function addColumn() {
		columns.update((cols) => [...cols, { ...defaultColumn }]);
	}
	function removeColumn(idx: number) {
		columns.update((cols) => cols.filter((_, i) => i !== idx));
	}
</script>

<h2>Table Column Designer</h2>
<button on:click={addColumn}>Add Column</button>

{#each $columns as col, idx}
	<div style="margin-bottom:1em; border-bottom:1px solid #eee; padding-bottom:0.5em;">
		<input bind:value={col.name} placeholder="Column name" />
		<select bind:value={col.type}>
			<option value="int">int</option>
			<option value="varchar">varchar</option>
			<option value="datetime">datetime</option>
			<!-- Add more SQL types as needed -->
		</select>
		{#if col.type === 'varchar'}
			<input type="number" min="1" bind:value={col.length} placeholder="Length" />
		{/if}
		<label><input type="checkbox" bind:checked={col.isPrimaryKey} /> PK</label>
		<label><input type="checkbox" bind:checked={col.isUnique} /> Unique</label>
		<label><input type="checkbox" bind:checked={col.isNotNull} /> Not Null</label>
		<label><input type="checkbox" bind:checked={col.isAutoIncrement} /> Auto Inc</label>
		<input bind:value={col.default} placeholder="Default" />
		<button type="button" on:click={() => removeColumn(idx)}>Remove</button>
	</div>
{/each}

<!-- For debug only: -->
<pre>{JSON.stringify($columns, null, 2)}</pre>
