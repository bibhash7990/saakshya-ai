/**
 * A utility for encrypting and decrypting data on the client side using AES-GCM.
 * In a real-world scenario, you would derive a strong key from a user's password using PBKDF2/scrypt,
 * or use a key fetched securely from the backend (if utilizing KMS).
 * For this implementation, we will simulate a master key generation that can be used per session/user.
 */

const ENCRYPTION_ALGORITHM = 'AES-GCM';

// Simple helper to derive a dummy key from a string (e.g., user ID) for the MVP.
// In production, NEVER use a plain SHA-256 hash as a direct AES key without proper key derivation (PBKDF2/Argon2).
export const deriveKey = async (secret: string): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('saakshya-secure-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ENCRYPTION_ALGORITHM, length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

// Generate a random IV
const generateIv = () => window.crypto.getRandomValues(new Uint8Array(12));

/**
 * Encrypts a string into a base64 encoded ciphertext string that includes the IV.
 * Format: ivBase64:ciphertextBase64
 */
export const encryptData = async (text: string, secretKey: string): Promise<string> => {
  if (!text) return text;
  
  try {
    const key = await deriveKey(secretKey);
    const iv = generateIv();
    const encodedText = new TextEncoder().encode(text);
    
    const cipherBuffer = await window.crypto.subtle.encrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: iv,
      },
      key,
      encodedText
    );
    
    const cipherArray = Array.from(new Uint8Array(cipherBuffer));
    const cipherBase64 = btoa(String.fromCharCode.apply(null, cipherArray));
    const ivBase64 = btoa(String.fromCharCode.apply(null, Array.from(iv)));
    
    return `${ivBase64}:${cipherBase64}`;
  } catch (err) {
    console.error('Encryption failed', err);
    return text; // Fallback or throw in strict environments
  }
};

/**
 * Decrypts a base64 encoded string (ivBase64:ciphertextBase64) back to plain text.
 */
export const decryptData = async (encryptedText: string, secretKey: string): Promise<string> => {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;

  try {
    const key = await deriveKey(secretKey);
    const [ivBase64, cipherBase64] = encryptedText.split(':');
    
    const iv = new Uint8Array(
      atob(ivBase64)
        .split('')
        .map((char) => char.charCodeAt(0))
    );
    
    const cipherBuffer = new Uint8Array(
      atob(cipherBase64)
        .split('')
        .map((char) => char.charCodeAt(0))
    ).buffer;

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: iv,
      },
      key,
      cipherBuffer
    );
    
    return new TextDecoder().decode(decryptedBuffer);
  } catch (err) {
    console.error('Decryption failed', err);
    return encryptedText; // If it fails, maybe it wasn't encrypted, or wrong key.
  }
};
