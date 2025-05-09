<script lang="ts">
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let step = writable(1);

	// Step data stores
	const personal = writable({
		firstName: '',
		lastName: '',
		middleName: '',
		prefix: ''
	});

	const account = writable({
		email: '',
		password: '',
		confirmPassword: ''
	});

	const workspace = writable({
		name: ''
	});

	// Errors
	const error = writable<string | null>(null);

	// Final submission
	async function submitRegistration() {
		error.set(null);

		const personalData = $personal;
		const accountData = $account;
		const workspaceData = $workspace;

		if (accountData.password !== accountData.confirmPassword) {
			error.set('Passwords do not match.');
			step.set(2);
			return;
		}

		try {
			const res = await fetch('/api/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					person: personalData,
					email: accountData.email,
					password: accountData.password,
					workspace: workspaceData
				})
			});

			if (!res.ok) {
				const { message } = await res.json();
				throw new Error(message);
			}

			goto('/dashboard');
		} catch (err) {
			error.set(err.message || 'Registration failed.');
		}
	}
</script>

{#if $step === 1}
	<!-- Step 1: Personal Info -->
	<section>
		<h2>Step 1: Your Details</h2>
		<input bind:value={$personal.firstName} placeholder="First name" required />
		<input bind:value={$personal.lastName} placeholder="Last name" required />
		<input bind:value={$personal.middleName} placeholder="Middle name (optional)" />
		<input bind:value={$personal.prefix} placeholder="Prefix (optional)" />
		<button on:click={() => step.set(2)}>Next</button>
	</section>
{:else if $step === 2}
	<!-- Step 2: Account Info -->
	<section>
		<h2>Step 2: Account Setup</h2>
		<input type="email" bind:value={$account.email} placeholder="Email" required />
		<input type="password" bind:value={$account.password} placeholder="Password" required />
		<input
			type="password"
			bind:value={$account.confirmPassword}
			placeholder="Confirm Password"
			required
		/>
		<button on:click={() => step.set(1)}>Back</button>
		<button on:click={() => step.set(3)}>Next</button>
	</section>
{:else if $step === 3}
	<!-- Step 3: Workspace Info -->
	<section>
		<h2>Step 3: Workspace</h2>
		<input bind:value={$workspace.name} placeholder="Workspace name" required />
		<button on:click={() => step.set(2)}>Back</button>
		<button on:click={submitRegistration}>Finish</button>
	</section>
{/if}

{#if $error}
	<p class="error">{$error}</p>
{/if}

<style>
	input {
		display: block;
		margin-bottom: 0.5rem;
		padding: 0.5rem;
		width: 100%;
		max-width: 400px;
	}
	button {
		margin-right: 0.5rem;
		padding: 0.5rem 1rem;
	}
	.error {
		color: red;
		margin-top: 1rem;
	}
</style>
