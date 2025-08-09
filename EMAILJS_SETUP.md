# Configuration EmailJS pour le formulaire de contact

## Qu'est-ce qu'EmailJS ?

EmailJS est un service qui permet d'envoyer des emails directement depuis le frontend sans avoir besoin d'un backend. Il utilise des templates d'email et des services SMTP préconfigurés.

## Étapes de configuration

### 1. Créer un compte EmailJS

1. Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Créez un compte gratuit
3. Connectez-vous à votre dashboard

### 2. Configurer un service email

1. Dans votre dashboard, allez dans **Email Services**
2. Cliquez sur **Add New Service**
3. Choisissez **Outlook** (ou Gmail si vous préférez)
4. Connectez votre compte email `vacancestranquilles@outlook.fr`
5. Notez le **Service ID** généré

### 3. Créer un template d'email

1. Allez dans **Email Templates**
2. Cliquez sur **Create New Template**
3. Utilisez ce modèle de template :

```html
<h2>Nouveau message de contact</h2>

<p><strong>Nom :</strong> {{nom}}</p>
<p><strong>Prénom :</strong> {{prenom}}</p>
<p><strong>Objet :</strong> {{objet}}</p>
<p><strong>Demande :</strong></p>
<p>{{demande}}</p>

<hr>
<p><em>Message envoyé depuis le formulaire de contact du site Vacances Tranquilles</em></p>
```

4. Notez le **Template ID** généré

### 4. Obtenir votre clé publique

1. Allez dans **Account** > **API Keys**
2. Copiez votre **Public Key**

### 5. Mettre à jour la configuration

Modifiez le fichier `src/app/config/emailjs.config.ts` :

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'VOTRE_SERVICE_ID_ICI',
  TEMPLATE_ID: 'VOTRE_TEMPLATE_ID_ICI',
  PUBLIC_KEY: 'VOTRE_PUBLIC_KEY_ICI',
  TO_EMAIL: 'vacancestranquilles@outlook.fr'
};
```

## Avantages de cette solution

✅ **Aucun backend requis** - Tout fonctionne côté client  
✅ **Envoi direct** - L'email est envoyé immédiatement à votre adresse  
✅ **Templates personnalisables** - Vous pouvez modifier le format des emails  
✅ **Gratuit** - 200 emails/mois avec le plan gratuit  
✅ **Sécurisé** - Utilise des clés API sécurisées  

## Test

Une fois configuré, testez le formulaire de contact. L'email devrait être envoyé directement à `vacancestranquilles@outlook.fr` sans ouvrir de client email externe.

## Support

Si vous rencontrez des problèmes :
- [Documentation EmailJS](https://www.emailjs.com/docs/)
- [FAQ EmailJS](https://www.emailjs.com/faq/)
- Support client : support@emailjs.com
