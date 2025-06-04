
// Validation properties for user management
export const userValidationSchema = {
    type: 'object',
    properties: {
        username: { type: 'string', minLength: 8, maxLength: 255, pattern: '^[a-zA-Z0-9_$@!%*?&]+$' },
        hashedPassword: { type: 'string', minLength: 14, maxLength: 255, pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@!%*?&])[A-Za-z0-9$@!%*?&]{14,}$' },
        status: { type: 'string', enum: ['active', 'inactive', 'banned'], default: 'active' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        // Optional properties
        id: { type: 'integer', minimum: 1, maximum: Number.MAX_SAFE_INTEGER, nullable: true },
    },
    required: ['username', 'hashedPassword'],
    additionalProperties: false,
};


// UI Forms for User Management
export const userUIForms = {
    create: {
        username: { id: 'username', name: 'user.username', inputType: 'text', label: 'Username', placeholder: 'Enter your username', value: '', ...userValidationSchema.properties.username },
        hashedPassword: { id: 'hashedPassword', name: 'user.hashedPassword', inputType: 'password', label: 'Password', placeholder: 'Enter your password', value: '', ...userValidationSchema.properties.hashedPassword },
        status: { id: 'status', name: 'user.status', inputType: 'select', label: 'Status', options: ['active', 'inactive', 'banned'], value: 'active' },
        password: { id: 'password', name: 'user.password', inputType: 'password', label: 'Password', placeholder: 'Enter your password', value: '' },
        confirmPassword: { id: 'confirmPassword', name: 'user.confirmPassword', inputType: 'password', label: 'Confirm Password', placeholder: 'Re-enter your password', value: '', ...userValidationSchema.properties.hashedPassword },
        action: '/api/users/create',
        method: 'POST',
    }
};



// Validation properties for user profiles
export const userProfileValidationSchema = {
    type: 'object',
    properties: {
        userId: { type: 'integer', minimum: 1, maximum: Number.MAX_SAFE_INTEGER },
        email: { type: 'string', format: 'email', maxLength: 255 },
        firstName: { type: 'string', maxLength: 255, nullable: true },
        lastName: { type: 'string', maxLength: 255, nullable: true },
        avatar: { type: 'string', maxLength: 255, nullable: true },
        bio: { type: 'string', maxLength: 1000, nullable: true },
        id: { type: 'integer', minimum: 1, maximum: Number.MAX_SAFE_INTEGER, nullable: true },
    },
    required: ['userId', 'email'],
    additionalProperties: false,
};
// UI Forms for User Profile Management
export const userProfileUIForms = {
    create: {
        userId: { name: 'profile.userId', inputType: 'hidden', label: 'User ID' },
        email: { name: 'profile.email', inputType: 'email', label: 'Email', placeholder: 'Enter your email' },
        firstName: { name: 'profile.firstName', inputType: 'text', label: 'First Name', placeholder: 'Enter your first name' },
        lastName: { name: 'profile.lastName', inputType: 'text', label: 'Last Name', placeholder: 'Enter your last name' },
        avatar: { name: 'profile.avatar', inputType: 'text', label: 'Avatar URL', placeholder: 'Enter your avatar URL' },
        bio: { name: 'profile.bio', inputType: 'textarea', label: 'Bio', placeholder: 'Tell us about yourself' },
        validation: {
            userId: userProfileValidationSchema.properties.userId,
            email: userProfileValidationSchema.properties.email,
            firstName: userProfileValidationSchema.properties.firstName,
            lastName: userProfileValidationSchema.properties.lastName,
            avatar: userProfileValidationSchema.properties.avatar,
            bio: userProfileValidationSchema.properties.bio,
        },
        action: '/api/user-profiles/create',
        method: 'POST',
    },
};
