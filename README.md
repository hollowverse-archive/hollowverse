# Hollowverse

[![Build Status](https://travis-ci.org/hollowverse/hollowverse.svg?branch=master)](https://travis-ci.org/hollowverse/hollowverse)
[![Greenkeeper badge](https://badges.greenkeeper.io/hollowverse/hollowverse.svg)](https://greenkeeper.io/)
[![Discord Badge](https://img.shields.io/discord/308394001789353985.svg)](https://discordapp.com/invite/KmnPYnu)

Politics, religions, and ideas.

## Getting started

### Prerequisites

* Install latest stable [Node.js](https://nodejs.org/en/)
* Install [Yarn](https://yarnpkg.com/lang/en/docs/install/) globally.
* Install dependencies: `yarn install` in this directory

### Front-end

* Start webpack-dev-server: `yarn client/dev`

This will provide a dev version of the front-end on `localhost:8080` and rebuild it on changes.

### Back-end

* Start the server via nodemon: `yarn server/express`

This will run the server straight from the source in `./server/src`. Nodemon will automatically refresh it on changes.

### Building in production mode

* Build assets in production mode and run Firebase Hosting locally: `yarn server/firebase`

This will build the JavaScript bundle in production mode and then execute `firebase serve`.

## Built with

* [TypeScript](https://www.typescriptlang.org/) - strongly typed language compiled to JavaScript
* [React](https://facebook.github.io/react/) - front-end library for building UI
* [Redux](http://redux.js.org/) - state container for structuring business logic in a predictable way
* [Aphrodite](https://github.com/Khan/aphrodite) - CSS in JS solution
* [Firebase](https://firebase.google.com/) - tools and infrastructure for the server side, abstraction over the Google Cloud Platform
* [Webpack](https://webpack.github.io/) - module bundler for concatenating and minifying JavaScript

## More information

For more information, see the [wiki](https://github.com/hollowverse/hollowverse/wiki).

## License

This is free and unencumbered software released into the public domain. See the [LICENSE.md](./LICENSE.md) file for details.
