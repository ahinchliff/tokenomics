declare namespace api {
  type Config = {
    environment: "test" | "development" | "staging" | "production";
    port: string;
    mysql: data.IMysqlConfig;
    dataCollectorPassword: string;
    jwt: {
      secret: string;
      validForInHours: number;
    };
    alchemy: {
      baseUrl: string;
      apiKey: string;
    };
  };
}
