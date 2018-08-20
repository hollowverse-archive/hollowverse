/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint-env node, jest, browser */
require('expect-more-jest');

require('react-testing-library/cleanup-after-each');

require('jest-dom/extend-expect');

require('intersection-observer');

// Require the mock.
const { IDBFactory, IDBKeyRange, reset } = require('shelving-mock-indexeddb');
// Create an IDBFactory at window.indexedDB so your code can use IndexedDB.
// @ts-ignore
window.indexedDB = new IDBFactory();
// Make IDBKeyRange global so your code can create key ranges.
// @ts-ignore
window.IDBKeyRange = IDBKeyRange;
// Reset the IndexedDB mock before/after tests.
// This will clear all object stores, indexes, and data.
beforeEach(() => reset());
afterEach(() => reset());
