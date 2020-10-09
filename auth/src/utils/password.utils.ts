import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export namespace PasswordUtils {
  export async function toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buffer.toString('hex')}.${salt}`;
  }

  export async function compare(stored: string, supplied: string) {
    const [hashedPassword, salt] = stored.split('.');
    const buffer = (await scryptAsync(supplied, salt, 64)) as Buffer;

    return hashedPassword === buffer.toString('hex');
  }
}
