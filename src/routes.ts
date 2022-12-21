import { authRoutes } from '@auth/routes';
import { currentUserRoutes } from '@auth/routes/currentUserRoute';
import { serverAdapter } from '@service/queues/BaseQueue';
import { Application } from 'express';

const BASE_PATH = '/api/v1';
export const routeWrapper = (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoute());
    app.use(BASE_PATH, currentUserRoutes.routes());
  };
  routes();
};
