import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { ConfigService } from './services/config/config.service';
import { authInterceptor } from './services/auth/auth.interceptor';

const loadConfig = (configService: ConfigService) => {
  return () => configService.loadConfig();
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    ConfigService,
    {
      provide: 'APP_INITIALIZER',
      useFactory: loadConfig,
      deps: [ConfigService],
      multi: true
    }
  ]
};
