declare namespace data {
  interface IMysqlConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    connectionLimit: number;
    port: number;
  }
}
