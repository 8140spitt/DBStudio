<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const config = $state({
		type: 'mysql',
		host: '',
		port: 3306,
		user: '',
		password: '',
		database: '',
		filepath: '',
		ssl: null
	});

	const result = writable<{ ok: boolean; schema?: any; error?: string } | null>(null);

	async function connect() {
		result.set(null);
		try {
			const res = await fetch('/api/schema', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(config)
			});
			result.set(await res.json());
		} catch (err) {
			result.set({ ok: false, error: (err as Error).message });
		}
	}
</script>

<form onsubmit={connect} class="max-w-xl space-y-4">
	<div>
		<label for="dbType">DB Type</label>
		<select bind:value={config.type} class="w-full border p-2">
			<option value="mysql">MySQL</option>
			<option value="postgres">PostgreSQL</option>
			<option value="sqlite">SQLite</option>
		</select>
	</div>

	{#if config.type !== 'sqlite'}
		<div><input bind:value={config.host} placeholder="Host" class="w-full border p-2" /></div>
		<div>
			<input type="number" bind:value={config.port} placeholder="Port" class="w-full border p-2" />
		</div>
		<div><input bind:value={config.user} placeholder="User" class="w-full border p-2" /></div>
		<div>
			<input
				type="password"
				bind:value={config.password}
				placeholder="Password"
				class="w-full border p-2"
			/>
		</div>
		<div>
			<input bind:value={config.database} placeholder="Database Name" class="w-full border p-2" />
		</div>
		<div>
			<label><input type="checkbox" bind:checked={config.ssl} /> Use SSL</label>
		</div>
	{:else}
		<div>
			<input
				bind:value={config.filepath}
				placeholder="SQLite File Path"
				class="w-full border p-2"
			/>
		</div>
	{/if}

	<button type="submit" class="rounded bg-blue-600 px-4 py-2 text-white">Connect</button>

	{#if $result}
		{#if $result?.ok}
			<pre class="mt-4 overflow-auto bg-green-100 p-3">{JSON.stringify(
					$result?.schema,
					null,
					2
				)}</pre>
		{:else}
			<div class="mt-4 text-red-600">Error: {$result?.error}</div>
		{/if}
	{/if}
</form>
