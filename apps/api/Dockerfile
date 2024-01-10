ARG NODE_VERSION=20.5.0
ARG APP_ROOT=apps/api/
ARG DEP_ROOT=packages/

FROM node:${NODE_VERSION}-slim

ENV NODE_ENV production 

WORKDIR /app

RUN npm i -g pnpm@8.14.0

COPY *.yaml .
COPY *.json .
COPY apps/api/*.json apps/api/
COPY packages/db/*.json packages/db/
COPY packages/lib/*.json packages/lib/
COPY packages/domain/*.json packages/domain/

# RUN apt-get update && apt-get install tree
# RUN tree .

RUN pnpm i

COPY apps/api/ apps/api/
COPY packages/ packages/

# RUN npm run build

EXPOSE 3000

CMD node apps/api/index.js
