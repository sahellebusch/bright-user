FROM node:lts-slim as dev

WORKDIR /usr/src/app
COPY . .

RUN npm install && npm run compile
RUN ls
RUN pwd
FROM dev as prod

COPY --from=dev /usr/src/app/dist/ /usr/src/app/dist
COPY --from=dev /usr/src/app/package.json /usr/src/app/package.json

RUN npm install --production
