import mongoose from "mongoose";
import { logger } from "../app.js";

mongoose.Promise = global.Promise;

export default {
    connect(connectionString) {
        mongoose
            .connect(connectionString)
            .then(() => {
                logger.info("Connected to MongoDB");
            })
            .catch((e) => {
                //Fatal error, stop the application
                logger.error("Error connecting to mongodb");
                logger.error(e);
                process.exit(1);
            });
    },
};
