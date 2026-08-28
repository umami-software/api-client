import { createCipheriv, createDecipheriv, createHash, pbkdf2Sync, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';

/**
 * Port of umami's `src/lib/crypto.ts` and `src/lib/jwt.ts`.
 * Tokens created here are accepted by umami's `checkAuth`.
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENC_POSITION = TAG_POSITION + TAG_LENGTH;

const HASH_ALGO = 'sha512';
const HASH_ENCODING = 'hex';

export type SignOptions = jwt.SignOptions;

const getKey = (secret: string, salt: Buffer) => pbkdf2Sync(secret, salt, 10000, 32, 'sha512');

export function hash(...args: string[]): string {
  return createHash(HASH_ALGO).update(args.join('')).digest(HASH_ENCODING);
}

export function encrypt(value: string, secret: string): string {
  const iv = randomBytes(IV_LENGTH);
  const salt = randomBytes(SALT_LENGTH);
  const key = getKey(secret, salt);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
}

export function decrypt(value: string, secret: string): string {
  const str = Buffer.from(String(value), 'base64');
  const salt = str.subarray(0, SALT_LENGTH);
  const iv = str.subarray(SALT_LENGTH, TAG_POSITION);
  const tag = str.subarray(TAG_POSITION, ENC_POSITION);
  const encrypted = str.subarray(ENC_POSITION);

  const key = getKey(secret, salt);
  const decipher = createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(tag);

  return decipher.update(encrypted).toString('utf8') + decipher.final('utf8');
}

export function createToken(payload: object, secret: string, options?: SignOptions): string {
  return jwt.sign(payload, secret, options);
}

export function parseToken<T = any>(token: string, secret: string): T | null {
  try {
    return jwt.verify(token, secret) as T;
  } catch {
    return null;
  }
}

export function createSecureToken(payload: object, secret: string, options?: SignOptions): string {
  return encrypt(createToken(payload, secret, options), secret);
}

export function parseSecureToken<T = any>(token: string, secret: string): T | null {
  try {
    return jwt.verify(decrypt(token, secret), secret) as T;
  } catch {
    return null;
  }
}
