<script lang="ts">
	import { userUIForms } from '$lib/utilities/validationSchemas';
	import {
		validatePasswordWithDetails,
		passwordRequirementConfig
	} from '$lib/utilities/auth/client';
	import FormGroup from '$lib/components/UI/forms/Controls/FormGroup.svelte';
	let formUi = $state(userUIForms.create);

	// Define the allowed input keys (excluding non-input fields)
	type InputKey = 'username' | 'password' | 'confirmPassword';
	let inputs: InputKey[] = ['username', 'password', 'confirmPassword'];

	let password = $state('');
	let strength = $derived(validatePasswordWithDetails(password, passwordRequirementConfig));

	$inspect(password, strength);
</script>

<form action={formUi.action} method={formUi.method}>
	{#each inputs as inputKey}
		{@const input = formUi[inputKey]}
		<FormGroup id={input.id} label={input.label} required={input.required} className="form-group">
			<div class="form-input-wrapper">
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
			</div>

			{#if inputKey === 'password'}
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
		</FormGroup>
	{/each}

	<button type="submit" class="btn btn-primary">Register</button>
</form>

<style>
	.password-strength ~ * {
		margin-top: 0.5rem;
		font-size: 0.75rem;
	}

	.text-success {
		color: green;
	}
	.text-danger {
		color: red;
	}
</style>
