# Frontend
# Vacances Tranquilles Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.9.
Vacances Tranquilles is an Angular 18 app that connects travellers with trusted providers for home services, bookings, and easy holiday management.

## Development server
## Prerequisites
- [Node.js](https://nodejs.org/) 18+
- npm 9+ (comes with Node.js)

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Installation
1. Clone the repository
   ```bash
   git clone https://github.com/anna97490/vacances-tranquilles-front.git
   rename vacacances-tranquilles-front to frontend
   cd frontend
   ```
2. Install dependencies
   ```bash
   npm install
   ```

## Code scaffolding
## Development server
Start the application locally:
```bash
npm start
```
The app is available at [http://localhost:4200](http://localhost:4200) and reloads automatically on file changes.

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.
Backend and Stripe settings can be adjusted in `src/environments/environment.ts`.

## Build

Run `npm build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
- `npm run build` – build the application into `dist/`
- `npm run build:prod` – production build

## Documentation
Generate TypeDoc documentation:
```bash
npm run docs
```
Output is generated in `docs/typedoc/`.

## Running without Docker
A Dockerfile is provided for deployment, but local development only requires Node.js. Follow the steps above to run the frontend without Docker.``

---

## Documentation disponible :

La documentation fonctionnelle destinée aux utilisateurs est disponible dans le dossier [`docs/`](./docs/).

- [Manuel d'utilisation](./docs/manuel-utilisation.md)

La documentation d’exploitation et de mise à jour est disponible dans le dépôt backend :

- [Manuel de déploiement](https://github.com/anna97490/vacances-tranquilles-back/tree/main/docs/manuel-deploiement.md)
- [Manuel de mise à jour](https://github.com/anna97490/vacances-tranquilles-back/tree/main/docs/manuel-mise-a-jour.md)

---

## Other repository

- Backend Java (Spring Boot) : [vacances-tranquilles-back](https://github.com/anna97490/vacances-tranquilles-back)

