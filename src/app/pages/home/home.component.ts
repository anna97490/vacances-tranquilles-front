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
    const interval = setInterval(() => {
      const bpWebChat = (window as any).botpressWebChat;
      if (bpWebChat && bpWebChat.conversationId) {
        const conversationId = bpWebChat.conversationId;
        const clientMessageId = this.generateSecureRandomId();

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

  private generateSecureRandomId(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return 'id-' + Array.from(array)
      .map((b) => b.toString(36).padStart(2, '0'))
      .join('')
      .slice(0, 16);
  }
}
