
# Hollowverse

## UI guidelines
* Layout should redraw as little as possible as data comes in
* Follow the advice in [this article](https://goo.gl/1V7aJw)

## Engineering approach
* Use strong static types to mitigate some of the need of unit testing
* When a runtime bug is discovered, think about how to prevent it with stronger typing

## React guidelines
* Only page-level components may have lifecycle hooks. Other components may not.
* No stateless functional components, for consistency and simplicity's sake.

## JavaScript guidelines
* No default exports
