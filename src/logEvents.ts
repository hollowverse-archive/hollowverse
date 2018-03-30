import { APIGatewayProxyHandler } from 'aws-lambda'; // tslint:disable-line no-implicit-dependencies

export const logEvents: APIGatewayProxyHandler = async (_c, _d) => {
  return 'ok';
};
