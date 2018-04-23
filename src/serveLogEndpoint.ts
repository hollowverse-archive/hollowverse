import { APIGatewayProxyHandler } from 'aws-lambda'; // tslint:disable-line no-implicit-dependencies
import awsServerlessExpress from 'aws-serverless-express';

import { logEndpoint } from 'logger/logEndpoint';
import { createRouter } from 'createRouter';

export const expressApp = createRouter();

expressApp.use('/log', logEndpoint);

const server = awsServerlessExpress.createServer(expressApp as any, undefined, [
  '*/*',
]);

export const serveLogEndpoint: APIGatewayProxyHandler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
