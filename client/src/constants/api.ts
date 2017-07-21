// The API will be on 3000 in development. In production, we use
// `undefined` which means the same URL base of the app
// tslint:disable-next-line no-http-string
export const API_BASE = __DEBUG__ ? 'http://localhost:3000' : undefined;
