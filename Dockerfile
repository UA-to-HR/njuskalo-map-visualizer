FROM node:16-alpine3.13

COPY . /app

WORKDIR /app

RUN npm install

CMD npm run start