import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';

fetch('/assets/config.json')
  .then((res) => res.json())
  .then((configData) => {
    return bootstrapApplication(AppComponent, {
      providers: [
        ...appConfig.providers,
        provideHttpClient(),
        { provide: 'APP_CONFIG', useValue: configData }
      ]
    });
  })
  .catch((err) => console.error('Erreur au démarrage de l’app :', err));

