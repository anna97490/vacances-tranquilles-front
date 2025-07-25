import { Component, HostBinding, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { HomeContentService, HomeContent } from './../../services/home-content.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { FooterComponent } from '../../components/footer/footer.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule, MatIconModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  content!: HomeContent;
  mainLogo = 'assets/pictures/logo.png';
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.height') height = '100%';
  private scriptElements: HTMLScriptElement[] = [];
  constructor(private homeContentService: HomeContentService, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Rendre robuste face à un contenu null/undefined
    const content = this.homeContentService.getContent();
    this.content = content ?? {
      title: '',
      subtitle: '',
      introText: '',
      btnPrestataire: '',
      btnParticulier: '',
      btnConnexion: '',
      featuresTitle: '',
      iconType: 'custom',
      mainIcon: '',
      features: []
    };
    this.addScript('https://cdn.botpress.cloud/webchat/v3.0/inject.js');
    this.addScript('https://files.bpcontent.cloud/2025/06/23/13/20250623131622-WAJI2P5Q.js');
    this.sendBonjourToBotpress();
  }
  ngOnDestroy(): void {
    // Nettoyage pour éviter les conflits si on navigue ailleurs
    this.scriptElements.forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    this.scriptElements = [];
  }

  private addScript(src: string): void {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    this.renderer.appendChild(document.body, script);
    this.scriptElements.push(script);
  }
  /**
   * Envoie le message 'Bonjour' au chatbot Botpress via une requête POST,
   * une fois que le widget et la conversation sont initialisés.
   */
  private sendBonjourToBotpress(): void {
    const interval = setInterval(async () => {
      const bpWebChat = (window as any).botpressWebChat;
      if (bpWebChat && bpWebChat.conversationId) {
        const conversationId = bpWebChat.conversationId;
        const clientMessageId = await this.generateSecureRandomId();

        fetch('https://webchat.botpress.cloud/30677914-9ece-488e-b7ad-f2415dad46c3/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            conversationId,
            payload: { type: 'text', text: 'Bonjour' },
            metadata: { clientMessageId }
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi du message');
          }
          return response.json();
        })
        .then(data => {
          console.log('Message envoyé avec succès', data);
        })
        .catch(error => {
          console.error('Erreur lors de l\'envoi du message', error);
        });
        clearInterval(interval);
      }
    }, 500);
  }

private async generateSecureRandomId(): Promise<string> {
  try {
    // Essayer d'abord Web Crypto API
    if (window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(16);
      window.crypto.getRandomValues(array);
      return 'id-' + Array.from(array)
        .map(b => b.toString(36).padStart(2, '0'))
        .join('')
        .slice(0, 16);
    }
    
    // Fallback avec crypto subtil si disponible
    if (window.crypto && window.crypto.subtle) {
      return await this.generateCryptoSubtleFallback();
    }
    
    // Dernier recours : fallback sécurisé
    return this.generateSecureFallbackId();
    
  } catch (error) {
    console.warn('Crypto APIs failed, using secure fallback:', error);
    return this.generateSecureFallbackId();
  }
}

  private async generateCryptoSubtleFallback(): Promise<string> {
    try {
      const key = await this.subtleGenerateKey();
      
      const exported = await window.crypto.subtle.exportKey('raw', key);
      const array = new Uint8Array(exported);
      
      return 'id-' + Array.from(array.slice(0, 16))
        .map(b => b.toString(36))
        .join('')
        .slice(0, 16);
        
    } catch (error) {
      throw new Error('Crypto subtle fallback failed');
    }
  }

  private generateSecureFallbackId(): string {
    // Sources d'entropie basées sur l'environnement (non prédictibles)
    const entropy = [
      Date.now(),
      performance.now() * 1000000, // Microsecondes haute précision
      performance.timeOrigin,
      // Utiliser des sources d'entropie du navigateur
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
      // Sources d'entropie additionnelles
      window.devicePixelRatio * 1000,
      navigator.cookieEnabled ? 1 : 0,
      navigator.onLine ? 1 : 0
    ];
    
    // Hachage plus robuste sans Math.random()
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
    
    // Mélanger les deux hashes
    const finalHash = (hash1 ^ hash2) >>> 0; // Unsigned 32-bit
    
    // Générer l'ID sans Math.random()
    const base = finalHash.toString(36);
    const timestamp = Date.now().toString(36);
    const perfValue: any = Math.floor(performance.now() * 1000).toString(36);
    
    return `id-${base}${timestamp}${perfValue}`.slice(0, 18);
  }

  private async subtleGenerateKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt']
  );
}
}
