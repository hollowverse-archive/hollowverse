/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
require('expect-more-jest');

const { configure } = require('enzyme');

const Adapter = require('enzyme-adapter-react-16');

configure({ adapter: new Adapter() });

require('jest-enzyme');
