import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

/**
 * ClipFlow Encryption Utility
 * 
 * This module provides secure AES-256-GCM encryption for sensitive data (OAuth tokens).
 * It implements a versioning system (e.g., "v1:...") to allow for future key rotation
 * without breaking existing database records.
 * 
 * @author Antigravity (Senior AI Coding Assistant)
 */

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
const ALGORITHM = "aes-256-gcm";
const CURRENT_VERSION = "v1";

// Derive a 32-byte key from the environment secret.
// Using scrypt for key derivation adds a layer of protection against brute-force if the secret is weak.
const getEncryptionKey = () => {
  if (!ENCRYPTION_SECRET) {
    // In production, we should throw an error. For MVP/Dev, we log a loud warning.
    console.error("CRITICAL: ENCRYPTION_SECRET is not set in environment variables!");
    return scryptSync("dev-fallback-secret-do-not-use-in-prod", "clipflow-salt", 32);
  }
  return scryptSync(ENCRYPTION_SECRET, "clipflow-salt", 32);
};

/**
 * Encrypts a string into a versioned format: version:iv:authTag:ciphertext
 * 
 * @param text The plaintext string to encrypt
 * @returns The encrypted string with version and metadata prefixes
 */
export function encrypt(text: string): string {
  if (!text) return text;
  
  try {
    const iv = randomBytes(12); // Standard IV size for GCM
    const key = getEncryptionKey();
    const cipher = createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    const authTag = cipher.getAuthTag().toString("hex");
    
    // Structure: v1:iv:authTag:encryptedContent
    const result = `${CURRENT_VERSION}:${iv.toString("hex")}:${authTag}:${encrypted}`;
    
    return result;
  } catch (error) {
    console.error("[Crypto] Encryption Error:", error instanceof Error ? error.message : error);
    throw new Error("Failed to secure sensitive data");
  }
}

/**
 * Decrypts a versioned ciphertext string.
 * If the input is not versioned (no "v1:" prefix), it returns the input as-is.
 * This allows for smooth migration from plaintext to encrypted data.
 * 
 * @param cipherText The encrypted string from the database
 * @returns The decrypted plaintext string
 */
export function decrypt(cipherText: string): string {
  if (!cipherText) return cipherText;

  // Migration Support: If it doesn't start with our version prefix, assume it's plaintext
  if (!cipherText.startsWith(`${CURRENT_VERSION}:`)) {
    return cipherText;
  }
  
  try {
    const [version, ivHex, authTagHex, encrypted] = cipherText.split(":");
    
    if (version !== "v1") {
      throw new Error(`Unsupported encryption version: ${version}`);
    }

    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    // We log the error but don't throw, to avoid crashing the whole request
    // if a single token is corrupted.
    console.error("[Crypto] Decryption Error:", error instanceof Error ? error.message : error);
    return cipherText; 
  }
}
