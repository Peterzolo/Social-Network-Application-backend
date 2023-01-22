import express, { Express } from 'express';
import { mongoDbConnect } from './dbSetup';
import { PeepsArena } from './serverSetup';
import dotenv from 'dotenv';
import { config } from './configuration';
import Logger from 'bunyan';
dotenv.config();
const log: Logger = config.createLogger('app');

class Application {
  public initializeApp(): void {
    this.loadConfiguration();
    mongoDbConnect();
    const app: Express = express();
    const server: PeepsArena = new PeepsArena(app);
    server.start();
  }
  private loadConfiguration(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        log.info('Shutdown complete');
        process.exit(exitCode);
      })
      .catch((error) => {
        log.error(`Error during shutdown: ${error}`);
        process.exit(1);
      });
  }
}

const application: Application = new Application();
application.initializeApp();
