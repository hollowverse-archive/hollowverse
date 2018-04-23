import { APIGatewayProxyHandler } from 'aws-lambda'; // tslint:disable-line no-implicit-dependencies
import awsServerlessExpress from 'aws-serverless-express';
import express from 'express';

import { securityMiddleware } from './middleware/security';
import { logEndpoint } from './logger/logEndpoint';

export const expressApp = express();

expressApp.use(...securityMiddleware);

expressApp.use(logEndpoint);

const server = awsServerlessExpress.createServer(expressApp as any, undefined, [
  '*/*',
]);

export const serveLogEndpoint: APIGatewayProxyHandler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
