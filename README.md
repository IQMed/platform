# Platform #
Platform for IQMED INNOVATION

## Works ##
* scaffold with express and webpack-dev-middleware
* use milligram
* login with passport-local

## development ##

1. Install NPM dependencies

`npm install`

2. Then choose one option of these commands

`npm start` start express server with webpack [http://localhost:3000](http://localhost:3000)
`npm watch` start express server with watching mode (nodemon) [http://localhost:3000](http://localhost:3000)
`NODE_ENV=production npm start` start express server in production mode [http://localhost:3000](http://localhost:3000)
`PORT=3333 npm start` start express server in development mode [http://localhost:3333](http://localhost:3333)
`NODE_ENV=production HTTPS=true npm start` start express server in production mode with secure cookie [http://localhost:3000](http://localhost:3000)
`npm run build` build the frontend app in development mode (target at ./dist)
`npm run build:prod` build the frontend app in production mode (target at ./dist)

***********************************************