FROM        node:18.16-alpine3.17 as development
WORKDIR     /usr/src/app
COPY        package.json ./
COPY        yarn.lock ./
RUN         yarn install
COPY        . .
EXPOSE      3000
CMD        ["yarn", "start:dev"]

FROM        node:18.16-alpine3.17 as production
WORKDIR     /usr/src/app
COPY        package*.json ./
COPY        --from=development /usr/src/app/ ./
EXPOSE      3000
CMD         ["yarn", "start"]
