# Étape 1 : Build Angular app
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install -g @angular/cli && npm install

COPY . .
RUN npm run build -- --configuration production

# Étape 2 : Serve via Nginx
FROM nginx:alpine

# Supprime la page par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie les fichiers Angular buildés
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Expose le port 80 (Render attend ce port)
EXPOSE 80

# Lancer Nginx en mode non-démon
CMD ["nginx", "-g", "daemon off;"]
