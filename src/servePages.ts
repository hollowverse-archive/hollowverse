import { APIGatewayProxyHandler } from 'aws-lambda'; // tslint:disable-line no-implicit-dependencies
import awsServerlessExpress from 'aws-serverless-express';
import express from 'express';
import moment from 'moment';

import { securityMiddleware } from './middleware/security';
import { clientDistDirectory, publicPath } from './webpack/variables';

export const expressApp = express();

expressApp.use(...securityMiddleware);

// Serve client build like usual
// This must be defined before the SSR middleware so that
// requests to static files, e.g. /static/app.js, are not
// processed by the server rendering middleware below
expressApp.use(publicPath, [
  // Configure Cache-Control header
  express.static(clientDistDirectory, {
    maxAge: moment.duration(30, 'days').asMilliseconds(),

    // Safe to use the `immutable` directive because filenames
    // contain unique, content-based hashes
    immutable: true,

    // Send index.html when requesting /
    index: 'index.html',
  }),
]);

const server = awsServerlessExpress.createServer(expressApp as any, undefined, [
  '*/*',
]);

export const lambdaHandler: APIGatewayProxyHandler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
