import express from 'express';
import { securityMiddleware } from 'middleware/security';

const { BRANCH, COMMIT_ID } = process.env;

export const createRouter = () => {
  const expressApp = express();

  // Add version details to custom header
  if (BRANCH && COMMIT_ID) {
    expressApp.use((_, res, next) => {
      res.setHeader('X-Hollowverse-Actual-Environment-Branch', BRANCH);
      res.setHeader('X-Hollowverse-Actual-Environment-Commit-ID', COMMIT_ID);

      next();
    });
  }

  expressApp.use(...securityMiddleware);

  return expressApp;
};
