ARG NODE_VERSION=20.5.0

FROM node:${NODE_VERSION}-slim

ARG APP_NAME

WORKDIR /app

RUN npm i -g pnpm@8.14.0 typescript@5.3.2

COPY *.yaml .
COPY *.json .
COPY apps/${APP_NAME}/*.json apps/${APP_NAME}/
COPY packages/db/*.json packages/db/
COPY packages/lib/*.json packages/lib/
COPY packages/domain/*.json packages/domain/

RUN pnpm i

COPY packages/ packages/
RUN pnpm run build:packages
 
COPY apps/${APP_NAME}/ apps/${APP_NAME}/
RUN pnpm run build:apps

EXPOSE 3000

WORKDIR /app/apps/${APP_NAME}/

CMD node src/index.js
