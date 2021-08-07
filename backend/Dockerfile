FROM node:12.19.0-alpine3.9 AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn add glob rimraf

RUN yarn install --production=false

COPY . .

RUN yarn build

FROM node:12.19.0-alpine3.9 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --production=true

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/main"]
