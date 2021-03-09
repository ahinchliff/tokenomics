// import { ethers, BigNumber } from "ethers";
// import * as dayjs from "dayjs";
// import makerContracts, {
//   FlapContract,
// } from "../../../../core-backend/build/smart-contracts/maker";
// import BlockClient from "../../clients/BlockClient";
// import CrytpoCompare from "../../clients/CryptoCompare";
// import {
//   fetchEvents,
//   Event,
//   DSNoteEvent,
//   fetchDSNoteEvents,
// } from "./utils/event-utils";

// type KickEvent = Event<{
//   id: BigNumber;
//   lot: BigNumber;
//   bid: BigNumber;
// }>;

// type TendEvent = DSNoteEvent<
//   "tend",
//   {
//     id: BigNumber;
//     lot: BigNumber;
//     bid: BigNumber;
//   }
// >;

// type DealEvent = DSNoteEvent<"deal", { id: BigNumber }>;

// const getFlapAuctionData = async (
//   fromBlock: number,
//   toBlock: number,
//   provider: ethers.providers.Provider,
//   mysql: data.DataClients,
//   blockClient: BlockClient,
//   crytpoCompare: CrytpoCompare
// ): Promise<void> => {
//   const { flap } = makerContracts(provider);

//   const flapKickEvents = await fetchEvents<KickEvent>(
//     flap,
//     ethers.utils.id("Kick(uint256,uint256,uint256)"),
//     fromBlock,
//     toBlock
//   );

//   const noteEvents = await fetchDSNoteEvents<TendEvent | DealEvent>(
//     flap,
//     ["tend", "deal"],
//     fromBlock,
//     toBlock
//   );

//   const flapDealEvents = noteEvents.filter(
//     (e) => e.method === "deal"
//   ) as DealEvent[];

//   const flapTendEvents = noteEvents.filter(
//     (e) => e.method === "tend"
//   ) as TendEvent[];

//   for (const kick of flapKickEvents) {
//     await createAuctionFromKickEvent(kick, blockClient, mysql, crytpoCompare);
//   }

//   for (const tend of flapTendEvents) {
//     await createAuctionBidFromTendEvent(
//       tend,
//       provider,
//       blockClient,
//       mysql,
//       flap,
//       crytpoCompare
//     );
//   }

//   for (const deal of flapDealEvents) {
//     await updateAuctionWithDealEvent(
//       deal,
//       provider,
//       blockClient,
//       mysql,
//       crytpoCompare
//     );
//   }
// };

// const createAuctionFromKickEvent = async (
//   event: KickEvent,
//   blockClient: BlockClient,
//   mysql: data.DataClients,
//   crytpoCompare: CrytpoCompare
// ): Promise<void> => {
//   const block = await blockClient.getBlock(event.blockNumber);
//   const timestamp = dayjs.unix(Number(block.timestamp));
//   const transaction = await event.getTransaction();
//   const transactionReceipt = await event.getTransactionReceipt();

//   const ethPrice = await crytpoCompare.getHistoricETHPriceInUSD(
//     timestamp.toDate()
//   );

//   await mysql.makerFlapAuction.create({
//     makerFlapAuctionId: event.args.id.toNumber(),
//     lot: ethers.utils.formatUnits(event.args.lot, 45),
//     kickBlockNumber: event.blockNumber,
//     kickTimestamp: timestamp.toDate(),
//     kickTransactionHash: transactionReceipt.transactionHash,
//     kickSenderAddress: transactionReceipt.from,
//     kickGasUsed: transactionReceipt.gasUsed.toNumber(),
//     kickGasPrice: transaction.gasPrice.toNumber(),
//     kickEthPrice: ethPrice.price,
//     kickEthPriceAccuracy: ethPrice.accuracy,
//   });
// };

// const updateAuctionWithDealEvent = async (
//   event: DealEvent,
//   provider: ethers.providers.Provider,
//   blockClient: BlockClient,
//   mysql: data.DataClients,
//   crytpoCompare: CrytpoCompare
// ): Promise<void> => {
//   const block = await blockClient.getBlock(event.blockNumber);
//   const timestamp = dayjs.unix(Number(block.timestamp));
//   const transaction = await provider.getTransaction(event.transactionHash);
//   const transactionReceipt = await provider.getTransactionReceipt(
//     event.transactionHash
//   );

//   const auctionId = event.args.id.toNumber();

//   const ethPrice = await crytpoCompare.getHistoricETHPriceInUSD(
//     timestamp.toDate()
//   );

//   const bids = await mysql.makerFlapAuctionBid.getMany({
//     makerFlapAuctionId: auctionId,
//   });

//   const lastBid = bids.sort((a, b) => b.blockNumber - a.blockNumber)[0];

//   const auctionEndedAt = dayjs(lastBid.timestamp).add(lastBid.ttl, "seconds");

//   const mkrPrice = await crytpoCompare.getHistoricETHPriceInUSD(
//     auctionEndedAt.toDate()
//   );

//   await mysql.makerFlapAuction.update(
//     { makerFlapAuctionId: auctionId },
//     {
//       dealBlockNumber: event.blockNumber,
//       dealTimestamp: timestamp.toDate(),
//       dealTransactionHash: transactionReceipt.transactionHash,
//       dealSenderAddress: transactionReceipt.from,
//       dealGasUsed: transactionReceipt.gasUsed.toNumber(),
//       dealGasPrice: transaction.gasPrice.toNumber(),
//       dealEthPrice: ethPrice.price,
//       dealEthPriceAccuracy: ethPrice.accuracy,
//       mkrPriceWhenAuctionEnded: mkrPrice.price,
//       mkrPriceWhenAuctionEndedAccuracy: mkrPrice.accuracy,
//     }
//   );
// };

// const createAuctionBidFromTendEvent = async (
//   event: TendEvent,
//   provider: ethers.providers.Provider,
//   blockClient: BlockClient,
//   mysql: data.DataClients,
//   flap: FlapContract,
//   crytpoCompare: CrytpoCompare
// ): Promise<void> => {
//   const block = await blockClient.getBlock(event.blockNumber);
//   const timestamp = dayjs.unix(Number(block.timestamp));
//   const transaction = await provider.getTransaction(event.transactionHash);

//   const transactionReceipt = await provider.getTransactionReceipt(
//     event.transactionHash
//   );

//   const ttl = await flap.ttl({ blockTag: event.blockNumber });

//   const ethPrice = await crytpoCompare.getHistoricETHPriceInUSD(
//     timestamp.toDate()
//   );

//   const mkrPrice = await crytpoCompare.getHistoricETHPriceInUSD(
//     timestamp.toDate()
//   );

//   await mysql.makerFlapAuctionBid.create({
//     makerFlapAuctionId: event.args.id.toNumber(),
//     bid: ethers.utils.formatUnits(event.args.bid, 18),
//     blockNumber: event.blockNumber,
//     timestamp: timestamp.toDate(),
//     transactionHash: transactionReceipt.transactionHash,
//     senderAddress: transactionReceipt.from,
//     ttl,
//     gasUsed: transactionReceipt.gasUsed.toNumber(),
//     gasPrice: transaction.gasPrice.toNumber(),
//     ethPrice: ethPrice.price,
//     ethPriceAccuracy: ethPrice.accuracy,
//     mkrPrice: mkrPrice.price,
//     mkrPriceAccuracy: mkrPrice.accuracy,
//   });
// };

// export default getFlapAuctionData;
