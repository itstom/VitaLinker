// loggerMiddleware.ts
import { Middleware } from 'redux';
import { createLogger } from 'redux-logger';

const loggerMiddleware: Middleware = createLogger({
  // Options if needed
});

export default loggerMiddleware;
