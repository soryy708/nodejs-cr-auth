# Proof of concept implementation of challenge-response authentication

https://ivan-rubinson.medium.com/how-to-do-authentication-in-nodejs-48c16748749b

## Prerequisites

* [NodeJS](https://nodejs.org/en/)
* [Docker](https://www.docker.com/)

## Database

This project uses [MongoDB](https://www.mongodb.com/).
In the development environment, it can be easily set up locally via [docker](https://www.docker.com/).
By using the [mongo image @ docker hub](https://hub.docker.com/_/mongo)
like so:

    docker run -p 27017:27017 -d mongo:latest

This downloads the latest mongo release from docker hub, and spins up a database in a container.

## How to run

1. `npm i`
2. `npm run build`
3. `docker run -p 27017:27017 -d mongo:latest`
4. `npm start`
5. Open `dist/web/index.html` in browser
