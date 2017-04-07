# Hollowverse

Politics, religions, and ideas.

# Contributing

We're currently at the stage of heavy initial development. Any contributions are appreciated!
Please submit an issue with you questions if you're not sure where to start.

## Getting Started

### Prerequisites

* Install latest stable [Node.js](https://nodejs.org/en/)
* Install dependencies: `npm install` in this directory

### Front-end

* Start webpack-dev-server: `npm run client/dev`

This will provide a dev version of the front-end on `localhost:8080` and rebuild it on changes.

### Back-end

* Start the server via nodemon: `npm run server/dev`

This will run the server straight from the source in `./server/src`. Nodemon will automatically refresh it on changes.

## Built With

* [TypeScript](https://www.typescriptlang.org/) - strongly typed language compiled to JavaScript
* [React](https://facebook.github.io/react/) - front-end library for building UI
* [Redux](http://redux.js.org/) - state container for structuring business logic in a predictable way
* [Sass](http://sass-lang.com/) - superset of CSS for easier styling
* [Firebase](https://firebase.google.com/) - tools and infrastructure for the server side, abstraction over the Google Cloud Platform
* [Webpack](https://webpack.github.io/) - module bundler for concatenating and minifying JavaScript

### UX guidelines

* Layout should redraw as little as possible as data comes in
* Follow the advice in [this article](https://goo.gl/1V7aJw)
* Use optimistic updates wherever possible

### Engineering guidelines

* Use strong static types to mitigate some of the need of unit testing
* When a runtime bug is discovered, think about how to prevent it with stronger typing
* Anything that can be executed server-side (such as business logic) should be executed server-side, 
the client-side should be as lightweight as possible 

### React guidelines

* Only page-level components may have lifecycle hooks. Other components may not
* No stateless functional components, for consistency and simplicity's sake

### JavaScript guidelines

* Don't use JavaScript anywhere, only TypeScript
* No default exports
* In lieu of a formal styleguide, take care to maintain the existing coding style

## License

This is free and unencumbered software released into the public domain. See the [LICENSE.md](./LICENSE.md) file for details.
