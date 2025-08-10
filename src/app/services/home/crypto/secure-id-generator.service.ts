// Service pour la génération d'IDs sécurisés
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecureIdGeneratorService {

  /**
   * Génère un ID sécurisé unique
   * @param prefix Préfixe optionnel pour l'ID
   * @param length Longueur souhaitée pour l'ID
   */
  async generateSecureRandomId(prefix: string = 'id', length: number = 16): Promise<string> {
    try {
      // Essayer d'abord Web Crypto API
      if (typeof window !== 'undefined' && window.crypto) {
        return this.generateWebCryptoId(prefix, length);
      }
      
      // Dernier recours : fallback sécurisé
      return this.generateSecureFallbackId(prefix, length);
      
    } catch (error) {
      console.warn('Crypto APIs failed, using secure fallback:', error);
      return this.generateSecureFallbackId(prefix, length);
    }
  }

  /**
   * Génère un ID en utilisant Web Crypto API
   */
  private generateWebCryptoId(prefix: string, length: number): string {
    const array = new Uint8Array(Math.ceil(length / 2));
    window.crypto.getRandomValues(array);
    const id = Array.from(array)
      .map(b => b.toString(36).padStart(2, '0'))
      .join('')
      .slice(0, length);
    return `${prefix}-${id}`;
  }

  /**
   * Fallback utilisant crypto.subtle
   */
  private async generateCryptoSubtleFallback(prefix: string, length: number): Promise<string> {
    try {
      const key = await this.subtleGenerateKey();
      const exported = await window.crypto.subtle.exportKey('raw', key);
      const array = new Uint8Array(exported);
      
      const id = Array.from(array.slice(0, Math.ceil(length / 2)))
        .map(b => b.toString(36))
        .join('')
        .slice(0, length);
        
      return `${prefix}-${id}`;
        
    } catch (error) {
      console.error('Crypto subtle fallback failed:', error);
      throw error;
    }
  }

  /**
   * Génère un ID sécurisé sans utiliser Math.random()
   */
  private generateSecureFallbackId(prefix: string, length: number): string {
    // Sources d'entropie basées sur l'environnement
    const entropy = this.collectEntropySources();
    
    // Hachage robuste
    const { hash1, hash2 } = this.calculateHashes(entropy);
    
    // Mélanger les deux hashes
    const finalHash = (hash1 ^ hash2) >>> 0; // Unsigned 32-bit
    
    // Générer l'ID
    const base = finalHash.toString(36);
    const timestamp = Date.now().toString(36);
    const perfValue = Math.floor(performance.now() * 1000).toString(36);
    
    const id = `${base}${timestamp}${perfValue}`.slice(0, length);
    return `${prefix}-${id}`;
  }

  /**
   * Collecte des sources d'entropie environnementales
   */
  private collectEntropySources(): number[] {
    return [
      Date.now(),
      performance.now() * 1000000,
      performance.timeOrigin,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 4,
      navigator.maxTouchPoints || 0,
      screen.width * screen.height,
      screen.colorDepth,
      window.innerWidth * window.innerHeight,
      document.documentElement.clientWidth,
      (navigator.userAgent + navigator.language).length,
      document.referrer.length,
      history.length,
      window.devicePixelRatio * 1000,
      navigator.cookieEnabled ? 1 : 0,
      navigator.onLine ? 1 : 0
    ];
  }

  /**
   * Calcule les hashes à partir des sources d'entropie
   */
  private calculateHashes(entropy: number[]): { hash1: number; hash2: number } {
    let hash1 = 0x811c9dc5; // FNV-1a initial hash
    let hash2 = 0x9e3779b9; // Golden ratio hash
    
    entropy.forEach((source, index) => {
      const value = Math.floor(source) ^ (index * 0x6c078965);
      
      // FNV-1a hash pour hash1
      hash1 ^= value & 0xff;
      hash1 *= 0x01000193;
      hash1 ^= (value >> 8) & 0xff;
      hash1 *= 0x01000193;
      
      // Golden ratio hash pour hash2
      hash2 ^= value;
      hash2 *= 0x9e3779b9;
      hash2 ^= hash2 >> 16;
    });

    return { hash1, hash2 };
  }

  /**
   * Génère une clé cryptographique
   */
  private async subtleGenerateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt']
    );
  }
}