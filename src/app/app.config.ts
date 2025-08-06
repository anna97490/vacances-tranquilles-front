import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { ConfigService } from './services/config/config.service';

const loadConfig = (configService: ConfigService) => {
  return () => configService.loadConfig();
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    ConfigService,
    {
      provide: 'APP_INITIALIZER',
      useFactory: loadConfig,
      deps: [ConfigService],
      multi: true
    }
  ]
};
