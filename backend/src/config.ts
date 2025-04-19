require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const Config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV,
  DB_URL: process.env.DB_URL,
  API_PREFIX: process.env.API_PREFIX || "/api/v1/",
  JWT_PRIVATE_KEY_PATH: "./keys/privateKey.pem",
  JWT_PUBLIC_KEY_PATH: "./keys/publicKey.pem",
  DB_COLLECTIONS: {
    batteryModels: "batterymodels",
    batteries: "batteries",
    bussinessPricings: "bussinesspricings",
    bussinessAccounts: "bussinessaccounts",
    rentals: "rentals",
    riders: "riders",
    vehicles: "vehicles",
    vehicleModels: "vehiclemodels",
  },
};

export default Config;
