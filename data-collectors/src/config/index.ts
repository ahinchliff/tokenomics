import { getEnvVariable } from "../../../core-backend/build/utils";

const config: config.Config = {
  newEventEndpoint: {
    url: getEnvVariable("NEW_EVENT_ENDPOINT_URL"),
    password: getEnvVariable("NEW_EVENT_ENDPOINT_PASSWORD"),
  },
  mysql: {
    host: getEnvVariable("MYSQL_HOST"),
    port: getEnvVariable("MYSQL_PORT"),
    user: getEnvVariable("MYSQL_USER"),
    password: getEnvVariable("MYSQL_PASSWORD"),
    database: getEnvVariable("MYSQL_DATABASE"),
    connectionLimit: getEnvVariable("MYSQL_CONNECTION_LIMIT"),
  },
  alchemy: {
    baseUrl: "https://eth-mainnet.alchemyapi.io/v2",
    apiKey: getEnvVariable("ALCHEMY_API_KEY"),
  },
  // coinMarketCap: {
  //   apiKey: getEnvVariable("COIN_MARKET_CAP_API_KEY"),
  //   baseUrl: "http://pro-api.coinmarketcap.com/v1",
  // },
  // theGraph: {
  //   blockEndpoint:
  //     "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
  // },
  // cryptoCompare: {
  //   apiKey: getEnvVariable("CRYPTO_COMPARE_API_KEY"),
  //   baseUrl: "https://min-api.cryptocompare.com/data",
  // },
};

export default config;
