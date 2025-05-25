<script lang="ts">
	let username = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let error = '';
	let loading = false;
	let submitted = false;

	async function registerUser() {
		error = '';
		submitted = true;
		loading = true;

		if (!username || !email || !password || !confirmPassword) {
			error = 'All fields are required.';
			loading = false;
			return;
		}
		if (password !== confirmPassword) {
			error = 'Passwords do not match.';
			loading = false;
			return;
		}
		if (password.length < 8) {
			error = 'Password must be at least 8 characters.';
			loading = false;
			return;
		}

		// Simulate
		setTimeout(() => {
			loading = false;
			window.location.href = '/onboarding';
		}, 1000);
	}
</script>

<form
	class="nublox-form"
	on:submit|preventDefault={registerUser}
	aria-describedby={error ? 'form-error' : undefined}
	novalidate
>
	<img src="/NuBloxLogo.svg" alt="NuBlox Logo" />
	<div class="form-title">Create Your NuBlox Account</div>

	{#if error}
		<div id="form-error" class="form-error" role="alert" aria-live="assertive" tabindex="-1">
			{error}
		</div>
	{/if}

	<label for="username">Username</label>
	<input
		id="username"
		name="username"
		type="text"
		bind:value={username}
		required
		aria-invalid={submitted && !username}
		aria-describedby={submitted && !username ? 'username-error' : undefined}
		autocomplete="username"
		maxlength="40"
	/>
	{#if submitted && !username}
		<div class="input-error" id="username-error">Username is required</div>
	{/if}

	<label for="email">Email</label>
	<input
		id="email"
		name="email"
		type="email"
		bind:value={email}
		required
		aria-invalid={submitted && !email}
		aria-describedby={submitted && !email ? 'email-error' : undefined}
		autocomplete="email"
		maxlength="80"
	/>
	{#if submitted && !email}
		<div class="input-error" id="email-error">Email is required</div>
	{/if}

	<label for="password">Password</label>
	<input
		id="password"
		name="password"
		type="password"
		bind:value={password}
		required
		minlength="8"
		aria-invalid={submitted && password.length < 8}
		aria-describedby={submitted && password.length < 8 ? 'password-error' : undefined}
		autocomplete="new-password"
		maxlength="100"
	/>
	{#if submitted && password.length < 8}
		<div class="input-error" id="password-error">Password must be at least 8 characters</div>
	{/if}

	<label for="confirmPassword">Confirm Password</label>
	<input
		id="confirmPassword"
		name="confirmPassword"
		type="password"
		bind:value={confirmPassword}
		required
		aria-invalid={submitted && password !== confirmPassword}
		aria-describedby={submitted && password !== confirmPassword ? 'confirm-error' : undefined}
		autocomplete="new-password"
		maxlength="100"
	/>
	{#if submitted && password !== confirmPassword}
		<div class="input-error" id="confirm-error">Passwords do not match</div>
	{/if}

	<button type="submit" aria-disabled={loading} disabled={loading}>
		{loading ? 'Registering...' : 'Register'}
	</button>

	<div class="form-footer">
		Already have an account?
		<a href="/login">Login</a>
	</div>
</form>

<style>
	.nublox-form {
		background: var(--me-neutral-950);
		border-radius: 6px;
		border: 1.5px solid var(--me-neutral-800);
		box-shadow: 0 2px 12px 0 rgba(44, 79, 140, 0.06);
		max-width: 400px;
		margin: 3rem auto;
		padding: 2rem 2rem 1.5rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.nublox-form label {
		font-weight: 500;
		color: var(--me-neutral-200);
		margin-bottom: 0.18rem;
		letter-spacing: 0.02em;
		font-size: 0.875rem;
	}
	.nublox-form input {
		border-radius: 4px;
		border: 1.5px solid var(--me-neutral-800);
		background: var(--me-neutral-900);
		color: var(--me-neutral-50);
		font-size: 1rem;
		padding: 0.25rem 0.5rem;
		transition:
			border-color 0.18s,
			box-shadow 0.18s;
		font-family: 'Poppins', sans-serif;
	}
	.nublox-form input:focus {
		border-color: var(--me-blue-400);
		box-shadow: 0 0 0 2px var(--me-blue-200);
		background: var(--me-neutral-800);
	}
	.nublox-form input[aria-invalid='true'] {
		border-color: var(--me-danger-500);
		background: var(--me-danger-950);
	}
	.nublox-form .form-title {
		font-size: 2rem;
		font-weight: 800;
		color: var(--me-neutral-50);
		text-align: left;
		letter-spacing: 0.02em;
		margin-bottom: 0.25rem;
	}
	.nublox-form .form-error {
		color: var(--me-danger-600);
		background: var(--me-danger-100);
		border: 1px solid var(--me-danger-300);
		border-radius: 4px;
		font-size: 1.25rem;
	}
	.nublox-form .input-error {
		background-color: var(--me-danger-300);
		color: var(--me-danger-700);
		font-size: 1rem;
	}
	.nublox-form button[type='submit'] {
		background: var(--me-purple-800);
		color: #fff;
		border: none;
		border-radius: 5px;
		padding: 0.82rem 1rem;
		font-weight: 600;
		font-size: 1.07rem;
		transition:
			background 0.16s,
			box-shadow 0.14s;
		margin-top: 0.2rem;
		letter-spacing: 0.02em;
		box-shadow: 0 2px 8px 0 rgba(170, 144, 221, 0.07);
	}
	.nublox-form button[type='submit']:hover,
	.nublox-form button[type='submit']:focus {
		background: var(--me-blue-600);
		box-shadow: 0 2px 12px 0 rgba(146, 171, 221, 0.11);
	}
	.nublox-form .form-footer {
		text-align: right;
		margin-top: 0.8rem;
		color: var(--me-neutral-400);
		font-size: 0.98rem;
	}
	.nublox-form .form-footer a {
		color: var(--me-blue-400);
		text-decoration: none;
		font-weight: 600;
		margin-left: 0.5em;
	}
	.nublox-form .form-footer a:hover,
	.nublox-form .form-footer a:focus {
		color: var(--me-orange-500);
		text-decoration: underline;
	}
</style>
