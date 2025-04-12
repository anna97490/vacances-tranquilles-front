FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @angular/cli && npm install

COPY . .

RUN npx ng analytics off

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
