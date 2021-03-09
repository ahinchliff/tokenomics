declare namespace api {
  interface Logger {
    silly: (message: string, data?: any) => void;
    debug: (message: string, data?: any) => void;
    info: (message: string, data?: any) => void;
    warn: (message: string, err?: any, data?: any) => void;
    error: (message: string, err: any, data?: any) => void;
    setUserId: (userId: number) => void;
    setEnvironment: (
      enviroment: "test" | "development" | "staging" | "production"
    ) => void;
  }
}
