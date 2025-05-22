<script lang="ts">
	let { data, form } = $props();

	let user: { id: number | undefined; username: string | undefined; password: string | undefined } =
		$state({
			id: form?.user.id ?? undefined,
			username: form?.user.username ?? undefined,
			password: undefined
		});
</script>

<div class="page-wrapper">
	<form action="?/register" method="post">
		{#if form?.fail}
			<div class="error">{form?.message}</div>
		{/if}
		{#if user.id === undefined}
			<input type="hidden" name="id" value={user.id} />
			<div class="form-group">
				<label for="username">Username</label>
				<input type="text" name="username" bind:value={user.username} required />
			</div>
		{/if}
		<div class="form-group">
			<label for="password">Password</label>
			<input type="password" name="password" bind:value={user.password} required />
		</div>
		<div class="form-group">
			<label for="confirm_password">Confirm Password</label>
			<input type="password" name="confirm_password" required />
		</div>

		<button type="submit">Register</button>
	</form>
</div>

<style>
	.page-wrapper {
		max-width: 400px;
		margin: 0 auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	.form-group {
		margin-bottom: 15px;
	}

	label {
		display: block;
		margin-bottom: 5px;
	}

	input[type='text'],
	input[type='password'] {
		width: 100%;
		padding: 8px;
		box-sizing: border-box;
	}
	button {
		padding: 10px 15px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}
	button:hover {
		background-color: #0056b3;
	}
	.error {
		color: red;
		font-size: 0.9em;
	}
	.success {
		color: green;
		font-size: 0.9em;
	}
	.warning {
		color: orange;
		font-size: 0.9em;
	}
	.info {
		color: blue;
		font-size: 0.9em;
	}
</style>
