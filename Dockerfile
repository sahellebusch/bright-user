FROM node:lts-slim as dev

WORKDIR /usr/src/app
COPY . .

RUN npm install && npm run compile

FROM dev as prod

COPY dist/ dist/
COPY package.json package.json

RUN npm install --production
