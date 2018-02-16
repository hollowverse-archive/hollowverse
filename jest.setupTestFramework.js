/* eslint-disable import/no-extraneous-dependencies */
require('expect-more-jest');

const { configure } = require('enzyme');

const Adapter = require('enzyme-adapter-react-16');

configure({ adapter: new Adapter() });

require('jest-enzyme');
