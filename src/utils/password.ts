/**
 * Password utility functions for hashing and comparing passwords
 * 
 * Note: In a real implementation, you would use a proper password hashing library
 * like bcrypt or argon2. Since we're just building scaffolding and Bun has native
 * crypto support, we're using a simplified version with Bun's crypto APIs.
 */

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
    // In a real implementation, this would use bcrypt or argon2
    // For this scaffolding, we're using a simplified version
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Generate a random salt
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Hash the password with the salt
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      new Uint8Array([...salt, ...data])
    );
    
    // Convert the hash to a Base64 string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const saltArray = Array.from(salt);
    const hashWithSalt = [...saltArray, ...hashArray];
    
    // Encode as base64
    return btoa(String.fromCharCode(...hashWithSalt));
  }
  
  /**
   * Compare a password with a hash
   */
  export async function comparePasswords(password: string, hash: string): Promise<boolean> {
    try {
      // Decode the base64 string
      const hashWithSalt = new Uint8Array(
        atob(hash)
          .split('')
          .map(char => char.charCodeAt(0))
      );
      
      // Extract the salt (first 16 bytes)
      const salt = hashWithSalt.slice(0, 16);
      const storedHash = hashWithSalt.slice(16);
      
      // Hash the input password with the same salt
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest(
        'SHA-256',
        new Uint8Array([...salt, ...data])
      );
      
      // Convert to Uint8Array
      const newHash = new Uint8Array(hashBuffer);
      
      // Compare the hashes
      if (storedHash.length !== newHash.length) {
        return false;
      }
      
      // Time-constant comparison to prevent timing attacks
      let result = 0;
      for (let i = 0; i < storedHash.length; i++) {
        result |= storedHash[i] ^ newHash[i];
      }
      
      return result === 0;
    } catch (error) {
      // If there's any error in decoding or comparison, return false
      return false;
    }
  }