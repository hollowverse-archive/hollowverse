import { APIGatewayProxyHandler } from 'aws-lambda'; // tslint:disable-line no-implicit-dependencies
import awsServerlessExpress from 'aws-serverless-express';
import { mainServer } from './mainServer';

const server = awsServerlessExpress.createServer(mainServer);

export const serveSsrMarkup: APIGatewayProxyHandler = async (
  event,
  context,
) => {
  return awsServerlessExpress.proxy(server, event, context);
};
