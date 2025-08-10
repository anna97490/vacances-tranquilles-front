# Étape 1 : build Angular
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Étape 2 : lancer avec 'serve'
FROM node:18-alpine

WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist/frontend /app
EXPOSE 80
CMD ["serve", "-s", ".", "-l", "80"]
