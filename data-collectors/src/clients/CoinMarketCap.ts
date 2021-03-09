// import Api from "./api-client";

// export default class CoinMarketCap {
//   constructor(
//     private api: Api,
//     private config: config.Config["coinMarketCap"]
//   ) {}

//   public getMKRPriceInUSD = async (): Promise<number> => {
//     const result = await this.api.get<{
//       data: {
//         MKR: {
//           quote: {
//             USD: {
//               price: string;
//             };
//           };
//         };
//       };
//     }>(
//       `${this.config.baseUrl}/cryptocurrency/quotes/latest?symbol=MKR&CMC_PRO_API_KEY=${this.config.apiKey}`
//     );
//     const price = result.data.MKR.quote.USD.price;
//     return Number(price);
//   };
// }
