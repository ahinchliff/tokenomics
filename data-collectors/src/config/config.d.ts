declare namespace config {
  type Config = {
    newEventEndpoint: {
      url: string;
      password: string;
    };
    mysql: data.IMysqlConfig;
    alchemy: {
      baseUrl: string;
      apiKey: string;
    };
    // coinMarketCap: {
    //   apiKey: string;
    //   baseUrl: string;
    // };
    // theGraph: {
    //   blockEndpoint: string;
    // };
    // cryptoCompare: {
    //   apiKey: string;
    //   baseUrl: string;
    // };
  };
}
