import { APIGatewayProxyHandler } from 'aws-lambda'; // tslint:disable-line no-implicit-dependencies

export const serveSsrMarkup: APIGatewayProxyHandler = async (_c, _d) => {
  return 'ok';
};
