FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install pnpm -g

RUN pnpm install

COPY ./server/* .

EXPOSE 8080
CMD [ "node", "app.mjs" ]