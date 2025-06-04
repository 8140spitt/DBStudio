<script lang="ts">
	import { userUIForms } from '$lib/utilities/validationSchemas';
	import { validatePasswordWithDetails, passwordRequirementConfig } from '$lib/utilities/auth';
	let formUi = $state(userUIForms.create);

	// Define the allowed input keys (excluding non-input fields)
	type InputKey = 'username' | 'password' | 'confirmPassword';
	let inputs: InputKey[] = ['username', 'password', 'confirmPassword'];

	let password = $state('');
	let strength = $derived(validatePasswordWithDetails(password, passwordRequirementConfig));

	$inspect(password, strength);
</script>

<form action={formUi.action}>
	{#each inputs as inputKey}
		{@const input = formUi[inputKey]}
		<div class="form-group">
			<label for={input.id}>{input.label}</label>
			<!-- Using the input properties to bind the input field -->
			<input
				id={input.id}
				type={input.inputType}
				bind:value={input.value}
				required={input.required}
				autocomplete={input.autocomplete}
				aria-describedby={input.ariaDescribedBy}
				placeholder={input.placeholder}
				aria-invalid={input.errors && input.errors.length > 0}
				oninput={(e) => {
					if (input.inputType === 'password') {
						password = e.target.value;
					}
				}}
				class="form-control"
			/>
			{#if input.inputType === 'password'}
				<div class="password-strength">
					<p>Password Strength: {strength.score * 100}%</p>
					<ul>
						{#each strength.results as result}
							<li class={result.ok ? 'text-success' : 'text-danger'}>
								{result.label}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
			{#if input.errors && input.errors.length > 0}
				<div class="invalid-feedback">
					{#each input.errors as error}
						<p>{error}</p>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
	<button type="submit" class="btn btn-primary">Register</button>
</form>

<style>
	.form-group {
		margin-bottom: 1rem;
	}

	.form-control {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.password-strength {
		margin-top: 0.5rem;
		font-size: 0.9rem;
	}

	.password-strength ul {
		list-style-type: none;
		padding-left: 0;
	}

	.text-success {
		color: green;
	}

	.text-danger {
		color: red;
	}
	.invalid-feedback {
		color: red;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}
	.btn {
		margin-top: 1rem;
	}
	.btn-primary {
		background-color: #007bff;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}
</style>
