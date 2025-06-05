/* ---------------- TYPES ---------------- */
type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export interface PasswordRequirementConfig {
    minLength: number; // required
    uppercaseCount?: number;
    lowercaseCount?: number;
    digitCount?: number;
    specialCount?: number;
    specialChars?: string;
    bannedWords?: string[]; // New!
    minEntropyBits?: number; // New!
}

export type StrictPasswordRequirementConfig = AtLeast<PasswordRequirementConfig, "minLength">;

export interface PasswordRequirement {
    label: string;
    test: (value: string) => boolean;
}

export interface PasswordValidationResult {
    results: { label: string; ok: boolean }[];
    score: number;
    allMet: boolean;
    entropyBits?: number;
    minEntropyMet?: boolean;
    bannedWordsFound?: string[];
}

/* ------------ TYPE GUARD ------------ */
function isPositiveNumber(val: unknown): val is number {
    return typeof val === "number" && val > 0;
}

/* ------------ REQUIREMENT SCHEMA ------------ */
type RequirementSchema = {
    key: keyof PasswordRequirementConfig;
    label: (value: number, config: PasswordRequirementConfig) => string;
    test: (pw: string, value: number, config: PasswordRequirementConfig) => boolean;
    generator?: (value: number, config: PasswordRequirementConfig) => string[];
};

const requirementSchemas: RequirementSchema[] = [
    {
        key: "minLength",
        label: (v) => `At least ${v} characters`,
        test: (pw, v) => pw.length >= v
    },
    {
        key: "uppercaseCount",
        label: (v) => `At least ${v} uppercase letter${v > 1 ? "s" : ""}`,
        test: (pw, v) => (pw.match(/[A-Z]/g) || []).length >= v,
        generator: () => [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]
    },
    {
        key: "lowercaseCount",
        label: (v) => `At least ${v} lowercase letter${v > 1 ? "s" : ""}`,
        test: (pw, v) => (pw.match(/[a-z]/g) || []).length >= v,
        generator: () => [..."abcdefghijklmnopqrstuvwxyz"]
    },
    {
        key: "digitCount",
        label: (v) => `At least ${v} number${v > 1 ? "s" : ""}`,
        test: (pw, v) => (pw.match(/[0-9]/g) || []).length >= v,
        generator: () => [..."0123456789"]
    },
    {
        key: "specialCount",
        label: (v, cfg) => `At least ${v} special character${v > 1 ? "s" : ""} (${cfg.specialChars || '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'})`,
        test: (pw, v, cfg) => {
            const chars = cfg.specialChars || '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
            const safe = chars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); // Escape regex special chars
            return (pw.match(new RegExp(`[${safe}]`, 'g')) || []).length >= v;
        },
        generator: (v, cfg) => [...(cfg.specialChars || '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~')]
    }
    // Add more rules as needed!
];


/* ------------ PASSWORD ENTROPY ------------ */
/**
 * Calculate the Shannon entropy (in bits) of a string.
 * 
 * This measures the unpredictability: higher = stronger.
 */
export function calculatePasswordEntropyBits(pw: string): number {
    if (!pw) return 0;
    const freq: Record<string, number> = {};
    for (const char of pw) {
        freq[char] = (freq[char] || 0) + 1;
    }
    let entropy = 0;
    for (const char in freq) {
        const p = freq[char] / pw.length;
        entropy -= p * Math.log2(p);
    }
    // Entropy per character × length
    return entropy * pw.length;
}

/* ------------ REQUIREMENT GENERATION ------------ */
export function generatePasswordRequirements(config: PasswordRequirementConfig): PasswordRequirement[] {
    return requirementSchemas
        .filter(s => isPositiveNumber(config[s.key]))
        .map(s => ({
            label: s.label(config[s.key] as number, config),
            test: (pw: string) => s.test(pw, config[s.key] as number, config)
        }));
}

/* ------------ VALIDATION ------------ */
export function validatePasswordWithDetails(password: string, config: PasswordRequirementConfig): PasswordValidationResult {
    const requirements = generatePasswordRequirements(config);
    let passed = 0;
    const results = requirements.map(req => {
        const ok = req.test(password);
        if (ok) passed++;
        return { label: req.label, ok };
    });

    // Entropy check (if requested)
    const entropyBits = calculatePasswordEntropyBits(password);
    const minEntropyMet = isPositiveNumber(config.minEntropyBits)
        ? entropyBits >= config.minEntropyBits!
        : undefined;

    // Banned words check
    let bannedWordsFound: string[] = [];
    if (config.bannedWords && config.bannedWords.length > 0) {
        const lowerPw = password.toLowerCase();
        bannedWordsFound = config.bannedWords.filter(
            word => word && lowerPw.includes(word.toLowerCase())
        );
    }

    return {
        results,
        score: requirements.length > 0 ? passed / requirements.length : 1,
        allMet: passed === requirements.length && (!isPositiveNumber(config.minEntropyBits) || !!minEntropyMet) && bannedWordsFound.length === 0,
        entropyBits,
        minEntropyMet,
        bannedWordsFound
    };
}

export function validatePassword(password: string, config: PasswordRequirementConfig): boolean {
    const details = validatePasswordWithDetails(password, config);
    return details.allMet;
}

/* ------------ RANDOM PASSWORD GENERATION ------------ */
export function generateRandomPassword(config: PasswordRequirementConfig): string {
    const charsPerType: string[][] = [];
    let forced: string[] = [];

    for (const s of requirementSchemas) {
        const v = config[s.key];
        if (isPositiveNumber(v) && s.generator) {
            const chars = s.generator(v, config);
            for (let i = 0; i < v; i++)
                forced.push(chars[Math.floor(Math.random() * chars.length)]);
            charsPerType.push(chars);
        }
    }
    // Fill remaining with anything allowed
    const allChars = [...new Set(charsPerType.flat())];
    const minLength = config.minLength || 8;
    for (let i = forced.length; i < minLength; i++) {
        forced.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
    // Shuffle
    for (let i = forced.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [forced[i], forced[j]] = [forced[j], forced[i]];
    }
    // Optionally, avoid banned words or check entropy here if you want only *compliant* passwords generated
    return forced.join('');
}

/* ------------ EXAMPLE USAGE ------------ */

export const passwordRequirementConfig: StrictPasswordRequirementConfig = {
    minLength: 14,
    uppercaseCount: 2,
    lowercaseCount: 2,
    digitCount: 2,
    specialCount: 1,
    // specialChars: "#$%_",
    bannedWords: ["password", "letmein", "NuBlox"],
    minEntropyBits: 60 // e.g. require at least 60 bits
};

// // Show requirements (for UI, tooltip, etc.)
// const reqs = generatePasswordRequirements(passwordRequirementConfig);
// console.log("Requirements:", reqs.map(r => r.label));

// // Generate a valid password:
// const pw = generateRandomPassword(passwordRequirementConfig);
// console.log("Generated password:", pw);

// // Validate and get detailed feedback:
// const result = validatePasswordWithDetails(pw, passwordRequirementConfig);
// console.log("Result:", result);

// // Hash/verify example:
// (async () => {
//     const hash = await hashPassword(pw);
//     const ok = await verifyPassword(pw, hash);
//     console.log("Hash:", hash);
//     console.log("Verify:", ok);
// })();

/* 
-- Want to add a new rule? --
Just add another schema entry.
The entire validation/generation system instantly supports it.
*/
