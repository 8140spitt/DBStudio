export function validateElement(input: HTMLInputElement): string | null {
    const value = input.value.trim();

    // 1. Required check
    if (input.required && value === '') {
        return 'This field is required';
    }

    // 2. Type-specific validation (email, number, etc.)
    if (input.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Invalid email address';
        }
    }

    if (input.type === 'url' && value !== '') {
        try {
            new URL(value);
        } catch {
            return 'Invalid URL';
        }
    }

    if (input.type === 'number' && value !== '') {
        const number = Number(value);
        if (isNaN(number)) {
            return 'Must be a number';
        }

        if (input.hasAttribute('min') && number < Number(input.min)) {
            return `Must be at least ${input.min}`;
        }
        if (input.hasAttribute('max') && number > Number(input.max)) {
            return `Must be no more than ${input.max}`;
        }
        if (input.hasAttribute('step')) {
            const step = Number(input.step);
            if (step > 0 && ((number - Number(input.min || 0)) % step !== 0)) {
                return `Must be in steps of ${step}`;
            }
        }
    }

    // 3. Length constraints
    if (input.hasAttribute('minlength') && value.length < Number(input.minLength)) {
        return `Minimum length is ${input.minLength}`;
    }
    if (input.hasAttribute('maxlength') && value.length > Number(input.maxLength)) {
        return `Maximum length is ${input.maxLength}`;
    }

    // 4. Pattern
    if (input.pattern && value !== '') {
        const regex = new RegExp(`^${input.pattern}$`);
        if (!regex.test(value)) {
            return 'Invalid format';
        }
    }

    // 5. Native browser validation fallback (e.g. for date/time inputs)
    if (!input.checkValidity()) {
        return input.validationMessage;
    }

    return null; // ✅ No errors
}
