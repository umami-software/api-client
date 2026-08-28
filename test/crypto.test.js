const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const { UmamiApiClient, createSecureToken, hash, parseSecureToken } = require('../dist/cjs/index');

// Verbatim port of umami/src/lib/crypto.ts `decrypt` + jwt.ts `parseSecureToken`,
// used as an independent reference to prove token compatibility.
const SALT_LENGTH = 64;
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENC_POSITION = TAG_POSITION + TAG_LENGTH;

function umamiDecrypt(value, secret) {
  const str = Buffer.from(String(value), 'base64');
  const salt = str.subarray(0, SALT_LENGTH);
  const iv = str.subarray(SALT_LENGTH, TAG_POSITION);
  const tag = str.subarray(TAG_POSITION, ENC_POSITION);
  const encrypted = str.subarray(ENC_POSITION);
  const key = crypto.pbkdf2Sync(secret, salt, 10000, 32, 'sha512');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(encrypted) + decipher.final('utf8');
}

function umamiParseSecureToken(token, secret) {
  return jwt.verify(umamiDecrypt(token, secret), secret);
}

describe('crypto', () => {
  const secret = hash('app-secret');

  test('hash matches sha512 hex', () => {
    const expected = crypto.createHash('sha512').update('abc').digest('hex');
    expect(hash('abc')).toBe(expected);
    expect(hash('a', 'bc')).toBe(expected);
  });

  test('createSecureToken is decodable by umami parseSecureToken', () => {
    const token = createSecureToken({ userId: 'user-1' }, secret);
    const payload = umamiParseSecureToken(token, secret);
    expect(payload.userId).toBe('user-1');
  });

  test('round-trips through parseSecureToken', () => {
    const token = createSecureToken({ userId: 'user-2', role: 'admin' }, secret);
    expect(parseSecureToken(token, secret)).toMatchObject({ userId: 'user-2', role: 'admin' });
  });

  test('parseSecureToken returns null for a bad secret', () => {
    const token = createSecureToken({ userId: 'x' }, secret);
    expect(parseSecureToken(token, hash('other'))).toBeNull();
  });

  test('client mints a { userId } token from userId + secret', () => {
    const client = new UmamiApiClient({ userId: 'user-3', secret: 'app-secret' });
    expect(client.authToken).toBeTruthy();
    expect(umamiParseSecureToken(client.authToken, secret).userId).toBe('user-3');
  });

  test('client with only apiKey has no auth token', () => {
    const client = new UmamiApiClient({ apiKey: 'key' });
    expect(client.authToken).toBeUndefined();
    expect(() => client.setAuthToken({ userId: 'x' })).toThrow();
  });

  test('userId without secret does not throw and mints no token', () => {
    const client = new UmamiApiClient({ userId: 'user-4', apiKey: 'key' });
    expect(client.authToken).toBeUndefined();
    client.setSecret('late-secret');
    client.setAuthToken({ userId: 'user-4' });
    expect(umamiParseSecureToken(client.authToken, hash('late-secret')).userId).toBe('user-4');
  });
});
