# Asynchronous Data

This store "feature" works with the `WithData` component to allow asynchronus fetching and storing of arbitrary data from APIs, with support for:

* Success, progress and error states
* Optimistic results
* Fetching data on the server-side, and avoiding another request for the initial client rendering
* The ability to opt-out of server-side rendering

`WithData` dispatches an action that has a `load` function. This is an asynchronus function that can fetch arbitray types of data asynchronously.

Each data request should have a `key` and a `requestId`:

* `key` indicates where to store the request result. For example, `'searchResults'`.
* `requestId` is a unique identifier for each request. For example, a data request for `'searchResults'` could have a `requestId` of `'Tom Hanks'`. On the initial client-side render, `WithData` will compare the `requestId` on the client and avoid repeating the request if the data is already available in Redux store.

The [`./epic.ts`](./epic.ts) observes the dispatched actions, executes the asynchronous function and sets the progress status for the corresponding data key while the function executes. `WithData` reads the progress status and provides it to its children, wrapped as an [`AsyncResult`](/src/app/helpers/asyncResults.ts). Children can use this information to show a loading indicator, an error message if the request fails, or the actual result if the request succeeds.

## Optimistic Results

When the `allowOptimisticUpdates` prop is set to `true` on `WithData`, the epic will keep the results of the previous data request of the same data key while the new request is being made. This allows the children to keep showing the outdated data instead of switching to a loading indicator and switching again to the new results when they are available.

An example of this is performing search with autocomplete suggestions. We usually want to keep showing the results while the user is typing the search query and filter them as new data comes in.
