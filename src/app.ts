import express, { Express } from "express";
import { mongoDbConnect } from "./dbSetup";
import { PeepsArena } from "./serverSetup";
import dotenv from "dotenv";
import { config } from "./configuration";
dotenv.config();

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
  }
}

const application: Application = new Application();
application.initializeApp();
