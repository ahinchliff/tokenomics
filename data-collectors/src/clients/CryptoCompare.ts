// import * as dayjs from "dayjs";
// import Api from "./api-client";

// export default class CrytpoCompare {
//   constructor(
//     private api: Api,
//     private config: config.Config["cryptoCompare"]
//   ) {}

//   public getHistoricMKRPriceInUSD = async (when: Date) =>
//     this.getFreeHistoricPriceInUSD("MKR", when);

//   public getHistoricETHPriceInUSD = async (when: Date) =>
//     this.getFreeHistoricPriceInUSD("ETH", when);

//   private getFreeHistoricPriceInUSD = async (
//     symbol: string,
//     _when: Date
//   ): Promise<{
//     accuracy: "minute" | "hour" | "day";
//     price: number;
//   }> => {
//     const now = dayjs();
//     const when = dayjs(_when);

//     if (now.subtract(1, "day").isBefore(when)) {
//       return {
//         accuracy: "minute",
//         price: await this.getHistoricPriceInUSD(symbol, when.unix(), "minute"),
//       };
//     } else if (now.subtract(3, "month").isBefore(when)) {
//       return {
//         accuracy: "hour",
//         price: await this.getHistoricPriceInUSD(symbol, when.unix(), "hour"),
//       };
//     } else {
//       return {
//         accuracy: "day",
//         price: await this.getHistoricPriceInUSD(symbol, when.unix(), "day"),
//       };
//     }
//   };

//   // private getCurrentPriceInUSD = async (symbol: string): Promise<number> => {
//   //   const result = await this.api.get<{
//   //     USD: number;
//   //   }>(
//   //     `${this.config.baseUrl}/price?fsym=${symbol}&tsyms=USD&api_key=${this.config}`
//   //   );
//   //   return result.USD;
//   // };

//   private getHistoricPriceInUSD = async (
//     symbol: string,
//     when: number,
//     accuracy: "minute" | "hour" | "day"
//   ) => {
//     const result = await this.api.get<{
//       Data: {
//         Data: { high: number }[];
//       };
//     }>(
//       `${this.config.baseUrl}/v2/histo${accuracy}?fsym=${symbol}&tsym=USD&limit=1&toTs=${when}&api_key=${this.config}`
//     );

//     console.log(result);

//     return result.Data.Data[0].high;
//   };
// }
