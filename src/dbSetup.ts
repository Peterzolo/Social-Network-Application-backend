import mongoose from "mongoose";
import { config } from "./configuration";
import Logger from "bunyan";

const log: Logger = config.createLogger("Database-Setup");

export const mongoDbConnect = () => {
  const connect = () => {
    mongoose.set("strictQuery", true);
    mongoose
      .connect(config.MONGO_URI!)
      .then(() => {
        log.info("Database connected successfully");
      })
      .catch((error) => {
        log.error("Something went wrong", error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on("disconnected", connect);
};

// export const mongoDbConnect = async () => {
//   mongoose.set("strictQuery", true);
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/peeps");
//     console.log("MongoDB connected");
//   } catch (err) {
//     console.log(err);
//     process.exit(1);
//   }
// };
