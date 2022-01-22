FROM node:16-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install pnpm -g

RUN pnpm install --only=prod

COPY ./server/* ./

EXPOSE 8080
CMD [ "node", "app.mjs" ]
