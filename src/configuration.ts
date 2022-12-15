import bunyan from "bunyan";
import dotenv from "dotenv";
dotenv.config({});

class Config {
  public MONGO_URI: string | undefined;
  public JWT_TOKEN_SECRET: string | undefined;
  public COOKIE_SECRET_ONE: string | undefined;
  public COOKIE_SECRET_TWO: string | undefined;
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_HOST: string | undefined;

  private readonly DEFAULT_DATABASE_URL =
    "mongodb://127.0.0.1:27017/PeepsArena";

  constructor() {
    this.MONGO_URI = process.env.MONGO_URI || this.DEFAULT_DATABASE_URL;
    this.JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || "1234";
    this.COOKIE_SECRET_ONE = process.env.COOKIE_SECRET_ONE || "";
    this.COOKIE_SECRET_TWO = process.env.COOKIE_SECRET_TWO || "";
    this.NODE_ENV = process.env.NODE_ENV || "";
    this.CLIENT_URL = process.env.CLIENT_URL || "";
    this.REDIS_HOST = process.env.REDIS_HOST || "";
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: "debug" });
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined.`);
      }
    }
  }
}

export const config: Config = new Config();
