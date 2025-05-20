<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// Focus the email input field when the component mounts
		const emailInput = document.getElementById('email');
		if (emailInput) {
			emailInput.focus();
		}
	});

	// Function to handle form submission
	async function handleSubmit(event: Event) {
		event.preventDefault(); // Prevent the default form submission

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		// Perform login logic here (e.g., send a request to the server)
		console.log('Email:', email);
		console.log('Password:', password);
	}

	// Function to handle password visibility toggle
	function togglePasswordVisibility() {
		const passwordInput = document.getElementById('password') as HTMLInputElement;
		const passwordToggle = document.getElementById('password-toggle') as HTMLButtonElement;

		if (passwordInput.type === 'password') {
			passwordInput.type = 'text';
			passwordToggle.textContent = 'Hide Password';
		} else {
			passwordInput.type = 'password';
			passwordToggle.textContent = 'Show Password';
		}
	}

	// Function to handle form submission
</script>

<svelte:head>
	<title>Login | DbStudio</title>
</svelte:head>

<div class="login-container">
	<h2>Login</h2>
	<form on:submit={handleSubmit}>
		<label for="email">Email:</label>
		<input type="email" id="email" name="email" required />

		<label for="password">Password:</label>
		<div class="password-toggle">
			<input type="password" id="password" name="password" required />
			<button type="button" id="password-toggle" on:click={togglePasswordVisibility}
				>Show Password</button
			>
		</div>

		<button type="submit">Login</button>

		<div class="forgot-password">
			<a href="/auth/forgot-password">Forgot Password?</a>
		</div>
		<div class="error-message hidden" id="error-message">Invalid email or password.</div>
		<div class="success-message hidden" id="success-message">Login successful!</div>
		<div class="loading hidden" id="loading">
			<img src="/loading.gif" alt="Loading..." />
			<span>Loading...</span>
		</div>
	</form>
</div>

<style>
	/* Add your styles here */
	.login-container {
		max-width: 400px;
		margin: 0 auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: #f9f9f9;
	}

	.login-container h2 {
		text-align: center;
	}

	.login-container label {
		display: block;
		margin-bottom: 5px;
	}

	.login-container input[type='email'],
	.login-container input[type='password'] {
		width: 100%;
		padding: 8px;
		margin-bottom: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
		transition: border-color 0.3s;
	}
	.login-container input[type='email']:focus,
	.login-container input[type='password']:focus {
		border-color: #007bff;
		outline: none;
	}
	.login-container button {
		width: 100%;
		padding: 10px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s;
	}
	.login-container button:hover {
		background-color: #0056b3;
	}
	.login-container .password-toggle {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}
	.login-container .password-toggle button {
		background: none;
		border: none;
		color: #007bff;
		cursor: pointer;
		text-decoration: underline;
	}
	.login-container .password-toggle button:hover {
		text-decoration: none;
	}
	.login-container .forgot-password {
		text-align: center;
		margin-top: 10px;
	}
	.login-container .forgot-password a {
		color: #007bff;
		text-decoration: none;
	}
	.login-container .forgot-password a:hover {
		text-decoration: underline;
	}
	.login-container .error-message {
		color: red;
		margin-top: 10px;
	}
	.login-container .success-message {
		color: green;
		margin-top: 10px;
	}
	.login-container .loading {
		text-align: center;
		margin-top: 10px;
	}
	.login-container .loading img {
		width: 20px;
		height: 20px;
	}
	.login-container .loading span {
		margin-left: 5px;
	}
	.login-container .loading.hidden {
		display: none;
	}
	.login-container .error-message.hidden {
		display: none;
	}
	.login-container .success-message.hidden {
		display: none;
	}
	.login-container .forgot-password.hidden {
		display: none;
	}
	.login-container .password-toggle.hidden {
		display: none;
	}
	.login-container .password-toggle button.hidden {
		display: none;
	}
	.login-container .password-toggle span.hidden {
		display: none;
	}
</style>
