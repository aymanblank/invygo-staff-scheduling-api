# Build base
FROM node:16.15.0 as build-base

COPY . ./app

WORKDIR /app

RUN yarn install

EXPOSE 3000

# Development
FROM build-base as development-build-base

ENV NODE_ENV development

CMD ["yarn", "dev"]

# Production
FROM build-base as production-build-base

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

ADD docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENV NODE_ENV production

CMD /wait && /app/docker-entrypoint.sh