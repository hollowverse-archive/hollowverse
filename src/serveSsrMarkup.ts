import { APIGatewayProxyHandler } from 'aws-lambda'; // tslint:disable-line no-implicit-dependencies
import awsServerlessExpress from 'aws-serverless-express';
import { mainServer } from './mainServer';

const server = awsServerlessExpress.createServer(mainServer as any, undefined, [
  '*/*',
]);

export const serveSsrMarkup: APIGatewayProxyHandler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
