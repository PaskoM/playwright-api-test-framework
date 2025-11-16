const processENV = process.env.TEST_ENV;
const env = processENV || "dev";

const config = {
  apiURL: "https://conduit-api.bondaracademy.com/api",
  userEmail: "paskomariola@gmail.com",
  userPassword: "Mariola1!",
};

if (env === "dev") {
  (config.userEmail = "paskomariola@gmail.com"),
    (config.userPassword = "Mariola1!");
}

export { config };
