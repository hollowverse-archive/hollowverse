import express from 'express';
import { securityMiddleware } from 'middleware/security';

const { BRANCH, COMMIT_ID } = process.env;

export const createRouter = () => {
  const expressApp = express();

  if (BRANCH && COMMIT_ID) {
    expressApp.use((_, res, next) => {
      // Add version details to custom headers
      res.setHeader('X-Hollowverse-Actual-Environment-Branch', BRANCH);
      res.setHeader('X-Hollowverse-Actual-Environment-Commit-ID', COMMIT_ID);

      // Tell browsers not to use cached pages if the commit ID of the environment differs
      res.vary('X-Hollowverse-Actual-Environment-Commit-ID');

      next();
    });
  }

  expressApp.use(...securityMiddleware);

  return expressApp;
};
