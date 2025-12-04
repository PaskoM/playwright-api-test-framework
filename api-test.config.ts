import dotenv from "dotenv";
dotenv.config();

const processENV = process.env.TEST_ENV;
const env = processENV || "dev";

const config = {
  apiURL: "https://conduit-api.bondaracademy.com/api",
  userEmail: "paskomariola@gmail.com",
  userPassword: "Mariola1!",
};

if (env === "prod") {
  if (!process.env.PROD_USERNAME || !process.env.PROD_PASSWORD) {
    throw Error(`Missing required environment variables`);
  }
  (config.userEmail = process.env.PROD_USERNAME as string),
    (config.userPassword = process.env.PROD_PASSWORD as string);
}

export { config };
