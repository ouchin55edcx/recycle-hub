// src/app/app.config.ts
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([
      (req, next) => {
        const modifiedReq = req.clone({
          headers: req.headers
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        });
        return next(modifiedReq);
      }
    ]))
  ]
};
