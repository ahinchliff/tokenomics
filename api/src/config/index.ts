import { getEnvVariable } from "../../../core-backend/build/utils";

const config: api.Config = {
  environment: getEnvVariable("NODE_ENV"),
  port: getEnvVariable("PORT"),
  dataCollectorPassword: getEnvVariable("DATA_COLLECTOR_PASSWORD"),
  mysql: {
    host: getEnvVariable("MYSQL_HOST"),
    port: getEnvVariable("MYSQL_PORT"),
    user: getEnvVariable("MYSQL_USER"),
    password: getEnvVariable("MYSQL_PASSWORD"),
    database: getEnvVariable("MYSQL_DATABASE"),
    connectionLimit: getEnvVariable("MYSQL_CONNECTION_LIMIT"),
  },
  jwt: {
    secret: getEnvVariable("JWT_SECRET"),
    validForInHours: getEnvVariable("JWT_VALID_FOR_IN_HOURS"),
  },
  alchemy: {
    baseUrl: "https://eth-mainnet.alchemyapi.io/v2",
    apiKey: getEnvVariable("ALCHEMY_API_KEY"),
  },
};

export default config;
