# Vacances Tranquilles — Frontend

Ce dépôt contient l’interface utilisateur de l’application **Vacances Tranquilles**, développée en Angular.
Ce projet permet aux particuliers de réserver des services à domicile (ménage, jardinage, petits travaux...) pendant leurs vacances, et aux prestataires de gérer leurs missions.

Le frontend consomme les API du backend Java (voir lien plus bas) et s’interface avec l’utilisateur final via un design responsive.

---

## Technologies utilisées :
- Angular 18 (CLI)
- TypeScript
- RxJS
- Bootstrap / SCSS
- TypeDoc (documentation)
- Karma + Jasmine (tests unitaires)

---

## Lancer le serveur de développement :

1. npm install
2. npm start
Accès local : http://localhost:4200

---

## Commandes Angular utiles :

- Générer un composant :
  ng generate component component-name

- Compiler le projet :
  ng build

- Exécuter les tests unitaires :
  ng test

- Lancer les tests end-to-end (si activés) :
  ng e2e

---

## Structure du dépôt :

- src/ — code source Angular
- docs/ — documentation fonctionnelle
- package.json — fichier de configuration des dépendances Node.js

---

## Documentation disponible :

La documentation fonctionnelle destinée aux utilisateurs est disponible dans le dossier /docs.

- manuel-utilisation.md

Les manuels techniques de déploiement et de maintenance sont disponibles dans le dépôt backend :
https://github.com/anna97490/vacances-tranquilles-back/tree/main/docs

---

## Autres dépôts :

Backend Java (Spring Boot) :
https://github.com/anna97490/vacances-tranquilles-back


