/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint-env node, jest */
require('expect-more-jest');

const { configure } = require('enzyme');

const Adapter = require('enzyme-adapter-react-16');

configure({ adapter: new Adapter() });

require('jest-enzyme');

beforeEach(() => {
  expect.hasAssertions();
});

// Require the mock.
const { IDBFactory, IDBKeyRange, reset } = require('shelving-mock-indexeddb');

// Create an IDBFactory at window.indexedDB so your code can use IndexedDB.
window.indexedDB = new IDBFactory();

// Make IDBKeyRange global so your code can create key ranges.
window.IDBKeyRange = IDBKeyRange;

// Reset the IndexedDB mock before/after tests.
// This will clear all object stores, indexes, and data.
beforeEach(() => reset());
afterEach(() => reset());
