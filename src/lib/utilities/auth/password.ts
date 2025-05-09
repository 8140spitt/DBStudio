import { randomBytes, pbkdf2Sync } from 'node:crypto';

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
    if (!stored.includes(':')) return false;

    const [salt, originalHash] = stored.split(':');
    const hash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');

    return hash === originalHash;
}