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

jest.mock('no-scroll');
