// Service pour la gestion des scripts
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {
  private readonly renderer: Renderer2;
  private scriptElements: HTMLScriptElement[] = [];

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Ajoute un script au DOM
   * @param src URL du script à charger
   * @param async Si le script doit être chargé en mode asynchrone
   */
  addScript(src: string, async: boolean = true): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = this.renderer.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      script.async = async;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

      this.renderer.appendChild(document.body, script);
      this.scriptElements.push(script);
    });
  }

  /**
   * Charge plusieurs scripts en séquence
   * @param scripts Liste des URLs de scripts à charger
   */
  async loadScripts(scripts: string[]): Promise<void> {
    for (const src of scripts) {
      await this.addScript(src);
    }
  }

  /**
   * Nettoie tous les scripts ajoutés
   */
  cleanupScripts(): void {
    this.scriptElements.forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    this.scriptElements = [];
  }

  /**
   * Vérifie si un script est déjà chargé
   * @param src URL du script à vérifier
   */
  isScriptLoaded(src: string): boolean {
    return document.querySelector(`script[src="${src}"]`) !== null;
  }
}
