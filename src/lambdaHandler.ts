import { APIGatewayProxyHandler } from 'aws-lambda'; // tslint:disable-line no-implicit-dependencies
import awsServerlessExpress from 'aws-serverless-express';
import { expressApp } from 'expressApp';

const server = awsServerlessExpress.createServer(expressApp as any, undefined, [
  '*/*',
]);

export const lambdaHandler: APIGatewayProxyHandler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
