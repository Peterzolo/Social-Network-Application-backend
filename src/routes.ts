import { authRoutes } from '@auth/routes';
import { Application } from 'express';
const BASE_PATH = '/api/v1';
export const routeWrapper = (app: Application) => {
  const routes = () => {
    app.use(BASE_PATH, authRoutes.routes());
  };
  routes();
};
