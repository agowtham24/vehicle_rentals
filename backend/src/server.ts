import Config from "./config";
if (!process.env.DB_URL) {
  console.error("❌ DB_URL is not set in environment variables.");
  process.exit(1);
}

if (!process.env.NODE_ENV) {
  console.error("❌ NODE_ENV is not set in environment variables.");
  process.exit(1);
}
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import figlet from "figlet";
import chalk from "chalk";
import "./Models";
import { connectDB } from "./mongoDB-setup";
import { requestLogger } from "./Middlewares/logger";
import vehicleModelRouter from "./Routes/vehicleModelRoutes";
import vehicleRouter from "./Routes/vehicleRoutes";
import batteryRouter from "./Routes/batteryRoutes";
import bussinessAccountRouter from "./Routes/bussinessAccountRoutes";
import bussinessPricingRouter from "./Routes/bussinessPricingRoutes";
import batteryModelRouter from "./Routes/batteryModelRoutes";
import riderRouter from "./Routes/riderRoutes";
import rentalRouter from "./Routes/rentalRoutes";
import ErrorHandler from "./Middlewares/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  compression({
    level: 6,
    threshold: 0,
  })
);
app.use(helmet());
app.use(requestLogger);

app.get(`${Config.API_PREFIX}health`, async (req: Request, res: Response) => {
  res.json({ message: "hai hello" });
});

app.use(`${Config.API_PREFIX}batteryModels`, batteryModelRouter);
app.use(`${Config.API_PREFIX}vehicleModels`, vehicleModelRouter);
app.use(`${Config.API_PREFIX}batteries`, batteryRouter);
app.use(`${Config.API_PREFIX}vehicles`, vehicleRouter);
app.use(`${Config.API_PREFIX}bussinessAccounts`, bussinessAccountRouter);
app.use(`${Config.API_PREFIX}bussinessPricings`, bussinessPricingRouter);
app.use(`${Config.API_PREFIX}riders`, riderRouter);
app.use(`${Config.API_PREFIX}rentals`, rentalRouter);

app.use(ErrorHandler);

async function startServer() {
  try {
    await connectDB();
    app.listen(Config.PORT, () => {
      console.log("..................................................");
      console.log(
        chalk.green(
          figlet.textSync("VehicleRental", {
            font: "Bulbhead",
            horizontalLayout: "default",
            verticalLayout: "default",
            width: 80,
            whitespaceBreak: true,
          })
        )
      );
      console.log(
        `server running on port : ${Config.PORT} in ${Config.NODE_ENV} mode`
      );
      console.log("...................................................");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
startServer();
